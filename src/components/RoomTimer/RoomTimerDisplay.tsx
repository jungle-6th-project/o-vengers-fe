import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import toArray from 'dayjs/plugin/toArray';

dayjs.extend(duration);
dayjs.extend(toArray);

const RoomTimerDisplay = ({
  onIdle,
  remainingTime,
}: {
  onIdle: boolean;
  remainingTime: duration.Duration;
}) => {
  const formatTime = (durationTime: duration.Duration) => {
    if (onIdle) {
      return '00:00';
    }

    const durationTimeAfter25 = durationTime.subtract(25, 'minutes');
    if (durationTimeAfter25.asSeconds() > 0) {
      return durationTimeAfter25.format('mm:ss');
    }
    return durationTime.format('mm:ss');
  };

  return <p className="font-mono text-5xl">{formatTime(remainingTime)}</p>;
};

export default RoomTimerDisplay;
