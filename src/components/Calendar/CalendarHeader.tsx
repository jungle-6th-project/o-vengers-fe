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
      <div className="flex justify-center items-center flex-col w-[13rem] h-[8.8125rem] ">
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
    <div className="carousel bg-[#F6F6F6] rounded-r-lg">
      {weeks.map(day => (
        <div key={day.date} className="carousel-item">
          <DayOfWeekComponent
            key={day.date}
            date={day.date}
            dayOfWeek={day.dayOfWeek}
            today={today}
          />
        </div>
      ))}
    </div>
  );
};

export default CalendarHeader;
