import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useState } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {
  ResponsiveBar,
  BarDatum,
  ComputedDatum,
  BarTooltipProps,
} from '@nivo/bar';

dayjs.extend(isBetween);

interface DataItem {
  value: number;
  day: string;
}

interface WeeklyHistoryProps {
  data: DataItem[];
}

const CustomTooltip = (props: BarTooltipProps<BarDatum>) => {
  const { value } = props;
  const hour = Math.floor(Number(value) / 60);
  const min = Number(value) - hour * 60;
  return (
    <div className="bg-white card rounded-[4px] p-1 text-[12px] text-bbodog_blue font-medium bg-opacity-100">
      <p>
        {hour}H{min}M
      </p>
    </div>
  );
};

const WeeklyHistory = ({ data }: WeeklyHistoryProps) => {
  const [weekEnd, setWeekEnd] = useState(dayjs().startOf('day'));
  const [weekStart, setWeekStart] = useState(
    dayjs().subtract(6, 'day').startOf('day')
  );

  const handlePreviousWeek = () => {
    setWeekStart(weekStart.subtract(1, 'week'));
    setWeekEnd(weekEnd.subtract(1, 'week'));
  };

  const handleNextWeek = () => {
    if (!weekEnd.isSame(dayjs().startOf('day'))) {
      setWeekStart(weekStart.add(1, 'week'));
      setWeekEnd(weekEnd.add(1, 'week'));
    }
  };

  const weekData = [];
  for (
    let date = weekStart;
    date.isSameOrBefore(weekEnd);
    date = date.add(1, 'day')
  ) {
    const foundData = data.find(item => dayjs(item.day).isSame(date));
    if (!foundData) {
      const zeroData = {
        value: 0,
        day: date.format('YYYY-MM-DD'),
      };
      weekData.push(zeroData);
    } else {
      weekData.push(foundData);
    }
  }

  const barChartData: BarDatum[] = weekData.map(item => ({
    value: item.value,
    day: dayjs(item.day).format('MM.DD'),
  }));

  const total = weekData.reduce((sum, item) => sum + item.value / 60, 0);
  const today = dayjs().format('MM.DD');
  const barColor = (bar: ComputedDatum<BarDatum>) =>
    bar.data.day === today ? '#0725E3' : '#000000';

  return (
    <div className="s bg-gray-200 card top-[60.93px] w-[567.33px] h-[288.06px] font-medium">
      <div className="flex space-x-3">
        <div className="text-[35px] pl-[21px] pt-[17px] text-black mt-0">
          {total.toFixed(1)}H
        </div>
        <div>
          <div className="text-black pt-[25px] text-[12px]">
            WEEKLY STUDY TIME
          </div>
          <div className="text-bbodog_blue text-[12px]">
            {weekStart.format('MM.DD')} - {weekEnd.format('MM.DD')}
          </div>
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <button
          type="button"
          className="pl-[20px] text-black flex pt-[55px]"
          onClick={handlePreviousWeek}
        >
          <FiChevronLeft size="20" />
        </button>
        <div style={{ width: '100%', height: '210px', margin: '0' }}>
          <ResponsiveBar
            tooltip={CustomTooltip}
            animate={false}
            enableGridY={false}
            enableGridX={false}
            // isInteractive={false}
            data={barChartData}
            keys={['value']}
            indexBy="day"
            margin={{ top: 20, right: 0, bottom: 40, left: 15 }}
            padding={0.02}
            colors={barColor}
            colorBy="id"
            theme={{
              labels: {
                text: {
                  fontSize: 0,
                  fill: '#FFFFFF',
                },
              },
              axis: {
                ticks: {
                  text: {
                    fontSize: 12,
                    fill: '#000000',
                  },
                },
              },
            }}
            labelSkipHeight={20}
            axisBottom={{
              tickSize: 0,
              tickPadding: 5,
              tickRotation: 0,
              // legendPosition: 'middle',
              // legendOffset: 10,
            }}
            axisLeft={{
              tickValues: [],
              tickSize: 0,
              tickPadding: 5,
              tickRotation: 0,
            }}
          />
        </div>
        <button
          type="button"
          className="pr-[20px] text-black flex pt-[55px]"
          onClick={handleNextWeek}
        >
          <FiChevronRight size="20" />
        </button>
      </div>
    </div>
  );
};

export default WeeklyHistory;
