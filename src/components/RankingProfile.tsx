import React from 'react';

interface RankingProfileProps {
  username: string;
  studyTime: string;
  profileImg: string;
  bgColor: string;
  textColor: string;
}

interface OtherRankingProfileProps extends RankingProfileProps {
  rank: number;
}

const RankingProfile: React.FC<RankingProfileProps & { title: string }> = ({
  title,
  username,
  studyTime,
  profileImg,
  bgColor,
  textColor,
}) => {
  return (
    <div className={`stat ${bgColor}`}>
      <div className={`stat-title ${textColor}`}>{title}</div>
      <div>
        <div
          className="stat-title text-sm w-28"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
          }}
        >
          {username}
        </div>
        <div className="stat-desc text-xs">{studyTime}</div>
      </div>
      <div className="stat-figure">
        <div className="avatar">
          <div className="w-16 mask mask-squircle">
            <img src={profileImg} alt={username} />
          </div>
        </div>
      </div>
    </div>
  );
};

// TODO: sticky 속성 추가
const MyRankingProfile: React.FC<
  Omit<RankingProfileProps, 'bgColor' | 'textColor'>
> = ({ username, studyTime, profileImg }) => {
  return (
    <RankingProfile
      username={username}
      studyTime={studyTime}
      profileImg={profileImg}
      title="Me"
      bgColor="bg-primary"
      textColor="text-secondary"
    />
  );
};

const OtherRankingProfile: React.FC<
  Omit<OtherRankingProfileProps, 'bgColor' | 'textColor'>
> = ({ rank, username, studyTime, profileImg }) => {
  return (
    <RankingProfile
      username={username}
      studyTime={studyTime}
      profileImg={profileImg}
      title={`${rank}위`}
      bgColor=""
      textColor="text-primary"
    />
  );
};

export { MyRankingProfile, OtherRankingProfile };
