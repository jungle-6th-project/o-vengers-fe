import { useState } from 'react';
import { RiArrowGoBackLine } from '@react-icons/all-files/ri/RiArrowGoBackLine';

export interface GroupsItem {
  color: string;
  groupId: number;
  groupName: string;
  secret: boolean;
  path: string;
}

const EditGroup = ({
  selectedColor,
  groupId,
  path,
  handleInvite,
  handleDelete,
  handleRadioChange,
  handleEdit,
}: {
  selectedColor: string;
  groupId: number;
  path: string;
  handleInvite: (path: string) => void;
  handleDelete: (groupId: number) => void;
  handleRadioChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEdit: () => void;
}) => {
  const [tooltip, setTooltip] = useState('초대 링크 복사');

  const handleTooltip = () => {
    setTooltip('복사되었습니다!');
    setTimeout(() => setTooltip('초대 링크 복사'), 5000);
  };
  return (
    <div
      role="presentation"
      className={`relative card w-group min-w-group-min max-w-group-max h-groupList min-h-header-min max-h-header-max bg-base-200 border-4 border-${selectedColor} text-black cursor-pointer`}
    >
      <div className="w-full h-full p-3 grid grid-rows-group-edit grid-cols-group-edit card-body">
        {groupId !== 1 && (
          <div className="tooltip tooltip-bottom" data-tip={tooltip}>
            <button
              type="button"
              className="justify-start w-full py-0 my-0 col-start-1 row-start-1 btn btn-sm"
              onClick={() => {
                handleInvite(path);
                handleTooltip();
              }}
            >
              그룹 초대
            </button>
          </div>
        )}
        <button
          type="button"
          className="p-0 col-start-2 row-start-1 btn btn-ghost btn-sm"
          onClick={handleEdit}
        >
          <RiArrowGoBackLine size="20" />
        </button>
        {/* <div className="grid-cols-1 grid-rows-2"> */}
        {groupId !== 1 && (
          <button
            type="button"
            className="justify-start w-full py-0 my-0 col-start-1 row-start-2 btn btn-sm"
            onClick={() => handleDelete(groupId)}
          >
            그룹 탈퇴
          </button>
        )}
        {/* </div> */}
        {/* <summary>그룹 색상 변경</summary> */}
        <form
          className={`flex justify-around row-start-${
            groupId !== 1 ? '3' : '2'
          } col-span-2 self-center`}
        >
          <input
            type="radio"
            name="radio-10"
            value="neutral"
            className="radio checked:bg-neutral ring ring-neutral"
            checked={selectedColor === 'neutral'}
            onChange={handleRadioChange}
            key={`neutral-${selectedColor === 'neutral'}`}
          />
          <input
            type="radio"
            name="radio-10"
            value="primary"
            className="radio checked:bg-primary ring ring-primary"
            checked={selectedColor === 'primary'}
            onChange={handleRadioChange}
            key={`primary-${selectedColor === 'primary'}`}
          />
          <input
            type="radio"
            name="radio-10"
            value="accent"
            className="radio checked:bg-accent ring ring-accent"
            checked={selectedColor === 'accent'}
            onChange={handleRadioChange}
            key={`accent-${selectedColor === 'accent'}`}
          />
          <input
            type="radio"
            name="radio-10"
            value="secondary"
            className="radio checked:bg-secondary ring ring-secondary"
            checked={selectedColor === 'secondary'}
            onChange={handleRadioChange}
            key={`secondary-${selectedColor === 'secondary'}`}
          />
        </form>
      </div>
    </div>
  );
};

export default EditGroup;
