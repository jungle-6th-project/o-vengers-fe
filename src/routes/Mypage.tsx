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
  const stringValue = durationString ? String(durationString) : 'PT'; // 값이 null 또는 undefined인 경우 'PT'로 정의
  const regex = /PT(\d*H)?(\d*M)?(\d*S)?/; // 정규식을 사용하여 형식 매칭
  const matches = stringValue.match(regex);

  if (!matches) {
    throw new Error('Invalid time duration format');
  }

  const hours = matches[1] ? parseInt(matches[1].slice(0, -1), 10) : 0;
  const minutes = matches[2] ? parseInt(matches[2].slice(0, -1), 10) : 0;
  const sum = hours * 60 + minutes;
  return { sum };
};

const Mypage = () => {
  const today = dayjs();
  const startDate = dayjs(`${today.subtract(1, 'year').year()}-12-25`).format(
    'YYYY-MM-DDT00:00:00'
  );
  const endDate = dayjs().add(1, 'day').format('YYYY-MM-DDT00:00:00');

  const { data, isLoading, isError } = useQuery(['studyHistory'], () =>
    getStudyHistory(startDate, endDate)
  );

  if (isLoading || isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading-xl">Loading...</span>
      </div>
    );
  }

  const transformedData = data?.map((item: DataItem) => {
    const { duration, calculatedAt } = item;
    const { sum } = parseTimeDuration(duration);

    return {
      value: sum,
      day: calculatedAt,
    };
  });

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
    <div className="grid m-10 gap-x-5 grid-rows-container grid-cols-container w-max-screen">
      <div className="row-span-3 col-todo">
        <Link to="/">
          <button type="button" className="flex items-center mb-3">
            <FiArrowLeft className="icon" size="20" />
            <span className="ml-2 text-[2.5vh] font-medium"> MAIN </span>
          </button>
        </Link>
        <Profile />
        <TodoList />
      </div>
      <div className="flex justify-between mb-5">
        <TaskProgress />
        <DailyHistory data={targetData} />
        <WeeklyHistory data={transformedData} />
      </div>
      <div className="self-start col-start-2 col-end-3 row-start-2 row-end-3 rounded-xl">
        <YearlyHistory data={transformedData} />
      </div>
    </div>
  );
};

export default Mypage;
