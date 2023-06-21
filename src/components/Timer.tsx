import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import toArray from 'dayjs/plugin/toArray';

import { enterVideoRoom, getUserNearestReservation } from '@/utils/api';

dayjs.extend(duration);
dayjs.extend(toArray);

export const SEC_IN_MILLISEC = 1000;
const MIN_IN_SEC = 60;
const HOUR_IN_MIN = 60;

const ROOM_TIME_MIN = 30;
export const ROOM_EXPIRE_MIN = 25;
const ROOM_ENTER_EXPIRE_MIN = ROOM_TIME_MIN - ROOM_EXPIRE_MIN;

export const ROOM_EXPIRE_SEC = ROOM_EXPIRE_MIN * MIN_IN_SEC;
const ROOM_ENTER_EXPIRE_SEC = ROOM_ENTER_EXPIRE_MIN * MIN_IN_SEC;

const TimerDisplay = ({
  onIdle,
  remainingTime,
}: {
  onIdle: boolean;
  remainingTime: duration.Duration;
}) => {
  const formatTime = (durationTime: duration.Duration) => {
    if (onIdle) {
      return '00:00:00';
    }

    const hours = Math.floor(durationTime.asHours());
    const paddedHours = String(hours).padStart(2, '0');

    const formattedTime = `${paddedHours}:${durationTime.format('mm:ss')}`;
    return formattedTime;
  };

  return (
    <p className="font-mono text-5xl text-white">{formatTime(remainingTime)}</p>
  );
};

const EntryButton = ({
  onIdle,
  handleEnterRoom,
}: {
  onIdle: boolean;
  handleEnterRoom: () => void;
}) => (
  <button
    type="button"
    className={`btn btn-outline ${
      onIdle ? '' : 'btn-success'
    } w-[14.125rem] h-[2.8125rem] text-2xl rounded-xl`}
    disabled={onIdle}
    onClick={handleEnterRoom}
  >
    방 입장하기
  </button>
);

const RoomEnterMessage = ({
  onTimerIdle,
  onRoomIdle,
}: {
  onTimerIdle: boolean;
  onRoomIdle: boolean;
}) => {
  let text = '방 입장까지 남은 시간';

  if (onTimerIdle) {
    text = '100시간 이내에 예약한 방이 없어요!';
  }
  if (!onRoomIdle) {
    text = '지금 입장할 수 있어요';
  }
  return <div className="text-base text-white">{text}</div>;
};

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
  const [onTimerIdle, setOnTimerIdle] = useState(true);
  const [onRoomIdle, setOnRoomIdle] = useState(true);

  useEffect(() => {
    if (!nearestReservationData) {
      setRemainingTime(dayjs.duration(-9999999));
      setRoomId(0);
      setOnTimerIdle(true);
      setOnRoomIdle(true);
      return () => {};
    }
    const { startTime: reservedTime, roomId: nearestRoomId } =
      nearestReservationData;

    const intervalId = setInterval(() => {
      const newRemainingTime = dayjs.duration(
        dayjs(reservedTime, 'YYYY-MM-DDTHH:mm:ss').diff(dayjs())
      );
      setRemainingTime(newRemainingTime);
      setRoomId(nearestRoomId);

      const newRemainingTimeInSec = newRemainingTime.asSeconds();
      setOnTimerIdle(
        newRemainingTimeInSec <= 0 ||
          newRemainingTimeInSec > 100 * HOUR_IN_MIN * MIN_IN_SEC
      );

      if (newRemainingTime.asSeconds() <= -ROOM_EXPIRE_SEC) {
        clearInterval(intervalId);
        refetch();
      }
    }, SEC_IN_MILLISEC);

    return () => {
      clearInterval(intervalId);
    };
  }, [nearestReservationData, refetch]);

  useEffect(() => {
    setOnRoomIdle(
      !nearestReservationData ||
        remainingTime.asSeconds() <= -ROOM_EXPIRE_SEC ||
        remainingTime.asSeconds() >= ROOM_ENTER_EXPIRE_SEC
    );
  }, [nearestReservationData, remainingTime]);

  const handleEnterRoom = () => {
    if (!nearestReservationData) {
      return;
    }
    navigate(`study/${roomId}`);
    enterVideoRoom(roomId);
  };

  return (
    <div className="bg-black w-[16rem] h-[12.625rem] flex flex-col justify-evenly items-center rounded-2xl">
      <EntryButton onIdle={onRoomIdle} handleEnterRoom={handleEnterRoom} />
      <RoomEnterMessage onTimerIdle={onTimerIdle} onRoomIdle={onRoomIdle} />
      <TimerDisplay onIdle={onTimerIdle} remainingTime={remainingTime} />
    </div>
  );
};

export default Timer;
export { TimerDisplay };
