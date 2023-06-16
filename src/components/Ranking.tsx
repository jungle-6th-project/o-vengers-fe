import { useQuery } from '@tanstack/react-query';
import { useCookies } from 'react-cookie';
import {
  UserRankingProfile,
  GroupRankingProfile,
  GroupRankingProfileProps,
} from './RankingProfile';
import { getGroupMembers, getUser } from '../utils/api';

// format: "PT30H35M" => [30, 35]
const parseStudyTime = (studyTimeString: string): number[] => {
  // TODO: 문자열 규칙 바뀜: 수정
  // const hours = parseInt(studyTimeString.split('T')[1].split('H')[0], 10);
  // const minutes = parseInt(studyTimeString.split('H')[1].split('M')[0], 10);

  // return [hours, minutes];
  return [0, 0];
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
  const [{ accessToken }, ,] = useCookies(['accessToken']);

  const { isLoading, isError, data } = useQuery(
    ['userRanking'],
    () => getUser(accessToken),
    {
      refetchInterval: 60000,
      staleTime: Infinity,
    }
  );

  if (isLoading || isError || !data.duration) {
    return (
      <div className="sticky top-0 z-10">
        <UserRankingProfile studyTime={[0, 0]} />
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-10">
      {data.duration && (
        <UserRankingProfile studyTime={parseStudyTime(data.duration)} />
      )}
    </div>
  );
};

const GroupRankings = ({ groupId }: { groupId: number }) => {
  const [{ accessToken }, ,] = useCookies(['accessToken']);

  const { isLoading, isError, data } = useQuery(
    ['groupRankings'],
    () => getGroupMembers(accessToken, groupId),
    {
      refetchInterval: 60000,
      staleTime: 60000,
    }
  );

  if (isLoading || isError) {
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
        (
          datum: GroupRankingProfileProps & { memberId: number },
          index: number
        ) => {
          return (
            <GroupRankingProfile
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

// TODO: 현재 그룹 아이디는 프론트에서 상태 관리
const Ranking = () => {
  const groupId = 62;
  // TODO: 2명 이하 인원수 css 조정
  return (
    <div className="shadow stats stats-vertical w-60 h-96">
      <UserRanking />
      <GroupRankings groupId={groupId} />
    </div>
  );
};

export default Ranking;
