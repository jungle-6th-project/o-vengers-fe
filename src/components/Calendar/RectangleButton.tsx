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
    cancelReservation: (roomId: number) => void;
  };
}

const RectangleButton = ({ day, time, actions }: RectangleProps) => {
  const [startTime, endTime] = parseTime(day, time);

  const key = `${day}T${time}:00`;
  const reservation = useReservation(key);

  const doReserveButton = () => {
    const handleClick = () => {
      actions.createReservation(startTime, endTime);
    };
const RectangleButton = ({ text, day, time }: RectangleProps) => {
    if (reservation) {
      return (
        <div className="-space-x-6 avatar-group">
          {reservation.participants.map(profile => (
            <div key={profile} className="avatar">
              <div className="w-12">
                <img src={profile} alt="participant" />
              </div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <button
        type="button"
        className=" bg-reservation w-[11.875rem] h-[4.75rem] rounded-[0.9375rem] opacity-0 hover:opacity-100"
        onClick={handleClick}
      >
        <span className="text-black">예약하기{reservation?.roomId}</span>
      </button>
    );
  };

  return (
    <div className="border border-dashed h-[76px]">{doReserveButton()}</div>
  );
};

export default RectangleButton;
