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
import { useTimeSlots, useWeeks } from '@/store/calendarStore';

interface ReservationData {
  startTime: string;
  endTime: string;
  roomId: number;
  profiles: string[];
}

interface UserReservationData extends ReservationData {
  groupId: number;
}

interface WeeklyViewCalendarProp {
  groupId: number;
}

const WeeklyViewCalendar = ({ groupId }: WeeklyViewCalendarProp) => {
  const [{ accessToken }, ,] = useCookies(['accessToken']);
  const topic = `/topic/${groupId}`;
  const user = useUser();

  const { setGroupReservation, resetGroupReservationStore } =
    useGroupReservationActions();
  const { setUserReservation, removeUserReservation } =
    useUserReservationActions();

  const startSearchTime = dayjs();
  const endSearchTime = startSearchTime.add(3, 'week');
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
          }: UserReservationData) => {
            setUserReservation(startTime, reservedGroupId, roomId, profiles);
          }
        ),
    }
  );

  // api로 가장 가까운 유저 예약 데이터 받아와서 store 업데이트하기
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
          ({ startTime, roomId, profiles }: ReservationData) => {
            setGroupReservation(startTime, roomId, profiles);
          }
        ),
    }
  );

  useEffect(() => {
    resetGroupReservationStore();
    groupRefetch();
  }, [groupId, groupRefetch, resetGroupReservationStore]);

  // STOMP 연결
  const [client, setClient] = useState<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  useEffect(() => {
    const newClient = new Client({
      brokerURL: 'wss://www.sangyeop.shop/bbodok-websocket',
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
    });

    setClient(newClient);

    newClient.onConnect = frame => {
      console.log(`Connected: ${frame}`);

      subscriptionRef.current = newClient.subscribe(topic, message => {
        if (message.body) {
          console.log(`Received: ${message.body}`);
          const data: ReservationData = JSON.parse(message.body);
          const { startTime, roomId, profiles } = data;

          setGroupReservation(startTime, roomId, profiles);
          if (profiles && profiles.includes(user.profile)) {
            setUserReservation(startTime, groupId, roomId, profiles);
          }

          nearestRefetch();
        }
      });
    };

    newClient.onDisconnect = frame => {
      console.log(`Disconnected: ${frame}`);
    };

    newClient.onStompError = frame => {
      console.log(`Broker reported error: ${frame.headers.message}`);
      console.log(`Additional details: ${frame.body}`);
    };

    newClient.onWebSocketClose = event => {
      console.log('WebSocket closed. Event:', event);
    };

    newClient.beforeConnect = () => {
      console.log('About to connect');
    };

    newClient.activate();

    return () => {
      newClient.deactivate();
    };
  }, [
    accessToken,
    groupId,
    topic,
    user.profile,
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

  const timeSlots = useTimeSlots();
  const weeks = useWeeks();

  return (
    <div className="grid grid-rows-calendar grid-cols-calendar bg-[#F6F6F6] w-[1556px] h-[41.5625rem] rounded-[1.25rem] overflow-auto">
      <span className="col-start-1 bg-[#F6F6F6] sticky top-0 left-0 z-50" />
      <div className="sticky top-0 z-40 col-span-6 col-start-2">
        <CalendarHeader weeks={weeks} />
      </div>
      <div className="sticky left-0 z-40 items-start col-span-1 col-start-1 bg-[#F6F6F6]">
        <TimeSlots timeSlots={timeSlots} />
      </div>
      {weeks.map((week, index) => (
        <div key={week.date} className={`col-start-${index + 2} col-span-1`}>
          <Day
            day={week.date}
            timeSlots={timeSlots}
            actions={{ createReservation, joinReservation, cancelReservation }}
          />
        </div>
      ))}
    </div>
  );
};

export default WeeklyViewCalendar;
