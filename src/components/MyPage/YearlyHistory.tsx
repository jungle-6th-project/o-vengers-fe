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
  //   return '#eeeeee';0725E3
  // });
  const today = dayjs();
  return (
    <div className="overflow-x-auto border-[#D9D9D9] border-[1px] rounded-2xl bg-white min-w-[1024px] max-w-[2024px] w-full h-full min-h-[290px] card">
      <div style={{ width: '170%', height: '100%' }}>
        <ResponsiveCalendar
          tooltip={CustomTooltip}
          data={data}
          from={dayjs(`${today.year()}-01-01`).format('YYYY-MM-DD')}
          to={today.format('YYYY-MM-DD')}
          emptyColor="#eeeeee"
          colors={['#7599FA', '#4D76FA', '#2541F8', '#0725E3']}
          // colors={Colors}
          margin={{ top: 0, right: 0, bottom: 0, left: 40 }}
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
