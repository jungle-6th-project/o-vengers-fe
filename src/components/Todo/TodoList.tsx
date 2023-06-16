import { useCookies } from 'react-cookie';
import { useQuery } from '@tanstack/react-query';
import GroupTodo from './GroupTodo';
import { GroupData } from './TodoTypes';
import { getMyGroups } from '../../utils/api';

const TodoList = () => {
  const [{ accessToken }, ,] = useCookies(['accessToken']);

  const {
    data: myGroupList,
    isLoading,
    isError,
  } = useQuery(['MyGroupData'], () => getMyGroups(accessToken));

  if (isLoading || isError) {
    return <div>로딩중입니다</div>;
  }

  return myGroupList?.map((group: GroupData) => (
    <GroupTodo key={group.groupId} groupData={group} />
  ));
};

export default TodoList;
