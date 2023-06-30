interface Data {
  value: number;
  day: string;
}

interface DailyHistoryProps {
  data: Data;
}

const DailyHistory = ({ data }: DailyHistoryProps) => {
  return (
    <div className="rounded-2xl min-h-[280px] h-full w-[16vw] p-[1.5vw] min-w-leftbar max-w-leftbar flex flex-col bg-bbodog_blue">
      <div className="space-y-[-0.8vw]">
        <p className="text-[2vw] text-white">{Math.floor(data.value / 60)}H</p>
        <p className="text-[2vw] text-white mt-0">{data.value % 60}M</p>
      </div>
      <div className="mt-auto">
        <p className="text-white sub-title text-[0.9vw]">TODAY</p>
        <p className="text-white sub-title text-[0.9vw]">STUDY TIME</p>
      </div>
    </div>
  );
};

export default DailyHistory;
