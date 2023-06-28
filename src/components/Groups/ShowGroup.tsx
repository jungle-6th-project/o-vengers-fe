import { useQuery } from '@tanstack/react-query';
import { FaLock } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import MemberProfiles from './MemberProfiles';
import { getGroupMembers } from '@/utils/api';
import {
  useSelectedGroupId,
  useSelectedGroupIdActions,
} from '@/store/groupStore';

interface JoinedGroupsItem {
  duration: string;
  memberId: number;
  nickname: string;
  profile: string;
}

const ShowGroup = ({
  selectedColor,
  groupId,
  groupName,
  secret,
  handleEdit,
}: {
  selectedColor: string;
  groupId: number;
  groupName: string;
  secret: boolean;
  handleEdit: () => void;
}) => {
  const { setSelectedGroupId } = useSelectedGroupIdActions();
  const selectedGroupId = useSelectedGroupId();

  const {
    data: profiles,
    isError,
    isLoading,
  } = useQuery(['membersInfo', groupId], () => getGroupMembers(groupId), {
    select(data) {
      const profileImages = data.map((item: JoinedGroupsItem) => item.profile);
      return profileImages;
    },
  });

  if (isError || isLoading) {
    return <div />;
  }

  return (
    <div
      role="presentation"
      className={`relative card w-group min-w-group-min max-w-group-max h-groupList min-h-header-min max-h-header-max bg-${selectedColor} text-${selectedColor}-content cursor-pointer`}
      onClick={() => setSelectedGroupId(groupId)}
      onKeyDown={() => setSelectedGroupId(groupId)}
    >
      {groupId === selectedGroupId && (
        <div
          className={`absolute top-1 left-1 right-1 bottom-1 border-4 border-${selectedColor}-content rounded-xl`}
        />
      )}
      <div className="justify-between p-5 card-body">
        <div className="items-start justify-between card-actions">
          <MemberProfiles profiles={profiles} />
          <button
            type="button"
            className="z-10 p-0 btn btn-ghost btn-sm"
            onClick={handleEdit}
          >
            <BsThreeDotsVertical size="20" />
          </button>
        </div>
        <div className="flex items-end justify-between">
          <h2 className="font-medium leading-none card-title line-clamp-2">
            {groupName}
          </h2>
          <span className="pb-1">{secret && <FaLock size="18" />}</span>
        </div>
      </div>
    </div>
  );
};

export default ShowGroup;
