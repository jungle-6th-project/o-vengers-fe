import CalendarHeader from './CalendarHeader';
import TimeSlots from './TimeSlots';
import Day from './Day';
import { useTimeSlots, useWeeks } from '../../store/calendarStore';

const WeeklyViewCalendar: React.FC = () => {
  const timeSlots = useTimeSlots();
  const weeks = useWeeks();

  return (
    <div className="grid grid-rows-calendar grid-cols-calendar  bg-[#F6F6F6] w-[1556px] h-[41.5625rem] rounded-[1.25rem] overflow-auto">
      <span className="col-start-1 bg-[#F6F6F6] sticky top-0 z-10" />
      <div className="sticky top-0 col-span-6 col-start-2 ">
        <CalendarHeader weeks={weeks} />
      </div>
      <div className="sticky left-0 items-start col-span-1 col-start-1">
        <TimeSlots timeSlots={timeSlots} />
      </div>
      {weeks.map((week, index) => (
        <div key={week.date} className={`col-start-${index + 2} col-span-1`}>
          <Day day={week.date} timeSlots={timeSlots} text="예약하기" />
        </div>
      ))}
    </div>
  );
};

export default WeeklyViewCalendar;
