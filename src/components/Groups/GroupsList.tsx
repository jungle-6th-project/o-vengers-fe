import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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
    <div className="flex h-groupList min-h-header-min max-h-header-max">
      {myGroupsList?.map((group: GroupsItem) => {
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

export default GroupsList;
