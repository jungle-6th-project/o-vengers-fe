import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCopyToClipboard } from 'usehooks-ts';
import { FaLock } from 'react-icons/fa';
import { useSelectedGroupIdActions } from '@/store/groupStore';
import {
  changeGroupColor,
  deleteGroup,
  getJoinedGroupMemebers,
} from '@/utils/api';

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
          <div key={profile} className="w-10 h-10 avatar">
            <div className="w-12">
              <img alt="profile" src={profile} />
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
  const { setGroupId } = useSelectedGroupIdActions();
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    color === null ? 'bg-white' : color
  );
  const queryClient = useQueryClient();
  const [, copy] = useCopyToClipboard();

  const deleteGroupMutation = useMutation((id: number) => deleteGroup(id), {
    onSuccess: (_, id) => {
      queryClient.setQueryData<GroupsItem[]>(['MyGroupData'], oldData =>
        oldData?.filter(group => group.groupId !== id)
      );
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
        ? `http://localhost:5173/${copyUrl}`
        : `https://d23wakgp76ydiy.cloudfront.net/${path}`;

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
  };

  const {
    data: profiles,
    isError,
    isLoading,
  } = useQuery(
    ['membersInfo', groupId],
    () => getJoinedGroupMemebers(groupId),
    {
      select(data) {
        const profileImages = data.map(
          (item: JoinedGroupsItem) => item.profile
        );
        return profileImages;
      },
    }
  );

  if (isError || isLoading) {
    return <div />;
  }

  return (
    <div
      role="presentation"
      className={`shadow card w-[225px] h-[12.625rem] ${selectedColor} cursor-pointer`}
      onClick={() => setGroupId(groupId)}
      onKeyDown={() => setGroupId(groupId)}
    >
      <div className="justify-between card-body">
        <div className="items-start justify-between card-actions">
          <MemberProfiles profiles={profiles} />
          <div className="dropdown">
            <button
              type="button"
              className="justify-end btn btn-ghost btn-square"
            >
              <BsThreeDotsVertical size="24" />
            </button>
            <ul className="z-30 w-56 menu dropdown-content bg-base-200 rounded-box">
              <li>
                <button type="button" onClick={() => handleInvite(path)}>
                  그룹 초대
                </button>
              </li>
              {groupId !== 1 && (
                <li>
                  <button type="button" onClick={() => handleDelete(groupId)}>
                    그룹 삭제
                  </button>{' '}
                </li>
              )}
              <li>
                <details open className="flex">
                  <summary>그룹 색상 변경</summary>
                  <form className="justify-around p-2 join">
                    <input
                      type="radio"
                      name="radio-10"
                      value="bg-black"
                      className="radio checked:bg-black"
                      checked={selectedColor === 'bg-black'}
                      onChange={handleRadioChange}
                    />
                    <input
                      type="radio"
                      name="radio-10"
                      value="bg-bbodog_blue"
                      className="radio checked:bg-bbodog_blue"
                      checked={selectedColor === 'bg-bbodog_blue'}
                      onChange={handleRadioChange}
                    />
                    <input
                      type="radio"
                      name="radio-10"
                      value="bg-bbodog_green"
                      className="radio checked:bg-bbodog_green"
                      checked={selectedColor === 'bg-bbodog_green'}
                      onChange={handleRadioChange}
                    />
                    <input
                      type="radio"
                      name="radio-10"
                      value="bg-bbodog_orange"
                      className="radio checked:bg-bbodog_orange"
                      checked={selectedColor === 'bg-bbodog_orange'}
                      onChange={handleRadioChange}
                    />
                    <input
                      type="radio"
                      name="radio-10"
                      value="bg-white"
                      className="radio checked:bg-white"
                      checked={selectedColor === 'bg-white'}
                      onChange={handleRadioChange}
                    />
                  </form>
                </details>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h2
            className={`${
              selectedColor === 'bg-bbodog_blue' || selectedColor === 'bg-black'
                ? 'text-white'
                : 'text-black'
            } card-title`}
          >
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
