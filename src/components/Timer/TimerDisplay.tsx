import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const TimerDisplay = ({
  onIdle,
  remainingTime,
}: {
  onIdle: boolean;
  remainingTime: duration.Duration;
}) => {
  const formatTime = (durationTime: duration.Duration) => {
    if (onIdle) {
      return '00:00:00';
    }

    const hours = Math.floor(durationTime.asHours());
    const paddedHours = String(hours).padStart(2, '0');

    const formattedTime = `${paddedHours}:${durationTime.format('mm:ss')}`;
    return formattedTime;
  };

  return <p className="font-mono text-5xl">{formatTime(remainingTime)}</p>;
};

export default TimerDisplay;
