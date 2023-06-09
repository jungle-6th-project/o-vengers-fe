import React, { useState, useEffect } from 'react';
import { SEC_IN_MILLISEC, MIN_IN_SEC } from '../constants';

const TimerDisplay: React.FC<{ remainingTime: number }> = ({
  remainingTime,
}) => {
  // 숫자를 두 자리 문자열로 반환
  const formatTime = (timeToformat: number) => {
    if (timeToformat <= 0) {
      return `00`;
    }
    return timeToformat < 10 ? `0${timeToformat}` : `${timeToformat}`;
  };

  return (
    // <div>
    //   <span className="countdown font-mono text-4xl">
    //     <span
    //       style={{ '--value': formatTime(Math.floor(remainingTime / 60)) }}
    //     />
    //     :<span style={{ '--value': formatTime(remainingTime % 60) }}></span>
    //   </span>
    // </div>
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

const EntryButton: React.FC<EntryButtonProps> = ({
  onIdle,
  handleEnterRoom,
}) => (
  <button
    type="button"
    className="btn btn-primary"
    disabled={onIdle}
    onClick={handleEnterRoom}
  >
    예약한 방 입장하기
  </button>
);

interface RoomEnterMessageProps {
  onIdle: boolean;
}

const RoomEnterMessage: React.FC<RoomEnterMessageProps> = ({ onIdle }) => {
  if (onIdle) {
    return <div>예약한 방이 없어요!</div>;
  }
  return <div>방 입장까지 남은 시간</div>;
};

interface TimerProps {
  reservedTime: string; // YYYY-MM-DDTHH:mm:ssZ
}

const Timer: React.FC<TimerProps> = ({ reservedTime }) => {
  const [remainingTime, setRemainingTime] = useState(
    Math.floor((Date.parse(reservedTime) - Date.now()) / SEC_IN_MILLISEC)
  ); // in sec

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newRemainingTime = Math.floor(
        (Date.parse(reservedTime) - Date.now()) / SEC_IN_MILLISEC
      );
      setRemainingTime(newRemainingTime);
      if (newRemainingTime <= -50 * MIN_IN_SEC) {
        clearInterval(intervalId);
      }
    }, SEC_IN_MILLISEC);
    return () => {
      clearInterval(intervalId);
    };
  }, [reservedTime]);

  const [onIdle, setOnIdle] = useState(
    remainingTime <= -50 * MIN_IN_SEC || remainingTime > 10 * MIN_IN_SEC
  );

  useEffect(() => {
    setOnIdle(
      remainingTime <= -50 * MIN_IN_SEC || remainingTime > 10 * MIN_IN_SEC
    );
  }, [remainingTime]);

  const handleEnterRoom = () => {
    // TODO: 방 입장
  };

  return (
    <div>
      <RoomEnterMessage onIdle={onIdle} />
      <TimerDisplay remainingTime={remainingTime} />
      <EntryButton onIdle={onIdle} handleEnterRoom={handleEnterRoom} />
    </div>
  );
};

export default Timer;
export { TimerDisplay };
