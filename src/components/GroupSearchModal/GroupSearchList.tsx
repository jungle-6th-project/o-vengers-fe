import GroupRadio, { GroupData, SelectedGroup } from './GroupRadio';

type GroupSearchListProps = {
  filteredData: GroupData[];
  onGroupSelect: (group: SelectedGroup | null) => void;
  selectedGroup: SelectedGroup | null;
};

const GroupSearchList = ({
  filteredData,
  onGroupSelect,
  selectedGroup,
}: GroupSearchListProps) => {
  return (
    <div className="mt-8 overflow-y-scroll max-h-64">
      {filteredData?.map((group: GroupData) => (
        <GroupRadio
          key={group.groupId}
          groupId={group.groupId}
          groupName={group.groupName}
          secret={group.secret}
          onGroupSelect={onGroupSelect}
          selectedGroup={selectedGroup}
        />
      ))}
    </div>
  );
};

export default GroupSearchList;
