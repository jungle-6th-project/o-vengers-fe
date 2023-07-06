import { useEffect, useRef, useState } from 'react';
import { Client, StompSubscription } from '@stomp/stompjs';
import { useCookies } from 'react-cookie';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import {
  getGroupReservation,
  getUserNearestReservation,
  getUserReservation,
} from '@/utils/api';

import CalendarHeader from './CalendarHeader';
import TimeSlots from './TimeSlots';
import Day from './Day';

import { useGroupReservationActions } from '@/store/groupReservationStore';
import { useUserReservationActions } from '@/store/userReservationStore';
import { useUser } from '@/store/userStore';
import { useWeeks } from '@/store/calendarStore';
import { useGroupColor, useSelectedGroupId } from '@/store/groupStore';

interface ReservationData {
  startTime: string;
  endTime: string;
  roomId: number;
  profiles: string[];
  memberIds: number[];
}

interface UserReservationData extends ReservationData {
  groupId: number;
}

const WeeklyViewCalendar = () => {
  const groupId = useSelectedGroupId();
  const [{ accessToken }, ,] = useCookies(['accessToken']);
  const topic = `/topic/${groupId}`;
  const user = useUser();

  const { setGroupReservation, resetGroupReservation } =
    useGroupReservationActions();
  const { setUserReservation, removeUserReservation } =
    useUserReservationActions();

  const startSearchTime = dayjs().startOf('day');
  const endSearchTime = startSearchTime.add(2, 'week');
  const startSearchTimeString = startSearchTime.format('YYYY-MM-DDTHH:mm:ss');
  const endSearchTimeString = endSearchTime.format('YYYY-MM-DDTHH:mm:ss');

  // api로 유저 예약 데이터 받아와서 store 업데이트하기
  useQuery(
    ['userReservations'],
    () => getUserReservation(startSearchTimeString, endSearchTimeString),
    {
      staleTime: Infinity,
      cacheTime: 0,
      onSuccess: returnedData =>
        returnedData.forEach(
          ({
            startTime,
            groupId: reservedGroupId,
            roomId,
            profiles,
            memberIds,
          }: UserReservationData) => {
            setUserReservation(
              startTime,
              reservedGroupId,
              roomId,
              profiles,
              memberIds
            );
          }
        ),
    }
  );

  // api로 가장 가까운 유저 예약 데이터 받아와서 캐시에 저장하기
  const { refetch: nearestRefetch } = useQuery(
    ['userNearestReservation'],
    getUserNearestReservation,
    {
      staleTime: Infinity,
    }
  );

  // api로 그룹원 예약 데이터 받아와서 store 업데이트하기
  const { refetch: groupRefetch } = useQuery(
    ['groupReservations'],
    () => {
      return getGroupReservation(
        groupId,
        startSearchTimeString,
        endSearchTimeString
      );
    },
    {
      staleTime: Infinity,
      cacheTime: 0,
      onSuccess: returnedData =>
        returnedData.forEach(
          ({ startTime, roomId, profiles, memberIds }: ReservationData) => {
            setGroupReservation(startTime, roomId, profiles, memberIds);
          }
        ),
    }
  );

  useEffect(() => {
    resetGroupReservation();
    groupRefetch();
  }, [groupId, groupRefetch, resetGroupReservation]);

  // STOMP 연결
  const [client, setClient] = useState<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  useEffect(() => {
    const newClient = new Client({
      brokerURL:
        import.meta.env.MODE === 'development'
          ? 'wss://www.api-bbodog.shop/bbodok-websocket'
          : 'wss://www.sangyeop.shop/bbodok-websocket',
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 2000,
    });

    setClient(newClient);

    newClient.onConnect = () => {
      subscriptionRef.current = newClient.subscribe(topic, message => {
        if (message.body) {
          const data: ReservationData = JSON.parse(message.body);
          const { startTime, roomId, profiles, memberIds } = data;

          setGroupReservation(startTime, roomId, profiles, memberIds);
          if (memberIds && memberIds.includes(user.memberId)) {
            setUserReservation(startTime, groupId, roomId, profiles, memberIds);
          }

          nearestRefetch();
        }
      });
    };

    newClient.activate();

    return () => {
      newClient.deactivate();
    };
  }, [
    accessToken,
    groupId,
    topic,
    user.memberId,
    setGroupReservation,
    setUserReservation,
    nearestRefetch,
  ]);

  const createReservation = (startTime: string, endTime: string) => {
    if (client && client.connected) {
      client.publish({
        destination: '/app/add',
        body: JSON.stringify({ groupId, startTime, endTime }),
      });
    }
  };

  const joinReservation = (roomId: number) => {
    if (client && client.connected) {
      client.publish({
        destination: '/app/join',
        body: JSON.stringify({ roomId, groupId }),
      });
    }
  };

  const cancelReservation = (startTime: string, roomId: number) => {
    if (client && client.connected) {
      client.publish({
        destination: '/app/join',
        body: JSON.stringify({ roomId, groupId }),
      });
      removeUserReservation(startTime);
    }
  };

  const weeks = useWeeks();
  const groupColor = useGroupColor(groupId);
  useEffect(() => {
    const now = dayjs();
    const nearestTimeBefore =
      now.minute() < 30 ? `${(now.hour() - 1) % 24}:30` : `${now.hour()}:00`;
    const timeElement = document.getElementById(nearestTimeBefore);

    timeElement?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div
      className={`grid grid-rows-calendar grid-cols-calendar bg-calendar w-full w-max-calendar ${
        groupColor ? `border-${groupColor}` : 'border-calendar'
      } border-4 rounded-2xl overflow-auto h-full`}
    >
      <span className="col-start-1 bg-calendar sticky top-0 left-0 h-[96px] z-50 after:absolute after:w-[20%] after:h-[30%] after:border-r-[1px] after:border-b-[1px] after:border-dashed after:border-calendar-border after:right-0 after:bottom-0" />
      <div className="sticky top-0 z-40 col-span-6 col-start-2">
        <CalendarHeader />
      </div>
      <div className="sticky left-0 z-40 items-start col-span-1 col-start-1 bg-calendar">
        <TimeSlots />
      </div>
      {weeks.map((week, index) => (
        <div key={week.date} className={`col-start-${index + 2} col-span-1`}>
          <Day
            day={week.date}
            actions={{ createReservation, joinReservation, cancelReservation }}
          />
        </div>
      ))}
    </div>
  );
};

export default WeeklyViewCalendar;
