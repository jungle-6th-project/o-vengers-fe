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
  const endDate = dayjs().add(1, 'day').format('YYYY-MM-DDT00:00:00');

  const { data, isLoading, isError } = useQuery(['studyHistory'], () =>
    fetchStudyHistory(accessToken, startDate, endDate)
  );

  if (isLoading || isError) {
    return <div>로딩중입니다</div>;
  }
  console.log(data);

  const transformedData = data.map((item: DataItem) => {
    const { duration, calculatedAt } = item;
    const { sum } = parseTimeDuration(duration);

    return {
      value: sum,
      day: calculatedAt,
    };
  });

  const lastItem = transformedData[transformedData.length - 1];
  return (
    <div className="grid grid-cols-8 grid-rows-2 margin-auto">
      <div className="col-start-1 col-end-2 row-span-2 ">
        <button type="button" className="flex items-center pl-[33px] pt-[40px]">
          <FiArrowLeft className="icon" size="20" />
          <span className="ml-2 text-[17px] font-bold"> MAIN </span>
        </button>
        <Profile />
        <div className="pt-[300px] pl-[33px]">
          <TodoList />
        </div>
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
