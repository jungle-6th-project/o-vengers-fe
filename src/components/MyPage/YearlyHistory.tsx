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
    <div className="bg-white card rounded-[4px] text-[12px] p-2 font-semibold bg-opacity-100">
      <p>{day}</p>
      <p>
        {hour}hours {min}minutes
      </p>
    </div>
  );
};

const YearlyHistory = ({ data }: YearlyHistoryProps) => {
  const Colors = data.map(item => {
    if (item.value > 0 && item.value < 60) {
      return 'rgba(7, 37, 227, 0.25)';
    }
    if (item.value >= 60 && item.value < 240) {
      return 'rgba(7, 37, 227, 0.5)';
    }
    if (item.value >= 240 && item.value < 420) {
      return 'rgba(7, 7, 227, 0.75)';
    }
    if (item.value >= 420) {
      return '#0725E3';
    }
    return '#eeeeee';
  });
  const today = dayjs();
  return (
    <div className="absolute overflow-x-auto border-gray-300 border-[1px] rounded-[13.48px] bg-white left-[240.71px] top-[364.55px] w-[1014.29px] h-[294.88px] card">
      <div style={{ width: '130%', height: '90%' }}>
        <ResponsiveCalendar
          tooltip={CustomTooltip}
          data={data}
          from={dayjs(`${today.year()}-01-01`).format('YYYY-MM-DD')}
          to={today.format('YYYY-MM-DD')}
          emptyColor="#eeeeee"
          colors={Colors}
          margin={{ top: 50, right: 0, bottom: 20, left: 40 }}
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
