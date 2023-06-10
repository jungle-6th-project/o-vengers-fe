// import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  MyRankingProfile,
  OtherRankingProfile,
  RankingProfileProps,
} from './RankingProfile';

const fetchRanking = async () => {
  // TODO: 실제 fetch 주소로 변경
  const data = await axios.get('http://localhost:4000/rankingdata');
  return data;
};

const Ranking = () => {
  const { isLoading, isError, data } = useQuery(['rankings'], fetchRanking);

  if (isLoading) {
    return <span className="loading loading-dots loading-sm" />;
  }

  if (isError) {
    return <span>랭킹 정보를 가져오는 데 실패했습니다.</span>;
  }

  // TODO: 본인 데이터 받아오는 걸로 변경
  return (
    <div className="stats stats-vertical shadow w-60 h-96">
      <div className="sticky top-0 z-10">
        <MyRankingProfile
          username="아주긴닉네임입니다"
          studyTime="00H 00m"
          profileImg="https://daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a.jpg"
        />
      </div>
      {data?.data.map((datum: RankingProfileProps, index: number) => {
        return (
          <OtherRankingProfile
            key={datum.username}
            rank={index + 1}
            username={datum.username}
            studyTime={datum.studyTime}
            profileImg={datum.profileImg}
          />
        );
      })}
    </div>
  );
};

export default Ranking;
