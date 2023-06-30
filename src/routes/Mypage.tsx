import { FiArrowLeft } from '@react-icons/all-files/fi/FiArrowLeft';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import Profile from '@/components/MyPage/Profile';
import YearlyHistory from '@/components/MyPage/YearlyHistory';
import TaskProgress from '@/components/MyPage/TaskProgress';
import DailyHistory from '@/components/MyPage/DailyHistory';
import WeeklyHistory from '@/components/MyPage/WeeklyHistory';
import TodoList from '@/components/Todo/TodoList';
import { getFakeCalendar, getStudyHistory } from '@/utils/api';
import { useUser } from '@/store/userStore';

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
  const studyHistory = dayjs.duration(durationString);
  const sum = studyHistory.hours() * 60 + studyHistory.minutes();
  return { sum };
};

const Mypage = () => {
  const user = useUser();
  const today = dayjs();
  const startDate = dayjs(`${today.subtract(1, 'year').year()}-12-25`).format(
    'YYYY-MM-DDT00:00:00'
  );
  const endDate = dayjs().add(1, 'day').format('YYYY-MM-DDT00:00:00');

  const { data, isLoading, isError } = useQuery(
    ['studyHistory', startDate, endDate],
    () => getStudyHistory(startDate, endDate)
  );

  const { data: fakeData } = useQuery(['fakeData'], () => {
    return getFakeCalendar();
  });
  if (isLoading || isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span
          className="loading loading-dots loading-lg place-self-center"
          style={{ fontSize: '4rem' }}
        />
      </div>
    );
  }

  let transformedData: Data[] = [];
  // transformedData = fakeData.map((item: DataItem) => {
  //   const { duration, calculatedAt } = item;
  //   const { sum } = parseTimeDuration(duration);
  //   return {
  //     value: sum,
  //     day: calculatedAt,
  //   };
  // });

  if (data.length === 0 && user.name !== '김현지') {
    transformedData = [
      {
        value: 0,
        day: today.format('YYYY-MM-DD'),
      },
    ];
  } else {
    transformedData =
      user.name === '김현지'
        ? fakeData.map((item: DataItem) => {
            const { duration, calculatedAt } = item;
            const { sum } = parseTimeDuration(duration);

            return {
              value: sum,
              day: calculatedAt,
            };
          })
        : data.map((item: DataItem) => {
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
    <div className="grid p-10 pt-5 w-max-full h-max-full">
      <div className="grid w-full h-full gap-3 grid-rows-mypage grid-cols-mypage">
        <div className="flex row-span-1 leading-none">
          <Link to="/" className="inline-block">
            <button type="button" className="flex items-center">
              <FiArrowLeft className="icon" size="1.5rem" />
              <span className="text-[1.5rem] font-medium">MAIN</span>
            </button>
          </Link>
        </div>
        <div className="row-start-2 row-end-3">
          <Profile />
        </div>
        <div className="row-start-3">
          <TodoList />
        </div>
        <div className="col-start-2 row-start-2">
          <TaskProgress />
        </div>
        <div className="col-start-3 row-start-2">
          <DailyHistory data={targetData} />
        </div>
        <div className="col-start-4 row-start-2">
          <WeeklyHistory data={transformedData} />
        </div>
        <div className="col-start-2 col-end-5 row-start-3 row-end-4">
          <YearlyHistory data={transformedData} />
        </div>
      </div>
    </div>
  );
};

export default Mypage;
