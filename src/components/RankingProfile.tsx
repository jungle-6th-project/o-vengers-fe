import { useUser } from '@/store/userStore';

interface UserRankingProfileProps {
  studyTime: number[];
}

interface ExtendedRankingProfileProps extends UserRankingProfileProps {
  nickname: string;
  profileImg: string;
}

interface RankingProfileProps extends ExtendedRankingProfileProps {
  title: string;
  bgColor: string;
  textColor: string;
}

export interface GroupRankingProfileProps extends ExtendedRankingProfileProps {
  rank: number;
}

const RankingProfile = ({
  title,
  nickname,
  studyTime,
  profileImg,
  bgColor,
  textColor,
}: RankingProfileProps) => {
  return (
    <div
      className={`stat ${bgColor} grid-cols-rankingProfile gap-x-4  justify-center items-center`}
    >
      {/* 순위 */}
      <div className={`stat-title ${textColor}`}>{title}</div>
      {/* 프로필사진 */}
      <div className="relative">
        <div className="avatar">
          <div className="w-11 mask mask-squircle ">
            <img src={profileImg} alt={nickname} />
          </div>
        </div>
        <div className="absolute right-[-1rem] top-0 h-full w-4 bg-transparent" />
      </div>
      {/* 닉네임, 공부시간 */}
      <div className="col-start-3 mb-2">
        <div
          className={`stat-title text-sm w-16 ${textColor} mb-1`}
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
          }}
        >
          {nickname}
        </div>
        <div
          className={`stat-desc text-xs ${textColor}`}
        >{`${studyTime[0]}H ${studyTime[1]}m`}</div>
      </div>
    </div>
  );
};

const UserRankingProfile = ({ studyTime }: UserRankingProfileProps) => {
  const user = useUser();

  return (
    <RankingProfile
      nickname={user.name}
      studyTime={studyTime}
      profileImg={user.profile}
      title="MY"
      bgColor="bg-black"
      textColor="text-white"
    />
  );
};

const GroupRankingProfile = ({
  rank,
  nickname,
  studyTime,
  profileImg,
}: GroupRankingProfileProps) => {
  return (
    <RankingProfile
      nickname={nickname}
      studyTime={studyTime}
      profileImg={profileImg}
      title={`${rank}`}
      bgColor="bg-white"
      textColor="text-black"
    />
  );
};

export { UserRankingProfile, GroupRankingProfile };
