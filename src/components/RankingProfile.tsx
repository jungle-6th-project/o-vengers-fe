import React from 'react';

export interface RankingProfileProps {
  username: string;
  studyTime: number[];
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
      {/* 순위 */}
      <div className={`stat-title ${textColor}`}>{title}</div>
      {/* 프로필사진 */}
      <div className="stat-figure">
        <div className="avatar">
          <div className="w-16 mask mask-squircle">
            <img src={profileImg} alt={username} />
          </div>
        </div>
      </div>
      {/* 닉네임, 공부시간 */}
      <div style={{ gridColumnStart: 3 }}>
        <div
          className="stat-title text-sm w-16"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
          }}
        >
          {username}
        </div>
        <div className="stat-desc text-xs">{`${studyTime[0]}H ${studyTime[1]}m`}</div>
      </div>
    </div>
  );
};

// TODO: CSS 조정(MyRankingProfile, OtherRankingProfile 둘 다)
const MyRankingProfile: React.FC<
  Omit<RankingProfileProps, 'bgColor' | 'textColor'>
> = ({ username, studyTime, profileImg }) => {
  return (
    <RankingProfile
      username={username}
      studyTime={studyTime}
      profileImg={profileImg}
      title="MY"
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
