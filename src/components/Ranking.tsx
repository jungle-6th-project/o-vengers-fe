import { useQuery } from '@tanstack/react-query';
import {
  UserRankingProfile,
  GroupRankingProfile,
  GroupRankingProfileProps,
} from './RankingProfile';
import { getGroupMembers } from '../utils/api';
import { useUser } from '../store/userStore';

const parseStudyTime = (studyTimeString: string): number[] => {
  if (!studyTimeString || typeof studyTimeString !== 'string') {
    throw new Error('studyTimeString is not provided or is not a string');
  }

  const regex = /PT(\d*H)?(\d*M)?(\d*S)?/; // 정규식을 사용하여 형식 매칭
  const matches = studyTimeString.match(regex);

  if (!matches) {
    throw new Error('Invalid time duration format');
  }

  const hours = matches[1] ? parseInt(matches[1].slice(0, -1), 10) : 0; // 시간 값 파싱
  const minutes = matches[2] ? parseInt(matches[2].slice(0, -1), 10) : 0; // 분 값 파싱

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

type DatumType = {
  duration: string;
  memberId: number;
  nickname: string;
  profile: string;
};

const GroupRankings = ({ groupId }: { groupId: number }) => {
  const user = useUser();

  const { isLoading, isError, data } = useQuery(
    ['groupRankings'],
    () => getGroupMembers(groupId),
    {
      refetchInterval: 60000,
      staleTime: 60000,
    }
  );

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
      (datum: DatumType) => datum.profile === user.profile
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
            studyTime={parseStudyTime(userData[0].duration)}
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
              profileImg={datum.profileImg}
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
