import { Dayjs } from 'dayjs';

interface WeekProps {
  date: string;
  dayOfWeek: string;
  today: Dayjs;
}

const DayOfWeek = ({ date, dayOfWeek, today }: WeekProps) => {
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

export default DayOfWeek;
