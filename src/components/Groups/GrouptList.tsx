import { useQuery } from '@tanstack/react-query';
import { getMyGroups } from '@/utils/api';
import Groups from './Groups';

interface GroupsItem {
  color: string;
  groupId: number;
  groupName: string;
  secret: boolean;
  path: string;
}

const GrouptList = () => {
  // 내가 속한 그룹들
  const {
    data: myGroupList,
    isError,
    isLoading,
  } = useQuery<GroupsItem[], Error>(['MyGroupData'], () => getMyGroups());
  if (isError || isLoading) {
    return <div />;
  }

  return (
    <div className="flex">
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
