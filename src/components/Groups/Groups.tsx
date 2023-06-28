import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCopyToClipboard } from 'usehooks-ts';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaLock } from 'react-icons/fa';
import {
  useSelectedGroupId,
  useSelectedGroupIdActions,
} from '@/store/groupStore';
import {
  changeGroupColor,
  deleteGroup,
  getGroupMembers,
  getUserNearestReservation,
} from '@/utils/api';
import { useUserReservationActions } from '@/store/userReservationStore';

interface JoinedGroupsItem {
  duration: string;
  memberId: number;
  nickname: string;
  profile: string;
}

interface GroupsItem {
  color: string;
  groupId: number;
  groupName: string;
  secret: boolean;
  path: string;
}

export const MemberProfiles = ({ profiles }: { profiles: string[] }) => {
  return (
    <div className="-space-x-6 avatar-group">
      {profiles.slice(0, 3).map((profile: string) => {
        return (
          <div key={`profile${Math.random()}`} className="w-10 h-10 avatar">
            <div className="w-12">
              <img
                alt="profile"
                src={profile ? `${profile}` : '../../defaultProfile.png'}
              />
            </div>
          </div>
        );
      })}
      {profiles.length > 3 && (
        <div className="w-10 h-10 avatar placeholder">
          <div className="text-black bg-gray-300 ">
            <span>+{profiles.length - 3}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const Groups = ({ groupId, groupName, color, secret, path }: GroupsItem) => {
  const { setGroupId, setGroupColorById } = useSelectedGroupIdActions();
  const { removeUserGroupReservation } = useUserReservationActions();
  const [isToastVisible, setIsToastVisible] = useState(false);

  let newColor = color;
  if (color === null) {
    newColor = ['primary', 'secondary', 'accent', 'neutral'][
      Math.floor(Math.random() * 4)
    ];
    console.log(newColor);
    changeGroupColor(groupId, newColor);
    setGroupColorById(groupId, newColor);
  }

  const [selectedColor, setSelectedColor] = useState(newColor);
  const queryClient = useQueryClient();
  const [, copy] = useCopyToClipboard();

  const { refetch } = useQuery(
    ['userNearestReservation'],
    getUserNearestReservation,
    {
      enabled: false,
    }
  );

  const deleteGroupMutation = useMutation((id: number) => deleteGroup(id), {
    onSuccess: (_, id) => {
      queryClient.setQueryData<GroupsItem[]>(['MyGroupData'], oldData =>
        oldData?.filter(group => group.groupId !== id)
      );
      removeUserGroupReservation(id);
      setGroupId(1);
      refetch();
    },
  });

  const handleDelete = async (deleteGroupId: number) => {
    if (deleteGroupId === 1) {
      return;
    }
    deleteGroupMutation.mutate(deleteGroupId);
  };

  const handleInvite = (copyUrl: string) => {
    const url =
      import.meta.env.MODE === 'development'
        ? `http://localhost:5173/invite/${copyUrl}`
        : `https://www.bbodogstudy.com/invite/${copyUrl}`;

    copy(url);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3000);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.currentTarget.value;
    setSelectedColor(selectedValue);
    changeGroupColor(groupId, selectedValue);
    setGroupColorById(groupId, selectedValue);
  };

  const {
    data: profiles,
    isError,
    isLoading,
  } = useQuery(['membersInfo', groupId], () => getGroupMembers(groupId), {
    staleTime: 20000,
    select(data) {
      const profileImages = data.map((item: JoinedGroupsItem) => item.profile);
      return profileImages;
    },
  });

  const selectedGroupId = useSelectedGroupId();

  if (isError || isLoading) {
    return <div />;
  }

  return (
    <div
      role="presentation"
      className={`relative card w-group min-w-group-min max-w-group-max h-groupsList min-h-header-min max-h-header-max bg-${selectedColor} text-${selectedColor}-content cursor-pointer mr-3`}
      onClick={() => setGroupId(groupId)}
      onKeyDown={() => setGroupId(groupId)}
    >
      {groupId === selectedGroupId && (
        <div
          className={`absolute top-1 left-1 right-1 bottom-1 border-4 border-${selectedColor}-content rounded-xl`}
        />
      )}
      <div className="justify-between p-5 border-white border-double card-body">
        <div className="items-start justify-between card-actions">
          <MemberProfiles profiles={profiles} />
          <div className="dropdown">
            <button type="button" className="p-0 btn btn-ghost btn-sm">
              <BsThreeDotsVertical size="20" />
            </button>
            <ul className="z-50 w-56 text-black menu dropdown-content bg-base-200 rounded-box">
              {groupId !== 1 && (
                <>
                  <li>
                    <button type="button" onClick={() => handleInvite(path)}>
                      그룹 초대
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => handleDelete(groupId)}>
                      그룹 탈퇴
                    </button>{' '}
                  </li>
                </>
              )}
              <li>
                <details open className="flex">
                  <summary>그룹 색상 변경</summary>
                  <form className="justify-around p-2 join">
                    <input
                      type="radio"
                      name="radio-10"
                      value="neutral"
                      className="radio checked:bg-neutral ring ring-neutral"
                      checked={selectedColor === 'neutral'}
                      onChange={handleRadioChange}
                    />
                    <input
                      type="radio"
                      name="radio-10"
                      value="primary"
                      className="radio checked:bg-primary ring ring-primary"
                      checked={selectedColor === 'primary'}
                      onChange={handleRadioChange}
                    />
                    <input
                      type="radio"
                      name="radio-10"
                      value="accent"
                      className="radio checked:bg-accent ring ring-accent"
                      checked={selectedColor === 'accent'}
                      onChange={handleRadioChange}
                    />
                    <input
                      type="radio"
                      name="radio-10"
                      value="secondary"
                      className="radio checked:bg-secondary ring ring-secondary"
                      checked={selectedColor === 'secondary'}
                      onChange={handleRadioChange}
                    />
                  </form>
                </details>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <h2 className="font-medium leading-none card-title line-clamp-2">
            {groupName}
          </h2>
          <span>{secret && <FaLock />}</span>
        </div>
        {isToastVisible && (
          <div className="toast toast-top toast-end">
            <div className="alert alert-info">
              <span>초대링크가 복사되었습니다!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
