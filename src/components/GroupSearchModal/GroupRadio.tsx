import { FaLock } from '@react-icons/all-files/fa/FaLock';

export interface SelectedGroup {
  groupId: number;
  secret: boolean;
}

export interface GroupData extends SelectedGroup {
  groupName: string;
}

interface GroupRadioProps extends GroupData {
  onGroupSelect: (group: SelectedGroup | null) => void;
  selectedGroup: SelectedGroup | null;
}

const GroupRadio = ({
  groupId,
  groupName,
  secret,
  onGroupSelect,
  selectedGroup,
}: GroupRadioProps) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onGroupSelect(e.target.checked ? { groupId, secret } : null);
  };

  return (
    <>
      <div className="form-control">
        <label
          className="cursor-pointer label h-[3.2rem]"
          htmlFor={`group${groupId}`}
        >
          {/* 라디오 버튼 */}
          <input
            type="radio"
            name="radio-group"
            className="radio checked:bg-primary"
            id={`group${groupId}`}
            onChange={onChange}
            checked={selectedGroup?.groupId === groupId}
          />
          {/* 그룹 이름 */}
          <span>{groupName}</span>
          {/* 자물쇠 그림 */}
          {secret ? <FaLock /> : <span className="w-5 h-5" />}
        </label>
      </div>
      {/* 가로선 */}
      <div className="divider h-0.5 m-0 p-0" />
    </>
  );
};

export default GroupRadio;
