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
      refetchOnMount: 'always',
    }
  );
  console.log(data);
  useEffect(() => {
    refetch();
  }, [refetch, groupId]);

  if (isLoading || isError) {
    return (
      <>
        <div className="sticky top-0 z-10">
          <UserRankingProfile studyTime="1위" />
        </div>
        <span className="h-full loading loading-dots loading-md place-self-center" />
      </>
    );
  }

  let userIndex = 0;
  let sortedData = [];
  if (data) {
    sortedData = [...data]
      .map(datum => ({
        ...datum,
        memberId: datum.memberId,
        profileImg: datum.profile,
        studyTime: parseStudyTime(datum.duration),
      }))
      .sort((a, b) => sortByStudyTime(a.studyTime, b.studyTime));

    userIndex = sortedData.findIndex(
      (datum: RankDataType) => datum.profile === user.profile
    );
  }

  return (
    <>
      <div className="sticky top-0 z-10">
        <UserRankingProfile studyTime={`${userIndex + 1}위`} />
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
              studyTime={`${datum.studyTime[0]}H ${datum.studyTime[1]}m`}
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

export default GroupRankings;
