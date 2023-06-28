interface Data {
  value: number;
  day: string;
}

interface DailyHistoryProps {
  data: Data;
}

const DailyHistory = ({ data }: DailyHistoryProps) => {
  // const today = dayjs().format('YYYY-MM-DD');
  // const { value, day } = data;
  // let hours = 0;
  // let minutes = 0;

  // if (today === day) {

  // hours = Math.floor(value / 60);
  // minutes = value % 60;

  return (
    <div className="rounded-md min-h-[250px] h-[20.5vw] p-[1.5vw] w-[16vw] min-w-leftbar max-w-leftbar flex flex-col bg-bbodog_blue">
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
