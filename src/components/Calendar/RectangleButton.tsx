import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useReservation } from '../../store/calendarStore';
import { roomExpireMin } from '../Timer';

// TODO: dayjs 사용, Calendar.tsx에 있는 거랑 합치기
const parseTime = (day: string, time: string): string[] => {
  // '2023-06-14T10:00:00'
  const startTime = `${day}T${time}:00`;

  const [endHour, startMinute] = time.split(':');
  const endMinute = Number(startMinute) + roomExpireMin;
  const endTime = `${day}T${endHour}:${endMinute}:00`;

  return [startTime, endTime];
};

interface RectangleProps {
  day: string;
  time: string;
  actions: {
    createReservation: (startTime: string, endTime: string) => void;
    joinReservation: (startTime: string, roomId: number) => void;
    cancelReservation: (startTime: string, roomId: number) => void;
  };
}

const RectangleButton = ({ day, time, actions }: RectangleProps) => {
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

  const createReservationButton = () => {
    const handleClick = () => {
      actions.createReservation(startTime, endTime);
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

  const joinReservationButton = () => {
    const handleClick = () => {
      actions.joinReservation(startTime, reservation.roomId);
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

  const cancelReservationButton = () => {
    const handleClick = () => {
      actions.cancelReservation(startTime, reservation.roomId);
    };

    return (
      <button
        type="button"
        className="absolute z-20 w-5/6 btn h-5/6"
        onClick={handleClick}
      >
        {startTime.slice(-8, -3)}-{endTime.slice(-8, -3)}
      </button>
    );
  };

  const reservationProfile = () => {
    return (
      <div className="absolute -space-x-6 avatar-group">
        {reservation.participants.map(profile => (
          <div key={profile} className="avatar">
            <div className="w-12">
              <img src={profile} alt="participant" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="border border-dashed h-[76px] relative">
      {reservation && reservationProfile()}
      {(() => {
        if (reservation?.userReserved) {
          return cancelReservationButton();
        }
        if (reservation) {
          return joinReservationButton();
        }
        return createReservationButton();
      })()}
    </div>
  );
};

export default RectangleButton;
