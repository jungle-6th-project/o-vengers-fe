export interface BasicRankingProfileProps {
  studyTime: number[];
  nickname: string;
  profileImg: string;
}

interface RankingProfileProps extends BasicRankingProfileProps {
  title: string;
  bgColor: string;
  textColor: string;
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
      className={`stat ${bgColor}`}
      style={{ gridTemplateColumns: '40px 64px 1fr' }}
    >
      {/* 순위 */}
      <div className={`stat-title ${textColor}`}>{title}</div>
      {/* 프로필사진 */}
      <div className="stat-figure">
        <div className="avatar">
          <div className="w-14 mask mask-squircle">
            <img src={profileImg} alt={nickname} />
          </div>
        </div>
      </div>
      {/* 닉네임, 공부시간 */}
      <div style={{ gridColumnStart: 3 }}>
        <div
          className={`stat-title text-sm w-16 ${textColor}`}
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

export default RankingProfile;
