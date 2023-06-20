import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enterVideoRoom } from '@/utils/api';

dayjs.extend(duration);

const SEC_IN_MILLISEC = 1000;
const MIN_IN_SEC = 60;

export const roomTimeMin = 30;
export const roomExpireMin = 25;
const roomEnterExpireMin = roomTimeMin - roomExpireMin;

const roomExpireSec = roomExpireMin * MIN_IN_SEC;
const roomEnterExpireSec = roomEnterExpireMin * MIN_IN_SEC;

interface TimerDisplayProps {
  remainingTime: number;
}

const TimerDisplay = ({ remainingTime }: TimerDisplayProps) => {
  const formatTime = (timeInSeconds: number) => {
    if (timeInSeconds <= 0) {
      return '00:00';
    }
    const durationTime = dayjs.duration(timeInSeconds, 'seconds');
    const formattedTime = durationTime.format('mm:ss');
    return formattedTime;
  };

  return (
    <p className="font-mono text-[4.375rem] text-white">
      {formatTime(remainingTime)}
    </p>
  );
};

interface EntryButtonProps {
  onIdle: boolean;
  handleEnterRoom: () => void;
}

const EntryButton = ({ onIdle, handleEnterRoom }: EntryButtonProps) => (
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

interface RoomEnterMessageProps {
  onIdle: boolean;
}

const RoomEnterMessage = ({ onIdle }: RoomEnterMessageProps) => {
  if (onIdle) {
    return <div className="text-base text-white">예약한 방이 없어요!</div>;
  }
  return <div className="text-base text-white">방 입장까지 남은 시간</div>;
};

interface TimerProps {
  reservedTime: string; // YYYY-MM-DDTHH:mm:ssZ
}

const Timer = ({ reservedTime }: TimerProps) => {
  // const userReservation = useUserReservation('YYYY-MM-DDTHH:mm:ss');
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState(
    dayjs(reservedTime, 'YYYY-MM-DDTHH:mm:ss').diff(dayjs(), 'second')
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newRemainingTime = dayjs(reservedTime, 'YYYY-MM-DDTHH:mm:ss').diff(
        dayjs(),
        'second'
      );
      setRemainingTime(newRemainingTime);
      if (newRemainingTime <= -roomExpireSec) {
        clearInterval(intervalId);
      }
    }, SEC_IN_MILLISEC);
    return () => {
      clearInterval(intervalId);
    };
  }, [reservedTime]);

  const [onIdle, setOnIdle] = useState(
    remainingTime <= -roomExpireSec || remainingTime > roomEnterExpireSec
  );

  useEffect(() => {
    setOnIdle(
      remainingTime <= -roomExpireSec || remainingTime > roomEnterExpireSec
    );
  }, [remainingTime]);

  const handleEnterRoom = () => {
    // TODO: 가장 빠른 예약 roomId로 변경해야 함 하드코딩 변경해야 함
    navigate('study/55');
    enterVideoRoom(55);
  };

  return (
    <div className="bg-black w-[16rem] h-[12.625rem] flex flex-col justify-evenly items-center rounded-2xl">
      <EntryButton onIdle={onIdle} handleEnterRoom={handleEnterRoom} />
      <RoomEnterMessage onIdle={onIdle} />
      <TimerDisplay remainingTime={remainingTime} />
    </div>
  );
};

export default Timer;
export { TimerDisplay };
