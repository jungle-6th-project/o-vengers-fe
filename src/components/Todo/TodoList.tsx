import { useQuery } from '@tanstack/react-query';
import GroupTodo from './GroupTodo';
import { GroupData } from './TodoTypes';
import { getMyGroups } from '../../utils/api';

const TodoList = () => {
  const { data: myGroupList } = useQuery(['MyGroupData'], () => getMyGroups());

  return myGroupList?.map((group: GroupData) => (
    <GroupTodo key={group.groupId} groupData={group} />
  ));
};

export default TodoList;
