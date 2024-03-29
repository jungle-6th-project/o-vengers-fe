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
import { getStudyHistory } from '@/utils/api';
import NotificationAlarm from '@/components/NotificationAlarm';

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

  return (
    <div className="grid w-screen h-screen gap-5 p-10 pt-5 grid-rows-mypage grid-cols-mypage w-max-screen h-max-screen">
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
      <div className="row-start-3 overflow-y-auto min-w-profile">
        <TodoList />
      </div>
      <div className="col-start-2 row-start-2">
        <TaskProgress />
      </div>
      <div className="col-start-3 row-start-2">
        <DailyHistory isLoading={isLoading} isError={isError} data={data} />
      </div>
      <div className="col-start-4 row-start-2">
        <WeeklyHistory isLoading={isLoading} isError={isError} data={data} />
      </div>
      <div className="col-start-2 col-end-5 row-start-3 row-end-4 overflow-y-auto min-h-[220px]">
        <YearlyHistory isLoading={isLoading} isError={isError} data={data} />
      </div>
      <NotificationAlarm />
    </div>
  );
};

export default Mypage;
