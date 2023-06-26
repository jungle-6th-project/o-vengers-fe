import { useQuery } from '@tanstack/react-query';
import { GroupData } from '@/components/Todo/TodoTypes';
import GroupTodo from './GroupTodo';
import { getMyGroups } from '@/utils/api';

const VideoTodoList = () => {
  const { data: myGroupList } = useQuery(['MyGroupData'], () => getMyGroups(), {
    staleTime: 20000,
  });
  return (
    <div className="card card-bordered border-[#D9D9D9] w-ranking_todo min-w-leftbar max-w-leftbar h-todo bg-[#FAFAFA] rounded-md overflow-auto border-t-0">
      <div className="card-body" style={{ padding: '0.6rem' }}>
        {myGroupList?.map((group: GroupData) => (
          <GroupTodo key={group.groupId} groupData={group} />
        ))}
      </div>
    </div>
  );
};

export default VideoTodoList;
