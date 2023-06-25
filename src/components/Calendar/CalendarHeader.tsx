import dayjs from 'dayjs';
import { useWeeks } from '@/store/calendarStore';
import DayOfWeek from './DayOfWeek';

const CalendarHeader = () => {
  const today = dayjs();
  const weeks = useWeeks();

  return (
    <div className="carousel bg-calendar">
      {weeks.map(day => (
        <div key={day.date} className="carousel-item">
          <DayOfWeek
            key={day.date}
            date={day.date.split('-')[2]}
            dayOfWeek={day.dayOfWeek}
            today={today}
          />
        </div>
      ))}
    </div>
  );
};

export default CalendarHeader;
