export interface BasicRankingProfileProps {
  studyTime: string;
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
      className={`stat ${bgColor} grid-cols-rankingProfile justify-evenly items-center px-4 py-3`}
    >
      {/* 순위 */}
      <div className={`stat-title ${textColor} text-center`}>{title}</div>
      {/* 프로필사진 */}
      <div className="avatar">
        <div className="w-11 mask mask-squircle">
          <img src={profileImg} alt={nickname} />
        </div>
      </div>
      {/* 닉네임, 공부시간 */}
      <div className="col-start-3">
        <div
          className={`whitespace-nowrap text-sm w-16 ${textColor}`}
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
          }}
        >
          {nickname}
        </div>
        <div className={`whitespace-nowrap text-xs ${textColor}`}>
          {studyTime}
        </div>
      </div>
    </div>
  );
};

export default RankingProfile;
