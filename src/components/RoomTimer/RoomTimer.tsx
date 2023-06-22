import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import dayjs from 'dayjs';

import { getUserNearestReservation } from '@/utils/api';
import { ROOM_EXPIRE_SEC, SEC_IN_MILLISEC } from '@/components/Timer/Timer';
import ExitModal from './RoomExitModal';
import RoomTimerDisplay from './RoomTimerDisplay';

const RoomTimer = () => {
  // 가장 가까운 예약 정보를 받아옴
  const { data: nearestReservationData } = useQuery(
    ['userNearestReservation'],
    getUserNearestReservation,
    { staleTime: Infinity }
  );

  // 남은 시간 및 타이머 상태 관리
  const [remainingTime, setRemainingTime] = useState(
    dayjs.duration(ROOM_EXPIRE_SEC * SEC_IN_MILLISEC)
  );
  const [onTimerIdle, setOnTimerIdle] = useState(false);

  // 가장 가까운 예약 시간을 받아와서 1초마다 남은 시간 계산
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
      }
    }, SEC_IN_MILLISEC);

    return () => {
      clearInterval(intervalId);
    };
  }, [nearestReservationData]);

  return (
    <div className="rounded-2xl">
      <span>
        {remainingTime.subtract(25, 'minutes').asSeconds() > 0
          ? '공부할 시간까지 앞으로'
          : '쉬는 시간까지 앞으로'}
      </span>
      <RoomTimerDisplay onIdle={onTimerIdle} remainingTime={remainingTime} />
      <progress
        className="progress w-56"
        value={ROOM_EXPIRE_SEC - remainingTime.asSeconds()}
        max={ROOM_EXPIRE_SEC}
      />
      <ExitModal roomId={nearestReservationData.roomId} expired={onTimerIdle} />
    </div>
  );
};

export default RoomTimer;
