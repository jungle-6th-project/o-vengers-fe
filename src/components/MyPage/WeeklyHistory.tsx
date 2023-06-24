import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import React, { useState } from 'react';
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
    // console.log(dayjs('2023-06-21'));
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
    // value: item.value,
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
            /**
             * chart에 사용될 데이터
             */
            data={barChartData}
            /**
             * chart에 보여질 데이터 key (측정되는 값)
             */
            keys={['value']}
            /**
             * keys들을 그룹화하는 index key (분류하는 값)
             */
            indexBy="day"
            /**
             * chart margin
             */
            margin={{ top: 20, right: 0, bottom: 40, left: 15 }}
            /**
             * chart padding (bar간 간격)
             */
            padding={0.02}
            /**
             * chart 색상
             */
            colors={barColor} // 커스터하여 사용할 때
            // colors={{ scheme: 'nivo' }} // nivo에서 제공해주는 색상 조합 사용할 때
            /**
             * color 적용 방식
             */
            colorBy="id" // 색상을 keys 요소들에 각각 적용
            // colorBy="indexValue" // indexBy로 묵인 인덱스별로 각각 적용
            theme={{
              /**
               * label style (bar에 표현되는 글씨)
               */
              labels: {
                text: {
                  fontSize: 0,
                  fill: '#FFFFFF',
                },
              },
              axis: {
                /**
                 * axis ticks style (bottom, left에 있는 값)
                 */
                ticks: {
                  text: {
                    fontSize: 12,
                    fill: '#000000',
                  },
                },
              },
            }}
            labelSkipHeight={20}
            /**
             * axis bottom 설정
             */
            // 폰트 변경하기
            axisBottom={{
              tickSize: 0, // 값 설명하기 위해 튀어나오는 점 크기
              tickPadding: 5, // tick padding
              tickRotation: 0, // tick 기울기
              // legendPosition: 'middle', // 글씨 위치
              // legendOffset: 10, // 글씨와 chart간 간격
            }}
            /**
             * axis left 설정
             */
            axisLeft={{
              tickValues: [],
              tickSize: 0, // 값 설명하기 위해 튀어나오는 점 크기
              tickPadding: 5, // tick padding
              tickRotation: 0, // tick 기울기
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
