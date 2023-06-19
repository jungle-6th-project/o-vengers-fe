import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useReservation } from '../../store/calendarStore';
import { roomExpireMin } from '../Timer';

const parseTime = (day: string, time: string): string[] => {
  // '2023-06-14T10:00:00'
  const startTime = `${day}T${time}:00`;

  const [endHour, startMinute] = time.split(':');
  const endMinute = Number(startMinute) + roomExpireMin;
  const endTime = `${day}T${endHour}:${endMinute}:00`;

  return [startTime, endTime];
};

/**
 * 아무 방도 없는 시간에 예약하는 버튼
 * @param startTime 예약 시작 시간. 형식: 'YYYY-MM-DDTHH:mm:ss'
 * @param endTime 예약 종료 시간, 반드시 startTime으로부터 roomExpireMin 분 이후. 형식: 'YYYY-MM-DDTHH:mm:ss'
 * @callback createReservation 아무 방도 없는 시간에 예약 요청하는 함수
 * @returns 예약 버튼 JSX
 */
const CreateReservationButton = ({
  startTime,
  endTime,
  createReservation,
}: {
  startTime: string;
  endTime: string;
  createReservation: (startTime: string, endTime: string) => void;
}) => {
  const handleClick = () => {
    createReservation(startTime, endTime);
  };

  return (
    <button
      type="button"
      className="absolute z-20 w-5/6 opacity-0 btn h-5/6 bg-reservation hover:opacity-100"
      onClick={handleClick}
    >
      예약하기
    </button>
  );
};

/**
 * 이미 방이 있는 시간에 예약하는 버튼
 * @param startTime 예약 시작 시간. 형식: 'YYYY-MM-DDTHH:mm:ss'
 * @param roomId 예약 취소할 방 번호
 * @callback joinReservation 이미 존재하는 방에 예약 요청하는 함수
 * @returns 예약 버튼 JSX
 */
const JoinReservationButton = ({
  startTime,
  roomId,
  joinReservation,
}: {
  startTime: string;
  roomId: number;
  joinReservation: (startTime: string, roomId: number) => void;
}) => {
  const handleClick = () => {
    joinReservation(startTime, roomId);
  };

  return (
    <button
      type="button"
      className="absolute z-20 w-5/6 opacity-0 btn h-5/6 bg-reservation hover:opacity-100"
      onClick={handleClick}
    >
      예약하기
    </button>
  );
};

/**
 * 자신의 예약을 취소하는 버튼
 * @param startTime 예약 시작 시간. 형식: 'YYYY-MM-DDTHH:mm:ss'
 * @param endTime 예약 종료 시간, 반드시 startTime으로부터 roomExpireMin 분 이후. 형식: 'YYYY-MM-DDTHH:mm:ss'
 * @param roomId 예약 취소할 방 번호
 * @callback cancelReservation 방 예약 취소 요청을 보내는 함수
 * @returns 예약 취소 버튼 JSX
 */
const CancelReservationButton = ({
  startTime,
  endTime,
  roomId,
  groupId,
  cancelReservation,
}: {
  startTime: string;
  endTime: string;
  roomId: number;
  groupId: number;
  cancelReservation: (startTime: string, roomId: number) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    cancelReservation(startTime, roomId);
  };

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };

  if (isHovered) {
    return (
      <button
        type="button"
        className="absolute z-20 w-5/6 h-5/6 btn"
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onFocus={handleMouseOver}
        onBlur={handleMouseOut}
      >
        예약 취소
      </button>
    );
  }
  return (
    <button
      type="button"
      className="absolute z-20 w-5/6 h-5/6 btn btn-primary"
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onFocus={handleMouseOver}
      onMouseOut={handleMouseOut}
      onBlur={handleMouseOut}
    >
      {`${groupId}:${roomId} ${startTime.slice(11, 16)}-${endTime.slice(
        11,
        16
      )}`}
    </button>
  );
};

// FIXME: 현재는 임시. 나중에 합치고 나서 GroupList 컴포넌트 재사용하기
/**
 * 예약한 사람들의 프로필을 보여줌
 * @param participants 예약 취소할 방 번호
 * @returns 겹쳐진 프로필 사진 및 인원수 JSX
 */
const ReservationProfile = ({ participants }: { participants: string[] }) => {
  return (
    <div className="absolute -space-x-6 avatar-group">
      {participants.map((profile: string) => (
        <div key={profile} className="avatar">
          <div className="w-12">
            <img src={profile} alt="participant" />
          </div>
        </div>
      ))}
    </div>
  );
};

export interface BasicCalendarProps {
  day: string;
  actions: {
    createReservation: (startTime: string, endTime: string) => void;
    joinReservation: (roomId: number) => void;
    cancelReservation: (startTime: string, roomId: number) => void;
  };
}

interface CalendarUnitProps extends BasicCalendarProps {
  time: string;
}

const CalendarUnit = ({ day, time, actions }: CalendarUnitProps) => {
  const { createReservation, joinReservation, cancelReservation } = actions;

  const [startTime, endTime] = parseTime(day, time);

  const key = startTime;
  const reservation = useReservation(key);

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const startTimeDayJS = dayjs(startTime, 'YYYY-MM-DDTHH-mm-ss');
      if (startTimeDayJS.isSameOrBefore(dayjs().subtract(30, 'minute'))) {
        setIsExpired(true);
      }
    };

    checkTime();

    const interval = setInterval(checkTime, 30000);
    return () => clearInterval(interval);
  }, [startTime]);

  if (isExpired) {
    return <div className="h-[76px] bg-gray-300 border border-dashed" />;
  }

  return (
    <div className="border border-dashed h-[76px] relative">
      {reservation && (
        <ReservationProfile participants={reservation.participants} />
      )}
      {(() => {
        if (reservation?.userReserved) {
          return (
            <CancelReservationButton
              startTime={startTime}
              endTime={endTime}
              roomId={reservation.roomId}
              groupId={reservation.groupId}
              cancelReservation={cancelReservation}
            />
          );
        }
        if (reservation) {
          return (
            <JoinReservationButton
              startTime={startTime}
              roomId={reservation.roomId}
              joinReservation={joinReservation}
            />
          );
        }
        return (
          <CreateReservationButton
            startTime={startTime}
            endTime={endTime}
            createReservation={createReservation}
          />
        );
      })()}
    </div>
  );
};

export default CalendarUnit;
