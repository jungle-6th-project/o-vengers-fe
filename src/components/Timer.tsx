import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration'; // don't forget to import the plugin
import { useState, useEffect } from 'react';

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
    const durationTime = dayjs.duration(timeInSeconds, 'seconds');
    const formattedTime = durationTime.format('mm:ss');
    return formattedTime;
  };

  return <p className="font-mono text-4xl">{formatTime(remainingTime)}</p>;
};

interface EntryButtonProps {
  onIdle: boolean;
  handleEnterRoom: () => void;
}

const EntryButton = ({ onIdle, handleEnterRoom }: EntryButtonProps) => (
  <button
    type="button"
    className={`btn btn-outline ${onIdle ? '' : 'btn-success'}`}
    disabled={onIdle}
    onClick={handleEnterRoom}
  >
    예약한 방 입장하기
  </button>
);

interface RoomEnterMessageProps {
  onIdle: boolean;
}

const RoomEnterMessage = ({ onIdle }: RoomEnterMessageProps) => {
  if (onIdle) {
    return <div>예약한 방이 없어요!</div>;
  }
  return <div>방 입장까지 남은 시간</div>;
};

interface TimerProps {
  reservedTime: string; // YYYY-MM-DDTHH:mm:ssZ
}

const Timer = ({ reservedTime }: TimerProps) => {
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
    // TODO: 방 입장
  };

  return (
    <div className="bg-black">
      <EntryButton onIdle={onIdle} handleEnterRoom={handleEnterRoom} />
      <RoomEnterMessage onIdle={onIdle} />
      <TimerDisplay remainingTime={remainingTime} />
    </div>
  );
};

export default Timer;
export { TimerDisplay };
