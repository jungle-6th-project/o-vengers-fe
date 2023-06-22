import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import dayjs from 'dayjs';

import { getGroupMembers } from '@/utils/api';
import { useUser } from '@/store/userStore';
import UserRankingProfile from './UserRankingProfile';
import GroupRankingProfile, {
  GroupRankingProfileProps,
} from './GroupRankingProfile';

const parseStudyTime = (studyTimeString: string): number[] => {
  if (!studyTimeString || typeof studyTimeString !== 'string') {
    return [0, 0];
  }

  const studyTime = dayjs.duration(studyTimeString);

  return [studyTime.hours(), studyTime.minutes()];
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

type RankDataType = {
  duration: string;
  memberId: number;
  nickname: string;
  profile: string;
};

const GroupRankings = ({ groupId }: { groupId: number }) => {
  const user = useUser();

  const { data, isLoading, isError, refetch } = useQuery(
    ['groupRankings'],
    () => getGroupMembers(groupId),
    {
      refetchInterval: 60000,
      staleTime: 60000,
    }
  );

  useEffect(() => {
    refetch();
  }, [refetch, groupId]);

  if (isLoading || isError) {
    return (
      <>
        <div className="sticky top-0 z-10">
          <UserRankingProfile studyTime={[0, 0]} />
        </div>
        <span className="stat stat-title loading loading-dots loading-sm" />
      </>
    );
  }

  let userData = [];
  let sortedData = [];
  if (data) {
    userData = data.filter(
      (datum: RankDataType) => datum.profile === user.profile
    );
    sortedData = [...data]
      .map(datum => ({
        ...datum,
        memberId: datum.memberId,
        profileImg: datum.profile,
        studyTime: parseStudyTime(datum.duration),
      }))
      .sort((a, b) => sortByStudyTime(a.studyTime, b.studyTime));
  }
  return (
    <>
      <div className="sticky top-0 z-10">
        {userData && (
          <UserRankingProfile
            studyTime={parseStudyTime(userData[0]?.duration)}
          />
        )}
      </div>
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
              profileImg={
                datum.profileImg ? datum.profileImg : '../../defaultProfile.png'
              }
            />
          );
        }
      )}
    </>
  );
};

const Ranking = ({ groupId }: { groupId: number }) => {
  // TODO: 2명 이하 인원수 css 조정
  return (
    <div className="stats stats-vertical w-72 h-96 border border-[#D9D9D9] rounded-md">
      {/* <UserRanking /> */}
      <GroupRankings groupId={groupId} />
    </div>
  );
};

export default Ranking;
