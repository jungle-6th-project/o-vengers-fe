import { useState, useEffect } from 'react';

const SEC_IN_MILLISEC = 1000;
const MIN_IN_SEC = 60;

const roomEnterExpireMin = 10;
const roomExpireMin = 25;
const roomEnterExpireSec = roomEnterExpireMin * MIN_IN_SEC;
const roomExpireSec = roomExpireMin * MIN_IN_SEC;

interface TimerDisplayProps {
  remainingTime: number;
}

// 숫자를 두 자리 문자열로 반환
const TimerDisplay = ({ remainingTime }: TimerDisplayProps) => {
  const formatTime = (timeToformat: number) => {
    if (timeToformat <= 0) {
      return `00`;
    }
    return timeToformat < 10 ? `0${timeToformat}` : `${timeToformat}`;
  };

  return (
    <p className="font-mono text-4xl">
      {formatTime(Math.floor(remainingTime / 60))}:
      {formatTime(remainingTime % 60)}
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
    Math.floor((Date.parse(reservedTime) - Date.now()) / SEC_IN_MILLISEC)
  ); // in sec

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newRemainingTime = Math.floor(
        (Date.parse(reservedTime) - Date.now()) / SEC_IN_MILLISEC
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
