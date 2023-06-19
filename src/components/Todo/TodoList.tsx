import { useCookies } from 'react-cookie';
import { useQuery } from '@tanstack/react-query';
import GroupTodo from './GroupTodo';
import { GroupData } from './TodoTypes';
import { getMyGroups } from '../../utils/api';

const TodoList = () => {
  const [{ accessToken }, ,] = useCookies(['accessToken']);

  const { data: myGroupList } = useQuery(['MyGroupData'], () =>
    getMyGroups(accessToken)
  );

  return myGroupList?.map((group: GroupData) => (
    <GroupTodo key={group.groupId} groupData={group} />
  ));
};

export default TodoList;
