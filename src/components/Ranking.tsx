import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  MyRankingProfile,
  OtherRankingProfile,
  RankingProfileProps,
} from './RankingProfile';

const fetchRanking = async () => {
  // TODO: 백엔드 서버 배포되면 실제 주소로 변경
  const data = await axios.get('http://localhost:4000/rankingdata');
  return data;
};

// format: "PT30H35M" => [30, 35]
const parseStudyTime = (studyTimeString: string): number[] => {
  const hours = parseInt(studyTimeString.split('T')[1].split('H')[0], 10);
  const minutes = parseInt(studyTimeString.split('H')[1].split('M')[0], 10);

  return [hours, minutes];
};

const sortByStudyTime = (
  studyTimeArray1: number[],
  studyTimeArray2: number[]
) => {
  const studyTime1 = studyTimeArray1[0] * 60 + studyTimeArray1[1];
  const studyTime2 = studyTimeArray2[0] * 60 + studyTimeArray2[1];

  if (studyTime1 > studyTime2) {
    return -1;
  }
  if (studyTime1 < studyTime2) {
    return 1;
  }
  return 0;
};

const Ranking = () => {
  // 마운트될 때마다 + 해당 윈도우를 포커스할 때마다 + 1분마다 다시 fetch
  // TODO: 서버에 너무 무리가 되는 건 아닌지 확인
  const { isLoading, isError, isFetching, data } = useQuery(
    ['rankings'],
    fetchRanking,
    {
      refetchInterval: 60000,
    }
  );

  if (isLoading || isFetching || isError) {
    return (
      <div className="stats stats-vertical shadow w-60 h-96">
        <div className="sticky top-0 z-10">
          <MyRankingProfile
            username="로딩중..."
            studyTime={[0, 0]}
            profileImg="http://tastyethnics.com/wp-content/uploads/bb-plugin/cache/default-profile-square.png"
          />
        </div>
        <span className="stat stat-title loading loading-dots loading-sm" />
      </div>
    );
  }

  let sortedData;
  if (data && data.data) {
    sortedData = [...data.data]
      .map(datum => ({
        ...datum,
        studyTime: parseStudyTime(datum.studyTime),
      }))
      .sort((a, b) => sortByStudyTime(a.studyTime, b.studyTime));
  } else {
    sortedData = [];
  }

  return (
    <div className="stats stats-vertical shadow w-60 h-96">
      <div className="sticky top-0 z-10">
        {/* TODO: 본인 데이터 받아오는 걸로 변경 */}
        <MyRankingProfile
          username="본인아이디"
          studyTime={[0, 0]}
          profileImg="https://daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a.jpg"
        />
      </div>
      {sortedData.map((datum: RankingProfileProps, index: number) => {
        return (
          <OtherRankingProfile
            key={datum.username}
            rank={index + 1}
            username={datum.username}
            studyTime={datum.studyTime}
            profileImg={datum.profileImg}
          />
        );
      })}
    </div>
  );
};

export default Ranking;
