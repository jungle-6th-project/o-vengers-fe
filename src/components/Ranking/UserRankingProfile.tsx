import { useUser } from '@/store/userStore';
import RankingProfile from './RankingProfile';

interface UserRankingProfileProps {
  studyTime: string;
}

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

export default UserRankingProfile;
