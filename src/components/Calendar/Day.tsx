import CalendarUnit, { BasicCalendarProps } from './CalendarUnit';

interface DayProps extends BasicCalendarProps {
  timeSlots: string[];
}

const Day = ({ day, timeSlots, actions }: DayProps) => {
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
