import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Mousewheel, Navigation } from 'node_modules/swiper';

import 'swiper/css';
import 'swiper/css/navigation';

import './styles.css';

import { getMyGroups } from '@/utils/api';
import { useSelectedGroupIdActions } from '@/store/groupStore';
import Groups from './Groups';

interface GroupsItem {
  color: string;
  groupId: number;
  groupName: string;
  secret: boolean;
  path: string;
}

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
    return <div />;
  }

  return (
    <Swiper
      modules={[Keyboard, Navigation, Mousewheel]}
      spaceBetween={20}
      slidesPerView="auto"
      navigation
      rewind
      keyboard={{ enabled: true }}
      mousewheel
      className="min-h-header-min max-h-header-max h-groupList"
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
  );
};

export default GroupsList;
