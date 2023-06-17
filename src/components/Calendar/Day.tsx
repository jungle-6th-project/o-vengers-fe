import RectangleButton from './RectangleButton';

interface DayProps {
  day: string;
  timeSlots: string[];
  actions: {
    createReservation: (startTime: string, endTime: string) => void;
    cancelReservation: (roomId: number) => void;
  };
}

const Day = ({ day, timeSlots, actions }: DayProps) => {
  return (
    <div className="text-black w-[208px]">
      {timeSlots.map(timeSlot => (
        <RectangleButton
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
