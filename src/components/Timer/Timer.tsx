import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { enterVideoRoom, getUserNearestReservation } from '@/utils/api';
import EntryButton from './EntryButton';
import RoomEnterMessage from './RoomEnterMessage';
import TimerDisplay from './TimerDisplay';

dayjs.extend(duration);

export const SEC_IN_MILLISEC = 1000;
const MIN_IN_SEC = 60;
const HOUR_IN_MIN = 60;

const ROOM_TIME_MIN = 30;
export const ROOM_EXPIRE_MIN = 25;
const ROOM_ENTER_EXPIRE_MIN = ROOM_TIME_MIN - ROOM_EXPIRE_MIN;

export const ROOM_EXPIRE_SEC = ROOM_EXPIRE_MIN * MIN_IN_SEC;
const ROOM_ENTER_EXPIRE_SEC = ROOM_ENTER_EXPIRE_MIN * MIN_IN_SEC;

const Timer = () => {
  const navigate = useNavigate();
  const { data: nearestReservationData, refetch } = useQuery(
    ['userNearestReservation'],
    getUserNearestReservation,
    {
      enabled: false,
    }
  );

  const [remainingTime, setRemainingTime] = useState(dayjs.duration(-9999999));
  const [roomId, setRoomId] = useState(0);
  const [groupId, setGroupId] = useState(0);

  const [onTimerIdle, setOnTimerIdle] = useState(true);
  const [onRoomIdle, setOnRoomIdle] = useState(true);

  useEffect(() => {
    if (!nearestReservationData) {
      // initialize reservation data
      setRemainingTime(dayjs.duration(-9999999));
      setRoomId(0);
      setGroupId(0);

      setOnTimerIdle(true);
      setOnRoomIdle(true);
      return () => {};
    }

    const {
      startTime: reservedTime,
      roomId: nearestRoomId,
      groupId: nearestGroupId,
    } = nearestReservationData;
    setRoomId(nearestRoomId);
    setGroupId(nearestGroupId);

    const intervalId = setInterval(() => {
      const newRemainingTime = dayjs.duration(
        dayjs(reservedTime, 'YYYY-MM-DDTHH:mm:ss').diff(dayjs())
      );
      setRemainingTime(newRemainingTime);

      const newRemainingTimeInSec = newRemainingTime.asSeconds();
      setOnTimerIdle(
        newRemainingTimeInSec <= 0 ||
          newRemainingTimeInSec > 100 * HOUR_IN_MIN * MIN_IN_SEC
      );
      setOnRoomIdle(
        newRemainingTimeInSec <= -ROOM_EXPIRE_SEC ||
          newRemainingTimeInSec >= ROOM_ENTER_EXPIRE_SEC
      );

      if (newRemainingTimeInSec <= -ROOM_EXPIRE_SEC) {
        clearInterval(intervalId);
        refetch();
      }
    }, SEC_IN_MILLISEC);

    return () => {
      clearInterval(intervalId);
    };
  }, [nearestReservationData, refetch]);

  const handleEnterRoom = () => {
    if (!nearestReservationData) {
      return;
    }
    navigate(`study/${roomId}`);
    enterVideoRoom(roomId);
  };

  return (
    <div className="flex flex-col items-center bg-black justify-self-end w-timer h-groupList justify-evenly rounded-2xl min-h-header-min max-h-header-max min-w-timer max-w-timer">
      <EntryButton onIdle={onRoomIdle} handleEnterRoom={handleEnterRoom} />
      <RoomEnterMessage
        onTimerIdle={onTimerIdle}
        onRoomIdle={onRoomIdle}
        groupId={groupId}
      />
      <TimerDisplay onIdle={onTimerIdle} remainingTime={remainingTime} />
    </div>
  );
};

export default Timer;
