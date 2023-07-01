import { useQueries, useQuery } from '@tanstack/react-query';
import { GroupsItem } from '@/types/types';
import { getMyGroups, getTodoDatas } from '@/utils/api';
import { Todo } from '../Todo/TodoTypes';

const TaskProgress = () => {
  // 가입한 groupId 가져옴
  const { data: groupsId } = useQuery(['MyGroupData'], () => getMyGroups(), {
    staleTime: 50000,
    select(data) {
      return data.map((item: GroupsItem) => item.groupId);
    },
  });

  // groupId별 todo목록을 한번에 받아옴
  const result = useQueries({
    queries:
      groupsId?.map((id: number) => ({
        queryKey: ['MyTodoList', id],
        queryFn: getTodoDatas(id),
        staleTime: 100000,
        enabled: !!groupsId,
      })) ?? [],
  });
  const todoDatas = result?.flatMap(todos => todos.data);

  const filterCompleteTodo = (todoDatas as Todo[]).filter(
    (todo: Todo) => todo?.done
  )?.length;

  const completeRate = Number(
    ((filterCompleteTodo / todoDatas.length) * 100).toFixed(1)
  );
  return (
    <div className="rounded-md w-full p-6 bg-[#EEEEEE] min-w-leftbar flex flex-col text-[#474747] h-profile max-h-profile min-h-profile">
      <p className="text-3xl">TODO</p>
      <p className="text-sm font-medium leading-none text-bbodog_blue">
        투두리스트
      </p>
      <div className="mt-auto">
        <p className="text-sm leading-none">
          {todoDatas.length === 0 ? 0 : completeRate}% TASK COMPLETED
        </p>
        <progress
          className="w-full progress progress-primary"
          value={todoDatas.length === 0 ? 0 : completeRate}
          max="100"
        />
      </div>
    </div>
  );
};

export default TaskProgress;
