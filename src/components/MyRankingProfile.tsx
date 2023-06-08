import React from 'react';

export interface MyRankingProfileProps {
  username: string;
  studyTime: string;
  profileImg: string;
}

const MyRankingProfile: React.FC<MyRankingProfileProps> = ({
  username,
  studyTime,
  profileImg,
}) => {
  return (
    <div className="stats">
      <div className="stat">
        <div className="stat-title text-secondary">Me</div>
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
export default MyRankingProfile;
