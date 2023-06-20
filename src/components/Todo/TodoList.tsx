import { useQuery } from '@tanstack/react-query';
import GroupTodo from './GroupTodo';
import { GroupData } from './TodoTypes';
import { getMyGroups } from '../../utils/api';

const TodoList = () => {
  const {
    data: myGroupList,
    isLoading,
    isError,
  } = useQuery(['MyGroupData'], () => getMyGroups(), {
    staleTime: 20000,
  });

  return (
    <div className="card card-bordered border-[#D9D9D9] w-72 h-[30rem] bg-[#FAFAFA] rounded-md overflow-auto">
      <div className="card-body" style={{ padding: '0.6rem' }}>
        <h2 className="ml-2 font-bold card-title">TO DO</h2>
        {isError || isLoading ? (
          <span className="loading loading-dots loading-sm" />
        ) : (
          myGroupList?.map((group: GroupData) => (
            <GroupTodo key={group.groupId} groupData={group} />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
