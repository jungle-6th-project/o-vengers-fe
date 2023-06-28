import { ResponsiveCalendar, CalendarTooltipProps } from '@nivo/calendar';
import dayjs from 'dayjs';

interface DataItem {
  value: number;
  day: string;
}

interface YearlyHistoryProps {
  data: DataItem[];
}

const CustomTooltip = (props: CalendarTooltipProps) => {
  const { value, day } = props;
  const hour = Math.floor(Number(value) / 60);
  const min = Number(value) - hour * 60;
  return (
    <div className="bg-[#FAFAFA] card rounded-md text-[0.9vw] p-2 font-semibold bg-opacity-100">
      <p>{day}</p>
      <p>
        {hour}H {min}M
      </p>
    </div>
  );
};

const YearlyHistory = ({ data }: YearlyHistoryProps) => {
  // const Colors = data.map(item => {
  //   if (item.value > 0 && item.value <= 60) {
  //     return '#A2F9F9';
  //   }
  //   if (item.value > 60 && item.value <= 120) {
  //     return '#8696FE';
  //   }
  //   if (item.value > 120 && item.value <= 180) {
  //     return '#4942E4';
  //   }
  //   if (item.value > 180) {
  //     return '#11009E';
  //   }
  //   return '#eeeeee';
  // });
  const today = dayjs();
  // 풋터 제거 후 h-full로 수정하기, max-h 설정하기
  return (
    <div className="absolute overflow-x-auto border-[#D9D9D9] border-[1px] rounded-md bg-white w-full h-[22vw] min-h-[350px] card">
      <div style={{ width: '160%', height: '100%' }}>
        <ResponsiveCalendar
          tooltip={CustomTooltip}
          data={data}
          from={dayjs(`${today.year()}-01-01`).format('YYYY-MM-DD')}
          to={today.format('YYYY-MM-DD')}
          emptyColor="#eeeeee"
          colors={['#71BEFA', '#8696FE', '#4942E4', '#11009E']}
          // colors={Colors}
          margin={{ top: 0, right: 0, bottom: 0, left: 45 }}
          yearSpacing={40}
          monthBorderColor="#ffffff"
          dayBorderWidth={2}
          dayBorderColor="#ffffff"
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'row',
              translateY: 36,
              itemCount: 4,
              itemWidth: 42,
              itemHeight: 36,
              itemsSpacing: 14,
              itemDirection: 'right-to-left',
            },
          ]}
        />
      </div>
    </div>
  );
};

export default YearlyHistory;
