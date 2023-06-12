interface MyRankingProfileProps {
  studyTime: number[];
}

interface ExtendedRankingProfileProps extends MyRankingProfileProps {
  nickname: string;
  profileImg: string;
}

interface RankingProfileProps extends ExtendedRankingProfileProps {
  title: string;
  bgColor: string;
  textColor: string;
}

export interface OtherRankingProfileProps extends ExtendedRankingProfileProps {
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
    <div className={`stat ${bgColor}`}>
      {/* 순위 */}
      <div className={`stat-title ${textColor}`}>{title}</div>
      {/* 프로필사진 */}
      <div className="stat-figure">
        <div className="avatar">
          <div className="w-16 mask mask-squircle">
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

const MyRankingProfile = ({ studyTime }: MyRankingProfileProps) => {
  return (
    // FIXME: 로컬 스토리지 데이터 사용하기
    <RankingProfile
      nickname="익명123123123"
      studyTime={studyTime}
      profileImg="https://daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.jpg"
      title="MY"
      bgColor="bg-black"
      textColor="text-white"
    />
  );
};

const OtherRankingProfile = ({
  rank,
  nickname,
  studyTime,
  profileImg,
}: OtherRankingProfileProps) => {
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

export { MyRankingProfile, OtherRankingProfile };
