import { FiArrowLeft } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import dayjs from 'dayjs';
import Profile from '@/components/MyPage/Profile';
import YearlyHistory from '@/components/MyPage/YearlyHistory';
import TaskProgress from '@/components/MyPage/TaskProgress';
import DailyHistory from '@/components/MyPage/DailyHistory';
import WeeklyHistory from '@/components/MyPage/WeeklyHistory';
import TodoList from '@/components/Todo/TodoList';

interface DataItem {
  calculatedAt: string;
  duration: string;
}

const parseTimeDuration = (durationString: string) => {
  const regex = /PT(\d*H)?(\d*M)?(\d*S)?/; // 정규식을 사용하여 형식 매칭
  const matches = durationString.match(regex);

  if (!matches) {
    throw new Error('Invalid time duration format');
  }

  const hours = matches[1] ? parseInt(matches[1].slice(0, -1), 10) : 0; // 시간 값 파싱
  const minutes = matches[2] ? parseInt(matches[2].slice(0, -1), 10) : 0; // 분 값 파싱
  const sum = hours * 60 + minutes;
  return { sum };
};

const fetchStudyHistory = async (
  accessToken: string,
  DateStart: string,
  DateEnd: string
) => {
  const res = await axios.get(
    `https://www.sangyeop.shop/api/v1/study-histories/durations`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        from: DateStart,
        to: DateEnd,
      },
    }
  );

  // if (!res.data || !res.data.data || !res.data.data.duration) {
  //   throw new Error('User data is not available');
  // }
  return res.data.data;
};

const Mypage = () => {
  const [{ accessToken }, ,] = useCookies(['accessToken']);
  const today = dayjs();
  const startDate = dayjs(`${today.subtract(1, 'year').year()}-12-25`).format(
    'YYYY-MM-DDT00:00:00'
  );
  // const endDate = dayjs().add(1, 'day').format('YYYY-MM-DDT00:00:00');

  // const { data, isLoading, isError } = useQuery(['studyHistory'], () =>
  //   fetchStudyHistory(accessToken, startDate, endDate)
  // );

  // if (isLoading || isError) {
  //   return <div>로딩중입니다</div>;
  // }
  // console.log(data);

  const data = [
    {
      calculatedAt: '2023-05-25',
      duration: 'PT3H14M8S',
    },
    {
      calculatedAt: '2023-05-26',
      duration: 'PT1H33M0S',
    },
    {
      calculatedAt: '2023-05-27',
      duration: 'PT2H10M10S',
    },
    {
      calculatedAt: '2023-05-28',
      duration: 'PT1H33M0S',
    },
    {
      calculatedAt: '2023-05-29',
      duration: 'PT2H10M10S',
    },
    {
      calculatedAt: '2023-05-30',
      duration: 'PT1H33M0S',
    },
    {
      calculatedAt: '2023-05-31',
      duration: 'PT2H10M10S',
    },
    {
      calculatedAt: '2023-06-01',
      duration: 'PT1H33M0S',
    },
    {
      calculatedAt: '2023-06-02',
      duration: 'PT2H10M10S',
    },
    {
      calculatedAt: '2023-06-03',
      duration: 'PT1H33M0S',
    },
    {
      calculatedAt: '2023-06-04',
      duration: 'PT2H10M10S',
    },
    {
      calculatedAt: '2023-06-05',
      duration: 'PT1H33M0S',
    },
    {
      calculatedAt: '2023-06-07',
      duration: 'PT1H33M0S',
    },
    {
      calculatedAt: '2023-06-08',
      duration: 'PT2H10M10S',
    },
    {
      calculatedAt: '2023-06-09',
      duration: 'PT1H33M0S',
    },
    {
      calculatedAt: '2023-06-12',
      duration: 'PT2H10M10S',
    },
    {
      calculatedAt: '2023-06-13',
      duration: 'PT1H33M0S',
    },
    {
      calculatedAt: '2023-06-14',
      duration: 'PT2H10M10S',
    },
    {
      calculatedAt: '2023-06-15',
      duration: 'PT1H33M0S',
    },
    {
      calculatedAt: '2023-06-16',
      duration: 'PT2H10M10S',
    },
    {
      calculatedAt: '2023-06-17',
      duration: 'PT1H33M0S',
    },
    {
      calculatedAt: '2023-06-18',
      duration: 'PT2H10M10S',
    },
    {
      calculatedAt: '2023-06-20',
      duration: 'PT2H10M10S',
    },
    {
      calculatedAt: '2023-06-21',
      duration: 'PT0H20M0S',
    },
    {
      calculatedAt: '2023-06-22',
      duration: 'PT3H20M0S',
    },
    {
      calculatedAt: '2023-06-23',
      duration: 'PT1H20M0S',
    },
  ];

  const transformedData = data.map((item: DataItem) => {
    const { duration, calculatedAt } = item;
    const { sum } = parseTimeDuration(duration);

    return {
      value: sum,
      day: calculatedAt,
    };
  });

  const lastItem = transformedData[transformedData.length - 1];
  // console.log(transformedData);
  return (
    <div className="grid grid-cols-8 grid-rows-2 margin-auto">
      <div className="col-start-1 col-end-2 row-span-2 ">
        <button type="button" className="flex items-center pl-[33px] pt-[40px]">
          <FiArrowLeft className="icon" size="20" />
          <span className="ml-2 text-[17px] font-bold"> MAIN </span>
        </button>
        <Profile />
        {/* <TodoList /> */}
      </div>
      <div className="col-start-2">
        <TaskProgress />
      </div>
      <div className="col-start-3 pl-[35px]">
        <DailyHistory data={lastItem} />
      </div>
      <div className="col-start-4 pl-[45px]">
        <WeeklyHistory data={transformedData} />
      </div>
      <div className="col-span-2">
        <YearlyHistory data={transformedData} />
      </div>
    </div>
  );
};

export default Mypage;
