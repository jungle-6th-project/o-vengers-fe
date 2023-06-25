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
    <div className="pl-[2vw] rounded-2xl bg-bbodog_blue h-[50vh] w-[16vw] font-medium">
      <p className="text-[2vw] pt-[4vh] text-white">
        {Math.floor(data.value / 60)}H
      </p>
      <p className="text-[2vw] text-white">{data.value % 60}M</p>
      <p className="text-white sub-title text-[0.9vw] pt-[23.5vh]">TODAY</p>
      <p className="text-white sub-title text-[0.9vw]">STUDY TIME</p>
    </div>
  );
};

export default DailyHistory;
