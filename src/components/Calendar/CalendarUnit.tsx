import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { BsFillPersonFill } from '@react-icons/all-files/bs/BsFillPersonFill';
import { BsX } from '@react-icons/all-files/bs/BsX';
import { ROOM_EXPIRE_MIN } from '@/components/Timer/Timer';
import MemberProfiles from '@/components/Groups/MemberProfiles';
import { useGroupReservation } from '@/store/groupReservationStore';
import { useUserReservation } from '@/store/userReservationStore';
import {
  useSelectedGroupId,
  useSelectedGroupIdActions,
  useGroupColor,
} from '@/store/groupStore';

const parseTime = (day: string, time: string): string[] => {
  const startTime = `${day}T${time}:00`;

  const [endHour, startMinute] = time.split(':');
  const endMinute = Number(startMinute) + ROOM_EXPIRE_MIN;
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
    className={`absolute z-20 w-[97%] h-[90%] rounded-2xl btn ${className}`}
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
      className="opacity-0 bg-reservation hover:opacity-100 focus:opacity-100"
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
      className="opacity-0 bg-reservation hover:opacity-100 focus:opacity-100"
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
const CurrentReservationButton = ({
  startTime,
  roomId,
  groupId,
  people,
  cancelReservation,
  isExpired,
}: {
  startTime: string;
  roomId: number;
  groupId: number;
  people: number;
  cancelReservation: (startTime: string, roomId: number) => void;
  isExpired: boolean;
}) => {
  const selectedGroupId = useSelectedGroupId();
  const { setSelectedGroupId, getGroupNameById } = useSelectedGroupIdActions();

  const handleClickX = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    cancelReservation(startTime, roomId);
  };

  const handleClickCard = () => {
    setSelectedGroupId(groupId);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      handleClickCard();
    }
  };

  const groupColor = useGroupColor(groupId);

  return (
    <div
      className={`absolute z-20 w-[97%] h-[95%] rounded-2xl btn btn-${groupColor} ${
        groupId === selectedGroupId ? '' : 'btn-outline bg-calendar'
      } no-animation font-normal`}
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
          disabled={isExpired}
        >
          <BsX size={30} />
        </button>
      )}
      <BsFillPersonFill className="absolute left-4 bottom-3" />
      <span className="absolute left-8 bottom-3">{`${people}명`}</span>
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
    const startTimeDayJS = dayjs(startTime, 'YYYY-MM-DDTHH-mm-ss');

    if (startTimeDayJS.isAfter(dayjs().add(3, 'hour'))) {
      return () => {};
    }

    const checkTime = () => {
      if (startTimeDayJS.isSameOrBefore(dayjs().add(1, 'minutes'))) {
        setIsExpired(true);
      }
    };

    checkTime();

    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="relative flex items-center justify-center h-24 border border-dashed border-calendar-border">
      {isExpired && (
        <div className="w-full h-24 bg-[#8F8F8F] opacity-50 z-[35]" />
      )}
      {userReservation && (
        <div className="absolute z-30 right-2 bottom-2">
          <MemberProfiles profiles={userReservation.profiles} />
        </div>
      )}
      {groupReservation && (
        <>
          <BsFillPersonFill className="absolute left-3 bottom-3" />
          <span
            className="absolute font-normal left-8 bottom-3"
            style={{ lineHeight: '1em' }}
          >{`${groupReservation.participants.length}명`}</span>
          <div className="absolute right-2 bottom-2">
            <MemberProfiles profiles={groupReservation.profiles} />
          </div>
        </>
      )}
      {(() => {
        if (userReservation) {
          return (
            <CurrentReservationButton
              startTime={startTime}
              roomId={userReservation.roomId}
              groupId={userReservation.groupId}
              people={userReservation.profiles.length}
              cancelReservation={cancelReservation}
              isExpired={isExpired}
            />
          );
        }
        if (isExpired) {
          return <div />;
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
