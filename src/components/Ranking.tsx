import React from 'react';

interface RankingProfileProps {
  rank: number | string;
  username: string;
  score: string;
  profileImg: string;
}

const RankingProfile: React.FC<RankingProfileProps> = ({
  rank,
  username,
  score,
  profileImg,
}) => {
  let rankData = rank;
  if (typeof rank === 'number') {
    rankData = `${rank}위`;
  }
  return (
    <div className="stats">
      <div className="stat">
        <div className="stat-title text-secondary">{rankData}</div>
        <div className="stat-figure">
          <div className="avatar">
            <div className="w-16 rounded-full">
              <img src={profileImg} alt={username} />
            </div>
          </div>
        </div>
        <div>
          <div className="stat-title text-sm">{username}</div>
          <div className="stat-desc text-xs">{score}</div>
        </div>
      </div>
    </div>
  );
};

export default RankingProfile;
