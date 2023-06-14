type TimeSlotsProps = {
  timeSlots: string[];
};

const TimeSlots = ({ timeSlots }: TimeSlotsProps) => {
  return (
    <div className="flex flex-col items-center justify-start">
      {timeSlots.map(timeSlot => (
        <div key={timeSlot} className="h-[4.75rem]">
          {timeSlot}
        </div>
      ))}
    </div>
  );
};

export default TimeSlots;
