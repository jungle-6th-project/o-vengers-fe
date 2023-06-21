import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import toArray from 'dayjs/plugin/toArray';

import { getUserNearestReservation } from '@/utils/api';
import { ROOM_EXPIRE_SEC, SEC_IN_MILLISEC } from './Timer';

dayjs.extend(duration);
dayjs.extend(toArray);

const TimerDisplay = ({
  onIdle,
  remainingTime,
}: {
  onIdle: boolean;
  remainingTime: duration.Duration;
}) => {
  const formatTime = (durationTime: duration.Duration) => {
    if (onIdle) {
      return '00:00';
    }
    const formattedTime = durationTime.format('mm:ss');
    return formattedTime;
  };

  return <p className="font-mono text-5xl">{formatTime(remainingTime)}</p>;
};

const RoomTimer = () => {
  // get data only once, on mount
  const { data: nearestReservationData } = useQuery(
    ['userNearestReservation'],
    getUserNearestReservation,
    { staleTime: Infinity }
  );

  const [remainingTime, setRemainingTime] = useState(
    dayjs.duration(ROOM_EXPIRE_SEC * SEC_IN_MILLISEC)
  );
  const [onTimerIdle, setOnTimerIdle] = useState(true);

  useEffect(() => {
    if (!nearestReservationData) {
      setRemainingTime(dayjs.duration(ROOM_EXPIRE_SEC * SEC_IN_MILLISEC));
      setOnTimerIdle(false);
      return () => {};
    }
    const { endTime: exitTime } = nearestReservationData;

    const intervalId = setInterval(() => {
      const newRemainingTime = dayjs.duration(
        dayjs(exitTime, 'YYYY-MM-DDTHH:mm:ss').diff(dayjs())
      );
      setRemainingTime(newRemainingTime);

      const newRemainingTimeInSec = newRemainingTime.asSeconds();
      if (newRemainingTimeInSec <= 0) {
        setOnTimerIdle(true);
        clearInterval(intervalId);
        // TODO: modal open => redirect
      }

      return () => {
        clearInterval(intervalId);
      };
    }, SEC_IN_MILLISEC);

    return () => {
      clearInterval(intervalId);
    };
  }, [nearestReservationData]);

  return (
    <div className="rounded-2xl">
      <span>쉬는시간까지 남은 시간</span>
      <TimerDisplay onIdle={onTimerIdle} remainingTime={remainingTime} />
    </div>
  );
};

export default RoomTimer;
export { TimerDisplay };
