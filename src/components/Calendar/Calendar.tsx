import { useEffect, useRef, useState } from 'react';
import { Client, StompSubscription } from '@stomp/stompjs';
import { useCookies } from 'react-cookie';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { getGroupReservation, getUserReservation } from '../../utils/api';

import CalendarHeader from './CalendarHeader';
import TimeSlots from './TimeSlots';
import Day from './Day';
import {
  useCalendarActions,
  useTimeSlots,
  useWeeks,
} from '../../store/calendarStore';

interface ReservationData {
  startTime: string;
  endTime: string;
  roomId: number;
  profiles: string[];
}

interface WeeklyViewCalendarProp {
  groupId: number;
}

// TODO: groupID 추가
const WeeklyViewCalendar = ({ groupId }: WeeklyViewCalendarProp) => {
  const [{ accessToken }, ,] = useCookies(['accessToken']);
  const topic = `/topic/${groupId}`;

  // api로 유저 예약 데이터 받아와서 store 업데이트하기
  const {
    setReservationUserReservedStatus,
    setReservationRoomId,
    setReservationParticipants,
  } = useCalendarActions();

  const startSearchTime = dayjs();
  const endSearchTime = startSearchTime.add(3, 'week');
  const { data: userReservationData, isSuccess: userQuerySuccess } = useQuery(
    ['userReservations'],
    () =>
      getUserReservation(
        accessToken,
        groupId,
        startSearchTime.format('YYYY-MM-DDTHH:mm:ss'),
        endSearchTime.format('YYYY-MM-DDTHH:mm:ss')
      ),
    {
      staleTime: Infinity,
      cacheTime: 0,
    }
  );

  useEffect(() => {
    if (userReservationData) {
      userReservationData.forEach((datum: ReservationData) => {
        setReservationUserReservedStatus(datum.startTime, true);
        setReservationRoomId(datum.startTime, datum.roomId);
        setReservationParticipants(datum.startTime, datum.profiles);
      });
    }
  }, [
    userReservationData,
    groupId,
    setReservationUserReservedStatus,
    setReservationRoomId,
    setReservationParticipants,
  ]);

  // api로 그룹원 예약 데이터 받아와서 store 업데이트하기
  const { data: groupReservationData } = useQuery(
    ['groupReservations'],
    () =>
      getGroupReservation(
        accessToken,
        groupId,
        startSearchTime.format('YYYY-MM-DDTHH:mm:ss'),
        endSearchTime.format('YYYY-MM-DDTHH:mm:ss')
      ),
    {
      staleTime: Infinity,
      cacheTime: 0,
      enabled: userQuerySuccess,
    }
  );

  useEffect(() => {
    if (groupReservationData) {
      groupReservationData.forEach((datum: ReservationData) => {
        setReservationRoomId(datum.startTime, datum.roomId);
        setReservationParticipants(datum.startTime, datum.profiles);
      });
    }
  }, [
    groupReservationData,
    groupId,
    setReservationRoomId,
    setReservationParticipants,
  ]);

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
          const data = JSON.parse(message.body);
          const { roomId, profiles } = data;

          setReservationRoomId(data.startTime, roomId);
          setReservationParticipants(data.startTime, profiles);
        }
      });
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
      // Clean up function on component unmount
      // TODO: 중간에 client 몇 번 바뀌었어도 잘 닫히는지 확인
      newClient.deactivate();
    };
  }, [
    accessToken,
    groupId,
    topic,
    setReservationParticipants,
    setReservationRoomId,
  ]);

  useEffect(() => {
    if (client && client.connected && subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();

      subscriptionRef.current = client.subscribe(topic, message => {
        if (message.body) {
          console.log(`Received: ${message.body}`);
        }
      });
    }
  }, [client, groupId, topic]);

  const createReservation = (startTime: string, endTime: string) => {
    if (client && client.connected) {
      client.publish({
        destination: '/app/add',
        body: JSON.stringify({
          // eslint-disable-next-line object-shorthand
          groupId: groupId,
          // eslint-disable-next-line object-shorthand
          startTime: startTime,
          // eslint-disable-next-line object-shorthand
          endTime: endTime,
        }),
      });
      // TODO: 잘 올라갔는지 확인 가능?
      setReservationUserReservedStatus(startTime, true);
    }
  };

  const joinReservation = (startTime: string, roomId: number) => {
    if (client && client.connected) {
      client.publish({
        destination: '/app/join',
        body: JSON.stringify({
          // eslint-disable-next-line object-shorthand
          roomId: roomId,
          // eslint-disable-next-line object-shorthand
          groupId: groupId,
        }),
      });
      // TODO: 잘 올라갔는지 확인 가능?
      setReservationUserReservedStatus(startTime, true);
    }
  };

  const cancelReservation = (startTime: string, roomId: number) => {
    if (client && client.connected) {
      client.publish({
        destination: '/app/join',
        body: JSON.stringify({
          // eslint-disable-next-line object-shorthand
          roomId: roomId,
          // eslint-disable-next-line object-shorthand
          groupId: groupId,
        }),
      });
      // TODO: 잘 올라갔는지 확인 가능?
      setReservationUserReservedStatus(startTime, false);
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
