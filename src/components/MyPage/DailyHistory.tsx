interface Data {
  value: number;
  day: string;
}

interface DailyHistoryProps {
  data: Data;
}

const DailyHistory = ({ data }: DailyHistoryProps) => {
  return (
    <div className="flex flex-col p-6 rounded-md bg-bbodog_blue h-profile max-h-profile min-h-profile min-w-leftbar">
      <p className="text-5xl font-light text-white">
        {Math.floor(data.value / 60)}H
      </p>
      <p className="text-5xl font-light text-white">{data.value % 60}M</p>
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
