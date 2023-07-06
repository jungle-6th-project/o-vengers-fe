import dayjs from 'dayjs';

interface DataItem {
  calculatedAt: string;
  duration: string;
}

interface DailyHistoryProps {
  isLoading: boolean;
  isError: boolean;
  data: DataItem[];
}

const findTodayData = (data: DataItem[]) => {
  const today = dayjs().format('YYYY-MM-DD');
  if (data.length === 0) {
    return { calculatedAt: today, duration: 'PT0S' };
  }
  const foundItem = data.find(item => item.calculatedAt === today);
  return foundItem || { calculatedAt: today, duration: 'PT0S' };
};

const DailyHistory = ({ isLoading, isError, data }: DailyHistoryProps) => {
  if (isLoading || isError) {
    return (
      <div className="flex flex-col p-6 rounded-md bg-bbodog_blue h-profile max-h-profile min-h-profile min-w-leftbar">
        <p className="text-5xl font-light text-white">0H</p>
        <p className="text-5xl font-light text-white">0M</p>
        <span className="h-full bg-white loading loading-dots loading-md place-self-center" />
        <div className="mt-auto">
          <p className="text-sm text-white sub-title">
            TODAY
            <br />
            STUDY TIME
          </p>
        </div>
      </div>
    );
  }

  const todayData = findTodayData(data);

  return (
    <div className="flex flex-col p-6 rounded-md bg-bbodog_blue h-profile max-h-profile min-h-profile min-w-leftbar">
      <p className="text-5xl font-light text-white">
        {dayjs.duration(todayData.duration).hours()}H
      </p>
      <p className="text-5xl font-light text-white">
        {dayjs.duration(todayData.duration).minutes()}M
      </p>
      <div className="mt-auto">
        <p className="text-sm text-white sub-title">
          TODAY
          <br />
          STUDY TIME
        </p>
      </div>
    </div>
  );
};

export default DailyHistory;
