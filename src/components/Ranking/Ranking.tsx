import { useSelectedGroupId } from '@/store/groupStore';
import GroupRankings from './GroupRankings';

const Ranking = () => {
  const groupId = useSelectedGroupId();

  return (
    <div className="stats-vertical h-full w-ranking_todo min-w-leftbar max-w-leftbar border border-[#D9D9D9] rounded-md mb-3 flex flex-col">
      <GroupRankings groupId={groupId} />
    </div>
  );
};

export default Ranking;
