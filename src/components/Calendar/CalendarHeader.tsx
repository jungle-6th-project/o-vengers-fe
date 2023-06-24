import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import dayjs, { Dayjs } from 'dayjs';

dayjs.extend(isSameOrBefore);

interface WeekProps {
  date: string;
  dayOfWeek: string;
}

interface Week extends WeekProps {
  today: Dayjs;
}

const DayOfWeekComponent = ({ date, dayOfWeek, today }: Week) => {
  const isToday = today.date().toString() === date;

  return (
    <div className="flex flex-col items-center text-black">
      <div className="flex justify-center items-center flex-col w-[11rem] h-[6rem] relative after:absolute after:w-full after:h-[30%] after:border-[1px] after:border-t-0 after:border-dashed after:border-calendar-border after:bottom-0">
        <div>{dayOfWeek}</div>
        <div className="flex items-center justify-center">
          {isToday ? (
            <div className="rounded-full bg-black w-[2.9375rem] h-[47px] flex items-center justify-center text-white">
              {date}
            </div>
          ) : (
            <div>{date}</div>
          )}
        </div>
      </div>
    </div>
  );
};

interface CalendarHeaderProps {
  weeks: WeekProps[];
}

const CalendarHeader = ({ weeks }: CalendarHeaderProps) => {
  const today = dayjs();

  return (
    <div className="carousel bg-calendar">
      {weeks.map(day => (
        <div key={day.date} className="carousel-item">
          <DayOfWeekComponent
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
