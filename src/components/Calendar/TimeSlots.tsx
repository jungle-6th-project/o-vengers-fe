type TimeSlotsProps = {
  timeSlots: string[];
};

const TimeSlots = ({ timeSlots }: TimeSlotsProps) => {
  return (
    <div className="flex flex-col items-center justify-start">
      {timeSlots.map(timeSlot => (
        <div
          key={timeSlot}
          className="w-[100px] text-center h-24 after:absolute after:w-[20%] after:h-24 after:border-[1px] after:border-l-0 after:border-dashed after:border-calendar-border after:right-0"
        >
          {timeSlot}
        </div>
      ))}
    </div>
  );
};

export default TimeSlots;
