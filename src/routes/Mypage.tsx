import { useState } from 'react';
import { onMessage } from 'firebase/messaging';
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
import { messaging } from '@/utils/fcm';

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
  const [notification, setNotification] = useState(false);
  onMessage(messaging, payload => {
    console.log(payload);
    if (payload.notification?.body === '공부 5분 전입니다!') {
      setNotification(true);
      setTimeout(() => setNotification(false), 5000);
    }
  });
  // 지워야 함
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
    <div className="mx-[2.5rem] mb-[2.5rem] mt-[1rem]">
      <div>
        <Link to="/" className="inline-block">
          <button type="button" className="flex items-center">
            <FiArrowLeft className="icon" size="1.8rem" />
            <span className="text-[1.8rem] font-medium"> MAIN </span>
          </button>
        </Link>
      </div>
      <div className="grid gap-x-3 gap-y-3 grid-rows-mypage grid-cols-container w-max-screen">
        <div>
          <Profile />
        </div>
        <div className="flex">
          <div style={{ marginRight: '0.75rem' }}>
            <TaskProgress />
          </div>
          <div style={{ marginRight: '0.75rem' }}>
            <DailyHistory data={targetData} />
          </div>
          <div style={{ flex: 'auto' }}>
            <WeeklyHistory data={transformedData} />
          </div>
        </div>
        <div>
          <TodoList />
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ width: 'calc(100% + 0.75rem)' }}>
            <YearlyHistory data={transformedData} />
          </div>
        </div>
      </div>
      {notification && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-info">
            <span>공부 시작 5분 전입니다.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mypage;
