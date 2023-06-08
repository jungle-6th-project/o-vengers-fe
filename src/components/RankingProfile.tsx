import React from 'react';
import { MyRankingProfileProps } from './MyRankingProfile';

interface RankingProfileProps extends MyRankingProfileProps {
  rank: number;
}

const RankingProfile: React.FC<RankingProfileProps> = ({
  rank,
  username,
  studyTime,
  profileImg,
}) => {
  return (
    <div className="stats">
      <div className="stat">
        <div className="stat-title text-primary">{`${rank}위`}</div>
        <div className="stat-figure">
          <div className="avatar">
            <div className="w-16 rounded-full">
              <img src={profileImg} alt={username} />
            </div>
          </div>
        </div>
        <div>
          <div className="stat-title text-sm">{username}</div>
          <div className="stat-desc text-xs">{studyTime}</div>
        </div>
      </div>
    </div>
  );
};

export default RankingProfile;
