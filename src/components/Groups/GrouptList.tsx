import { useQuery } from '@tanstack/react-query';
// import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getMyGroups } from '@/utils/api';
import Groups from './Groups';
import { useSelectedGroupIdActions } from '@/store/groupStore';

interface GroupsItem {
  color: string;
  groupId: number;
  groupName: string;
  secret: boolean;
  path: string;
}

const GrouptList = () => {
  // const groups = useGroups();
  const { setGroup, getGroupNameById } = useSelectedGroupIdActions();
  // 내가 속한 그룹들
  const {
    data: myGroupList,
    isError,
    isLoading,
    isSuccess,
  } = useQuery<GroupsItem[], Error>(['MyGroupData'], () => getMyGroups(), {
    staleTime: 20000,
    refetchOnWindowFocus: true,
  });

  if (isSuccess) {
    setGroup(myGroupList);
  }
  console.log(getGroupNameById(170));

  if (isError || isLoading) {
    return <div />;
  }

  return (
    <div className="flex h-[12.625rem]">
      {myGroupList?.map((group: GroupsItem) => {
        return (
          <Groups
            key={group.groupId}
            groupId={group.groupId}
            groupName={group.groupName}
            color={group.color}
            secret={group.secret}
            path={group.path}
          />
        );
      })}
    </div>
  );
};

export default GrouptList;
