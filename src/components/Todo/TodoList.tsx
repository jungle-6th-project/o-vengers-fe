import { useQuery } from '@tanstack/react-query';
import GroupTodo from './GroupTodo';
import { GroupData } from './TodoTypes';
import { getMyGroups } from '@/utils/api';

const TodoList = () => {
  const {
    data: myGroupList,
    isLoading,
    isError,
  } = useQuery(['MyGroupData'], () => getMyGroups(), {
    staleTime: 20000,
  });

  return (
    <div className="card card-bordered border-[#D9D9D9] w-ranking_todo min-w-leftbar max-w-leftbar h-full bg-[#FAFAFA] rounded-md overflow-auto">
      <div className="card-body p-[0.6rem]">
        <h2 className="ml-2 font-normal card-title">TO DO</h2>
        {isError || isLoading ? (
          <span className="h-full loading loading-dots loading-md place-self-center" />
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
