import RectangleButton from './RectangleButton';

interface DayProps {
  text: string;
  day: string;
  timeSlots: string[];
}

const Day = ({ text, day, timeSlots }: DayProps) => {
  return (
    <div className="text-black w-[208px]">
      {timeSlots.map(timeSlot => (
        <div key={timeSlot} className="text-center">
          <RectangleButton text={text} day={day} time={timeSlot} />
        </div>
      ))}
    </div>
  );
};

export default Day;
