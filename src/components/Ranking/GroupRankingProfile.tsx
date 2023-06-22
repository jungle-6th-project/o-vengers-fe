import RankingProfile, { BasicRankingProfileProps } from './RankingProfile';

export interface GroupRankingProfileProps extends BasicRankingProfileProps {
  rank: number;
}

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
      title={`${rank}위`}
      bgColor="bg-white"
      textColor="text-black"
    />
  );
};

export default GroupRankingProfile;
