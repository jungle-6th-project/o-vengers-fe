import { useState } from 'react';
import { RiArrowGoBackLine } from '@react-icons/all-files/ri/RiArrowGoBackLine';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteGroup,
  getTodoDatas,
  getUserNearestReservation,
} from '@/utils/api';
import { useSelectedGroupIdActions } from '@/store/groupStore';
import { useUserReservationActions } from '@/store/userReservationStore';

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
  handleRadioChange,
  toggleEdit,
}: {
  selectedColor: string;
  groupId: number;
  path: string;
  handleInvite: (path: string) => void;
  handleRadioChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleEdit: () => void;
}) => {
  const [tooltip, setTooltip] = useState('초대 링크 복사');

  const handleTooltip = () => {
    setTooltip('복사되었습니다!');
    setTimeout(() => setTooltip('초대 링크 복사'), 4000);
  };

  const { setSelectedGroupId } = useSelectedGroupIdActions();
  const { removeUserGroupReservation } = useUserReservationActions();

  const { refetch: todoRefetch } = useQuery(
    ['MyTodoList', groupId],
    () => getTodoDatas(groupId),
    {
      enabled: false,
    }
  );

  const { refetch: nearestReservationRefetch } = useQuery(
    ['userNearestReservation'],
    getUserNearestReservation,
    {
      enabled: false,
    }
  );

  const queryClient = useQueryClient();

  const deleteGroupMutation = useMutation((id: number) => deleteGroup(id), {
    onSuccess: (_, id) => {
      queryClient.setQueryData<GroupsItem[]>(['MyGroupData'], oldData =>
        oldData?.filter(group => group.groupId !== id)
      );
      removeUserGroupReservation(id);
      setSelectedGroupId(1);
      nearestReservationRefetch();
      todoRefetch();
    },
  });

  const handleDelete = async (deleteGroupId: number) => {
    if (deleteGroupId === 1) {
      return;
    }
    deleteGroupMutation.mutate(deleteGroupId);
  };

  return (
    <div
      role="presentation"
      className={`relative card w-group min-w-group-min max-w-group-max h-groupList min-h-header-min max-h-header-max bg-base-200 border-4 border-${selectedColor} text-black cursor-pointer`}
    >
      <div className="grid w-full h-full p-3 grid-rows-group-edit grid-cols-group-edit card-body">
        <div
          className="tooltip tooltip-bottom"
          data-tip={groupId !== 1 ? tooltip : '기본 그룹 초대 불가'}
        >
          <button
            type="button"
            className={`justify-start w-full h-full min-h-0 col-start-1 row-start-1 p-0 pl-2 m-0 text-base font-normal p-l btn disabled:bg-base-200 ${
              groupId === 1 && 'no-animation'
            }`}
            onClick={() => {
              handleInvite(path);
              handleTooltip();
            }}
            disabled={groupId === 1}
          >
            그룹 초대
          </button>
        </div>
        <button
          type="button"
          className="col-start-2 row-start-1 p-0 btn btn-ghost btn-sm"
          onClick={toggleEdit}
        >
          <RiArrowGoBackLine size="20" />
        </button>
        {groupId === 1 ? (
          <div
            className="tooltip tooltip-bottom"
            data-tip="기본 그룹 탈퇴 불가"
          >
            <button
              type="button"
              className="justify-start w-full h-full min-h-0 col-start-1 row-start-2 p-0 pl-2 m-0 text-base font-normal btn disabled:bg-base-200 no-animation"
              disabled
            >
              그룹 탈퇴
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="justify-start w-full h-full min-h-0 col-start-1 row-start-2 p-0 pl-2 m-0 text-base font-normal btn disabled:bg-base-200"
            onClick={() => handleDelete(groupId)}
            disabled={groupId === 1}
          >
            그룹 탈퇴
          </button>
        )}
        <form className="flex self-center justify-around col-span-2 row-start-3">
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
