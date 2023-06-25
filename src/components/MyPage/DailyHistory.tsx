import dayjs from 'dayjs';

interface DataItem {
  value: number;
  day: string;
}

interface DailyHistoryProps {
  data: DataItem;
}

const DailyHistory = ({ data }: DailyHistoryProps) => {
  const today = dayjs().format('YYYY-MM-DD');
  const { value, day } = data;
  let hours = 0;
  let minutes = 0;

  if (today === day) {
    hours = Math.floor(value / 60);
    minutes = value % 60;
  }
  return (
    <div className="pl-[21px] rounded-[13.48px] bg-bbodog_blue card w-[208.94px] h-[288.06px] top-[60.93px] font-medium">
      <p className="text-[30px] pt-[25px] text-white">{hours}H</p>
      <p className="text-[30px] text-white">{minutes}M</p>
      <p className="text-white sub-title text-[12px] pt-[120px]">TODAY</p>
      <p className="text-white sub-title text-[12px]">STUDY TIME</p>
    </div>
  );
};

export default DailyHistory;
