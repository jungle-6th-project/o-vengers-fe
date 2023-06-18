import CalendarUnit from './CalendarUnit';

interface DayProps {
  day: string;
  timeSlots: string[];
  actions: {
    createReservation: (startTime: string, endTime: string) => void;
    joinReservation: (startTime: string, roomId: number) => void;
    cancelReservation: (startTime: string, roomId: number) => void;
  };
}

const Day = ({ day, timeSlots, actions }: DayProps) => {
  return (
    <div className="text-black w-[208px]">
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
