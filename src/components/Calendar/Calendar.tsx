import { useEffect, useRef, useState } from 'react';
import { Client, StompSubscription } from '@stomp/stompjs';
import { useCookies } from 'react-cookie';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { getUserReservation } from '../../utils/api';

import CalendarHeader from './CalendarHeader';
import TimeSlots from './TimeSlots';
import Day from './Day';
import {
  useCalendarActions,
  useTimeSlots,
  useWeeks,
} from '../../store/calendarStore';

const parseISOTime = (timeString: string) => {
  // const time = dayjs(timeString, 'YYYY-MM-DDTHH:mm:ss');

  // return {
  // year: time.get('year'),
  // month: time.get('month'),
  // date: time.get('date'),
  // hour: time.get('hour'),
  // minute: time.get('minute'),
  // };

  const temp = timeString.split('T');
  return {
    day: temp[0],
    timeSlot: temp[0].slice(0, 5),
  };
};

interface ReservationData {
  startTime: string;
  endTime: string;
  roomId: number;
  profiles: string[];
}

import { useTimeSlots, useWeeks } from '../../store/calendarStore';

interface WeeklyViewCalendarProp {
  groupId: number;
}

const WeeklyViewCalendar = ({ groupId }: WeeklyViewCalendarProp) => {
  const [{ accessToken }, ,] = useCookies(['accessToken']);
  // TODO: 이렇게 지정해도 groupID 바뀔 때마다 topic 기준인 useEffect 다시 동작하는지 확인
  const topic = `/topic/${groupId}`;

  // TODO: 먼저 api로 데이터 받아와서 store 업데이트하기

  const { setReservationRoomId, setReservationParticipants } =
    useCalendarActions();
const WeeklyViewCalendar: React.FC = () => {

  const [client, setClient] = useState<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  useEffect(() => {
    const newClient = new Client({
      brokerURL: 'wss://www.sangyeop.shop/bbodok-websocket',
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 2000,
    });

    setClient(newClient);

    newClient.onConnect = frame => {
      console.log(`Connected: ${frame}`);
      subscriptionRef.current = newClient.subscribe(topic, message => {
        if (message.body) {
          console.log(`Received: ${message.body}`);
          const data = JSON.parse(message.body);

          console.log(data);
          // 한 칸마다 해당 날짜/시간, 유저가 예약한건지 아닌지, 방이 있다면 그 방 번호와 참여자가 저장됨
          // 날짜/시간 파싱해서 해당 날짜/시간에 방 번호와 참여자 저장. -> 유저 예약인지 아닌지는 useState로 토글식 상태 관리? 아니면 프로필 배열에서 찾아오기?
          const day = data.startTime.split('T')[0];
          const timeSlot = data.startTime.split('T')[1].slice(0, 5);
          const { roomId, profiles } = data;
          console.log('received', data, roomId, profiles);
          setReservationRoomId(day, timeSlot, roomId);
          setReservationParticipants(day, timeSlot, profiles);
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
  }, [accessToken, topic]);

  useEffect(() => {
    if (client && client.connected && subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();

      subscriptionRef.current = client.subscribe(topic, message => {
        if (message.body) {
          console.log(`Received: ${message.body}`);
        }
      });
    }
  }, [client, topic]);

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
    }
  };

  const cancelReservation = (roomId: number) => {
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
    }
  };

  const timeSlots = useTimeSlots();
  const weeks = useWeeks();

  return (
    <div className="grid grid-rows-calendar grid-cols-calendar bg-[#F6F6F6] w-[1556px] h-[41.5625rem] rounded-[1.25rem] overflow-auto">
      <span className="col-start-1 bg-[#F6F6F6] sticky top-0 z-10" />
      <div className="sticky top-0 z-10 col-span-6 col-start-2">
        <CalendarHeader weeks={weeks} />
      </div>
      <div className="sticky left-0 items-start col-span-1 col-start-1 bg-[#F6F6F6]">
        <TimeSlots timeSlots={timeSlots} />
      </div>
      {weeks.map((week, index) => (
        <div key={week.date} className={`col-start-${index + 2} col-span-1`}>
          <Day
            day={week.date}
            timeSlots={timeSlots}
            actions={{ createReservation, cancelReservation }}
          />
        </div>
      ))}
    </div>
  );
};

export default WeeklyViewCalendar;
