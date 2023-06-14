import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import {
  UserRankingProfile,
  GroupRankingProfile,
  GroupRankingProfileProps,
} from './RankingProfile';

const fetchUserRanking = async (accessToken: string) => {
  const res = await axios.get(`https://www.sangyeop.shop/api/v1/members`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.data || !res.data.data || !res.data.data.duration) {
    throw new Error('User data is not available');
  }

  return res.data.data;
};

const fetchGroupRankings = async (accessToken: string, groupId: number) => {
  const res = await axios.get(
    `https://www.sangyeop.shop/api/v1/ranks/${groupId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.data || !res.data.data || !res.data.data[0]) {
    throw new Error('Ranking data is not available');
  }

  return res.data.data;
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
  const [{ accessToken }, ,] = useCookies(['accessToken']);

  const { isLoading, isError, data } = useQuery(
    ['userRanking'],
    () => fetchUserRanking(accessToken),
    {
      refetchInterval: 60000,
      staleTime: Infinity,
    }
  );

  if (isLoading || isError) {
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
    () => fetchGroupRankings(accessToken, groupId),
    {
      refetchInterval: 60000,
      staleTime: 5000,
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
  const groupId = 0;

  return (
    <div className="stats stats-vertical shadow w-60 h-96">
      <UserRanking />
      <GroupRankings groupId={groupId} />
    </div>
  );
};

export default Ranking;