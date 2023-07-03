import { ResponsiveCalendar, CalendarTooltipProps } from '@nivo/calendar';
import dayjs from 'dayjs';

interface CalendarData {
  value: number;
  day: string;
}

interface DataItem {
  calculatedAt: string;
  duration: string;
}

interface YearlyHistoryProps {
  isLoading: boolean;
  isError: boolean;
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

const YearlyHistory = ({ isLoading, isError, data }: YearlyHistoryProps) => {
  if (isLoading || isError) {
    return (
      <div className="overflow-x-auto border-[#D9D9D9] border-[1px] rounded-md bg-white min-w-[1024px] max-w-full min-h-[220px] max-h-full w-full h-full card">
        <span className="h-full bg-black loading loading-dots loading-md place-self-center" />
      </div>
    );
  }

  let transformedData: CalendarData[] = [];
  if (data.length !== 0) {
    transformedData = data.map((item: DataItem) => {
      const { duration, calculatedAt } = item;
      return {
        value: Math.floor(dayjs.duration(duration).asMinutes()),
        day: calculatedAt,
      };
    });
  }

  const filteredData = transformedData.filter(item => item.value !== 0);

  const today = dayjs();
  return (
    <div className="overflow-x-auto border-[#D9D9D9] border-[1px] rounded-md bg-white min-w-[1024px] max-w-full min-h-[220px] max-h-full w-full h-full card">
      <div className="w-[95%] h-[95%] m-auto">
        <ResponsiveCalendar
          tooltip={CustomTooltip}
          data={filteredData}
          from={dayjs(`${today.year()}-01-01`).format('YYYY-MM-DD')}
          to={today.format('YYYY-MM-DD')}
          emptyColor="#eeeeee"
          colors={['#7599FA', '#4D76FA', '#2541F8', '#0725E3']}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          align="center"
          minValue={1}
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
