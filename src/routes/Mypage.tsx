import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import Profile from '@/components/MyPage/Profile';
import YearlyHistory from '@/components/MyPage/YearlyHistory';
import TaskProgress from '@/components/MyPage/TaskProgress';
import DailyHistory from '@/components/MyPage/DailyHistory';
import WeeklyHistory from '@/components/MyPage/WeeklyHistory';
import TodoList from '@/components/Todo/TodoList';
import { getStudyHistory } from '@/utils/api';

interface DataItem {
  calculatedAt: string;
  duration: string;
}

interface Data {
  value: number;
  day: string;
}

const parseTimeDuration = (durationString: string) => {
  if (!durationString || typeof durationString !== 'string') {
    return { sum: 0 };
  }
  // const stringValue = durationString ? String(durationString) : 'PT'; // 값이 null 또는 undefined인 경우 'PT'로 정의
  // const regex = /PT(\d*H)?(\d*M)?(\d*S)?/; // 정규식을 사용하여 형식 매칭
  // const matches = stringValue.match(regex);

  // if (!matches) {
  //   throw new Error('Invalid time duration format');
  // }

  // const hours = matches[1] ? parseInt(matches[1].slice(0, -1), 10) : 0;
  // const minutes = matches[2] ? parseInt(matches[2].slice(0, -1), 10) : 0;
  const studyHistory = dayjs.duration(durationString);
  const sum = studyHistory.hours() * 60 + studyHistory.minutes();
  return { sum };
};

const Mypage = () => {
  const today = dayjs();
  const startDate = dayjs(`${today.subtract(1, 'year').year()}-12-25`).format(
    'YYYY-MM-DDT00:00:00'
  );
  const endDate = dayjs().add(1, 'day').format('YYYY-MM-DDT00:00:00');

  const { data, isLoading, isError } = useQuery(
    ['studyHistory', startDate, endDate],
    () => getStudyHistory(startDate, endDate)
  );

  if (isLoading || isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading-xl">Loading...</span>
      </div>
    );
  }

  let transformedData: Data[] = [];

  if (data.length === 0) {
    transformedData = [
      {
        value: 0,
        day: today.format('YYYY-MM-DD'),
      },
    ];
  } else {
    transformedData = data.map((item: DataItem) => {
      const { duration, calculatedAt } = item;
      const { sum } = parseTimeDuration(duration);

      return {
        value: sum,
        day: calculatedAt,
      };
    });
  }

  let targetData: Data = {
    value: 0,
    day: today.format('YYYY-MM-DD'),
  };

  const foundItem = transformedData.find(
    (item: Data) => item.day === today.format('YYYY-MM-DD')
  );

  if (foundItem) {
    targetData = foundItem;
  }

  return (
    <div className="ml-[2.5rem] mr-[2.5rem] mb-[2.5rem] mt-[1rem]">
      <div>
        <Link to="/" className="w-[6rem] h-[2rem]">
          <button type="button" className="flex items-center">
            <FiArrowLeft className="icon" size="1.6rem" />
            <span className="text-[1rem] font-medium"> MAIN </span>
          </button>
        </Link>
      </div>
      <div className="grid gap-x-3 grid-rows-mypage grid-cols-container w-max-screen">
        <div className="row-span-2 col-todo">
          <Profile />
          <TodoList />
        </div>
        <div className="flex justify-between mb-3">
          <TaskProgress />
          <DailyHistory data={targetData} />
          <WeeklyHistory data={transformedData} />
        </div>
        <div className="self-start col-start-2 col-end-3 row-start-2 row-end-3 rounded-xl">
          <YearlyHistory data={transformedData} />
        </div>
      </div>
    </div>
  );
};

export default Mypage;
