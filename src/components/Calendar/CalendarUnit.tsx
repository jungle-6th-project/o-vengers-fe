import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { BsX } from 'react-icons/bs';
import { roomExpireMin } from '@/components/Timer';
import { MemberProfiles } from '@/components/Groups/Groups';
import { useGroupReservation } from '@/store/groupReservationStore';
import { useUserReservation } from '@/store/userReservationStore';
import {
  useSelectedGroupId,
  useSelectedGroupIdActions,
} from '@/store/groupStore';

const parseTime = (day: string, time: string): string[] => {
  // '2023-06-14T10:00:00'
  const startTime = `${day}T${time}:00`;

  const [endHour, startMinute] = time.split(':');
  const endMinute = Number(startMinute) + roomExpireMin;
  const endTime = `${day}T${endHour}:${endMinute}:00`;

  return [startTime, endTime];
};

const CalendarButton = ({
  className,
  onClick,
  children,
  onMouseOver,
  onMouseOut,
  onFocus,
  onBlur,
}: {
  className?: string;
  onClick: () => void;
  children: React.ReactNode;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) => (
  <button
    type="button"
    className={`absolute z-20 w-full h-full btn ${className}`}
    onClick={onClick}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    onFocus={onFocus}
    onBlur={onBlur}
  >
    {children}
  </button>
);

CalendarButton.defaultProps = {
  className: '',
  onMouseOver: () => {},
  onMouseOut: () => {},
  onFocus: () => {},
  onBlur: () => {},
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
    <CalendarButton
      className="opacity-0 bg-reservation hover:opacity-100"
      onClick={handleClick}
    >
      예약하기
    </CalendarButton>
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
  roomId,
  joinReservation,
}: {
  roomId: number;
  joinReservation: (roomId: number) => void;
}) => {
  const handleClick = () => {
    joinReservation(roomId);
  };

  return (
    <CalendarButton
      className="opacity-0 bg-reservation hover:opacity-100"
      onClick={handleClick}
    >
      예약하기
    </CalendarButton>
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
  const selectedGroupId = useSelectedGroupId();
  const { setGroupId, getGroupNameById } = useSelectedGroupIdActions();

  const handleClickX = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    cancelReservation(startTime, roomId);
  };

  const handleClickCard = () => {
    setGroupId(groupId);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      handleClickCard();
    }
  };

  return (
    <div
      className={`absolute z-20 w-full h-full btn ${
        groupId === selectedGroupId ? 'btn-primary' : 'btn-ghost'
      }  no-animation`}
      onClick={handleClickCard}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={groupId === selectedGroupId}
    >
      <h1 className="absolute left-4 top-2.5 text-lg text-left w-2/3 truncate">
        {getGroupNameById(groupId)}
      </h1>
      {groupId === selectedGroupId && (
        <button
          type="button"
          className="absolute right-0.5 top-0.5"
          onClick={handleClickX}
        >
          <BsX size={30} />
        </button>
      )}
      <span className="absolute left-4 bottom-3">{`${startTime.slice(
        11,
        16
      )}-${endTime.slice(11, 16)}`}</span>
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

  const groupReservation = useGroupReservation(startTime);
  const userReservation = useUserReservation(startTime);

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
    <div className="border border-dashed h-[76px] flex justify-center items-center relative">
      {userReservation && (
        <div className="absolute z-30 right-2 bottom-2">
          <MemberProfiles profiles={userReservation.participants} />
        </div>
      )}
      {groupReservation && (
        <div className="absolute z-10 right-2 bottom-2">
          <MemberProfiles profiles={groupReservation.participants} />
        </div>
      )}
      {(() => {
        if (userReservation) {
          return (
            <CancelReservationButton
              startTime={startTime}
              endTime={endTime}
              roomId={userReservation.roomId}
              groupId={userReservation.groupId}
              cancelReservation={cancelReservation}
            />
          );
        }
        if (groupReservation) {
          return (
            <JoinReservationButton
              roomId={groupReservation.roomId}
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
