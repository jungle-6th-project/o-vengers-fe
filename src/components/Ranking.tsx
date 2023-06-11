import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  MyRankingProfile,
  OtherRankingProfile,
  RankingProfileProps,
} from './RankingProfile';

// FIXME: 백엔드 서버 배포되면 실제 주소로 변경
const fetchUserRanking = async () => {
  const res = await axios.get(`http://localhost:4000/userRank`);
  return res.data.body.data;
};

const fetchAllRankings = async (groupId: number) => {
  const res = await axios.get(`http://localhost:4000/allRanks${groupId}`);
  return res.data.body.data;
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

const UserRanking = () => {
  const { isLoading, isError, isFetching, data } = useQuery(
    ['userRanking'],
    () => fetchUserRanking(),
    {
      refetchInterval: 60000,
      staleTime: 60000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  // FIXME: 로컬 스토리지에 저장된 별명/프로필사진 데이터 사용하기(로그인 기능 머지 후)
  if (isLoading || isFetching || isError) {
    return (
      <div className="sticky top-0 z-10">
        <MyRankingProfile
          nickname="로딩중..."
          studyTime={[0, 0]}
          profileImg="http://tastyethnics.com/wp-content/uploads/bb-plugin/cache/default-profile-square.png"
        />
      </div>
    );
  }
  // FIXME: 로컬 스토리지에 저장된 별명/프로필사진 데이터 사용하기(로그인 기능 머지 후)
  return (
    <div className="sticky top-0 z-10">
      {data && (
        <MyRankingProfile
          nickname={data[0].nickname}
          studyTime={parseStudyTime(data[0].totalDuration)}
          profileImg={data[0].profile}
        />
      )}
    </div>
  );
};

const AllRankings = ({ groupId }: { groupId: number }) => {
  // 마운트될 때마다 + 해당 윈도우를 포커스할 때마다 + 1분마다 다시 fetch
  // TODO: 서버에 너무 무리가 되는 건 아닌지 확인
  const { isLoading, isError, isFetching, data } = useQuery(
    ['rankings'],
    () => fetchAllRankings(groupId),
    {
      refetchInterval: 60000,
    }
  );

  if (isLoading || isFetching || isError) {
    return <span className="stat stat-title loading loading-dots loading-sm" />;
  }

  let sortedData;
  if (data) {
    sortedData = [...data]
      .map(datum => ({
        ...datum,
        memberId: datum.memberId,
        profileImg: datum.profile,
        studyTime: parseStudyTime(datum.totalDuration),
      }))
      .sort((a, b) => sortByStudyTime(a.studyTime, b.studyTime));
  } else {
    sortedData = [];
  }

  return (
    <>
      {sortedData.map(
        (datum: RankingProfileProps & { memberId: number }, index: number) => {
          return (
            <OtherRankingProfile
              key={datum.memberId}
              rank={index + 1}
              nickname={datum.nickname}
              studyTime={datum.studyTime}
              profileImg={datum.profileImg}
            />
          );
        }
      )}
    </>
  );
};

// TODO: 현재 그룹 아이디는 프론트에서 알아서 상태 관리
const Ranking = () => {
  const groupId = 0;

  return (
    <div className="stats stats-vertical shadow w-60 h-96">
      <UserRanking />
      <AllRankings groupId={groupId} />
    </div>
  );
};

export default Ranking;
