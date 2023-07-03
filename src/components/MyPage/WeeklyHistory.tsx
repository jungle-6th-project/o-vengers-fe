import { BsChevronCompactLeft } from '@react-icons/all-files/bs/BsChevronCompactLeft';
import { BsChevronCompactRight } from '@react-icons/all-files/bs/BsChevronCompactRight';
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
  calculatedAt: string;
  duration: string;
}

interface WeeklyHistoryProps {
  isLoading: boolean;
  isError: boolean;
  data: DataItem[];
}

const CustomTooltip = (props: BarTooltipProps<BarDatum>) => {
  const { value } = props;
  const hour = Math.floor(Number(value) / 60);
  const min = Number(value) - hour * 60;
  return (
    <div className="p-2 text-base font-medium text-black bg-white bg-opacity-100 rounded-md card">
      <p>
        {hour}H {min}M
      </p>
    </div>
  );
};

const WeeklyHistory = ({ isLoading, isError, data }: WeeklyHistoryProps) => {
  const [weekEnd, setWeekEnd] = useState(dayjs().startOf('day'));
  const [weekStart, setWeekStart] = useState(
    dayjs().subtract(6, 'day').startOf('day')
  );

  const handlePrevWeek = () => {
    setWeekStart(weekStart.subtract(1, 'week'));
    setWeekEnd(weekEnd.subtract(1, 'week'));
  };

  const handleNextWeek = () => {
    if (!weekEnd.isSame(dayjs().startOf('day'))) {
      setWeekStart(weekStart.add(1, 'week'));
      setWeekEnd(weekEnd.add(1, 'week'));
    }
  };

  if (isLoading || isError) {
    return (
      <div className="w-full bg-[#EEEEEE] card min-w-[600px] rounded-md p-6 text-4xl text-[#474747] h-profile max-h-profile min-h-profile">
        <span className="h-full bg-black loading loading-dots loading-md place-self-center" />
      </div>
    );
  }

  const weekData = [];
  if (data.length !== 0) {
    for (
      let date = weekStart;
      date.isSameOrBefore(weekEnd);
      date = date.add(1, 'day')
    ) {
      const foundData = data.find(item =>
        dayjs(item.calculatedAt).isSame(date)
      );
      if (!foundData) {
        const zeroData = {
          value: 0,
          day: date.format('MM.DD'),
        };
        weekData.push(zeroData);
      } else {
        const value = Math.floor(
          dayjs.duration(foundData.duration).asMinutes()
        );
        const processedData = {
          value,
          day: date.format('MM.DD'),
        };
        weekData.push(processedData);
      }
    }
  }

  const total = weekData.reduce((sum, item) => sum + item.value / 60, 0);
  const today = dayjs().format('MM.DD');
  const barColor = (bar: ComputedDatum<BarDatum>) =>
    bar.data.day === today ? '#0725E3' : '#000000';

  return (
    <div className="w-full bg-[#EEEEEE] card min-w-[600px] rounded-md p-6 text-4xl text-[#474747] h-profile max-h-profile min-h-profile">
      <div className="flex space-x-3">
        <div className="text-5xl font-light">
          {total > 0 ? total.toFixed(1) : 0}H
        </div>
        <div>
          <div className="text-sm leading-7">WEEKLY STUDY TIME</div>
          <div className="text-sm leading-none text-bbodog_blue">
            {weekStart.format('MM.DD')} - {weekEnd.format('MM.DD')}
          </div>
        </div>
      </div>
      <div className="flex justify-between h-full">
        <button
          type="button"
          className="h-full pb-[3rem] text-black"
          onClick={handlePrevWeek}
        >
          <BsChevronCompactLeft size="35" />
        </button>
        <div className="w-[90%] h-[90%] min-w-0 self-center">
          <ResponsiveBar
            layout="vertical"
            minValue={0}
            tooltip={CustomTooltip}
            motionConfig="stiff"
            enableGridY={false}
            enableGridX={false}
            data={weekData}
            keys={['value']}
            indexBy="day"
            margin={{ top: 10, right: 0, bottom: 20, left: 0 }}
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
                    fontSize: 14,
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
          className="text-black pb-[3rem]"
          onClick={handleNextWeek}
        >
          <BsChevronCompactRight size="35" />
        </button>
      </div>
    </div>
  );
};

export default WeeklyHistory;
