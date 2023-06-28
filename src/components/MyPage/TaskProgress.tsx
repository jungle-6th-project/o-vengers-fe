import { useQueries, useQuery } from '@tanstack/react-query';
import { GroupsItem } from '@/types/types';
import { getMyGroups, getTodoDatas } from '@/utils/api';
import { Todo } from '../Todo/TodoTypes';

const TaskProgress = () => {
  // const [todoDatas, setTodoDatas] = useState([]);
  // const [filterCompleteTodo, setFilterCompleteTodo] = useState(0);

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
    <div className="rounded-md min-h-[250px] h-[20.5vw] p-[1.5vw] bg-reservation w-[16vw] min-w-leftbar max-w-leftbar flex flex-col">
      <p className="font-semibold  text-black text-[1.9vw]">TODO</p>
      <p className=" text-bbodog_blue font-medium text-[0.9vw] ml-1 leading-none">
        투두리스트
      </p>
      <div className="mt-auto font-medium">
        <p className="text-bbodog_blue text-[0.9vw] leading-none">
          {todoDatas.length === 0 ? 0 : completeRate}% TASK COMPLETED
        </p>
        <progress
          className="w-[13vw] progress"
          value={todoDatas.length === 0 ? 0 : completeRate}
          max="100"
        />
      </div>
    </div>
  );
};

export default TaskProgress;
