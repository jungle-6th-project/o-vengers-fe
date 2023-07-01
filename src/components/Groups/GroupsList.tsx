import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Mousewheel, Navigation } from 'node_modules/swiper';

import 'swiper/css';
import 'swiper/css/navigation';

import './GroupsList.css';

import { getMyGroups } from '@/utils/api';
import { useSelectedGroupIdActions } from '@/store/groupStore';
import Groups from './Groups';
import { GroupsItem } from '@/types/types';

const GroupsList = () => {
  const { setGroup } = useSelectedGroupIdActions();
  // 내가 속한 그룹들
  const {
    data: myGroupsList,
    isError,
    isLoading,
    isSuccess,
  } = useQuery<GroupsItem[], Error>(['MyGroupData'], () => getMyGroups(), {
    staleTime: 20000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (isSuccess) {
      setGroup(myGroupsList);
    }
  }, [isSuccess, myGroupsList, setGroup]);

  if (isError || isLoading) {
    return (
      <span className="h-full loading loading-dots loading-md place-self-center" />
    );
  }

  return (
    <div
      className="grid w-full max-w-full swiper-container"
      style={{ gridTemplateColumns: '45px 1fr 45px' }}
    >
      <div className="col-start-1 swiper-button-prev" />
      <Swiper
        modules={[Keyboard, Navigation, Mousewheel]}
        spaceBetween={20}
        slidesPerView="auto"
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        rewind
        keyboard={{ enabled: true }}
        mousewheel
        className="col-start-2 min-h-header-min max-h-header-max h-groupList"
      >
        {myGroupsList?.map((group: GroupsItem) => {
          return (
            <SwiperSlide key={group.groupId}>
              <Groups
                groupId={group.groupId}
                groupName={group.groupName}
                color={group.color}
                secret={group.secret}
                path={group.path}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="swiper-button-next" />
    </div>
  );
};

export default GroupsList;
