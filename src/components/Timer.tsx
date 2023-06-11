import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEC_IN_MILLISEC, MIN_IN_SEC } from '../constants';

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

const EntryButton = ({ onIdle, handleEnterRoom }: EntryButtonProps) => (
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

const RoomEnterMessage = ({ onIdle }: RoomEnterMessageProps) => {
  if (onIdle) {
    return <div>예약한 방이 없어요!</div>;
  }
  return <div>방 입장까지 남은 시간</div>;
};

const useCountdown = (reservedTime: string) => {
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

  return remainingTime;
};

export interface TimerProps {
  reservedTime: string; // YYYY-MM-DDTHH:mm:ssZ
}

const Timer = ({ reservedTime }: TimerProps) => {
  const remainingTime = useCountdown(reservedTime);

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

declare global {
  interface Window {
    room_exit_modal: HTMLDialogElement;
  }
}

const RoomExitModal = () => {
  return (
    <dialog id="room_exit_modal" className="modal">
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">
          50분 동안 집중하셨어요! 수고하셨습니다 :)
        </h3>
        <p className="py-4">10초 후 자동으로 나가집니다.</p>
      </form>
    </dialog>
  );
};

const RoomTimer = ({ reservedTime }: TimerProps) => {
  const remainingTime = useCountdown(reservedTime);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (remainingTime <= 0 && !showModal) {
      window.room_exit_modal.removeAttribute('open');
      window.room_exit_modal.showModal();
      setShowModal(true);
    }
  }, [remainingTime, showModal]);

  useEffect(() => {
    if (showModal) {
      const timerId = setTimeout(() => {
        navigate('/');
      }, 10000);

      return () => clearTimeout(timerId);
    }

    return () => {};
  }, [showModal, navigate]);

  return (
    <div>
      <TimerDisplay remainingTime={remainingTime} />
      <RoomExitModal />
    </div>
  );
};

export default Timer;
export { RoomTimer };
