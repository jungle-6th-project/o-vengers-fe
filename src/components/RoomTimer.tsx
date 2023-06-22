import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import toArray from 'dayjs/plugin/toArray';

import { getUserNearestReservation } from '@/utils/api';
import { ROOM_EXPIRE_SEC, SEC_IN_MILLISEC } from './Timer';

dayjs.extend(duration);
dayjs.extend(toArray);

declare global {
  interface Window {
    roomExitModal: HTMLDialogElement;
  }
}

const ExitModal = () => {
  console.log('out');
};

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
    const { endTime: exitTime } = nearestReservationData;

    const intervalId = setInterval(() => {
      const newRemainingTime = dayjs.duration(
        dayjs(exitTime, 'YYYY-MM-DDTHH:mm:ss').diff(dayjs())
      );
      setRemainingTime(newRemainingTime);

      const newRemainingTimeInSec = newRemainingTime.asSeconds();
      setOnTimerIdle(newRemainingTimeInSec <= 0);

      if (newRemainingTimeInSec <= 0) {
        clearInterval(intervalId);
        ExitModal();
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
      <span>쉬는 시간까지 앞으로</span>
      <TimerDisplay onIdle={onTimerIdle} remainingTime={remainingTime} />
      <progress
        className="w-56 progress"
        value={ROOM_EXPIRE_SEC - remainingTime.asSeconds()}
        max={ROOM_EXPIRE_SEC}
      />
    </div>
  );
};

export default RoomTimer;
export { TimerDisplay };
