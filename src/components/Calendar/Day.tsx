import { useTimeSlots } from '@/store/calendarStore';
import CalendarUnit, { BasicCalendarProps } from './CalendarUnit';

const Day = ({ day, actions }: BasicCalendarProps) => {
  const timeSlots = useTimeSlots();

  return (
    <div className="text-black w-[11rem]">
      {timeSlots.map(timeSlot => (
        <CalendarUnit
          key={`${day}T${timeSlot}`}
          day={day}
          time={timeSlot}
          actions={actions}
        />
      ))}
    </div>
  );
};

export default Day;
