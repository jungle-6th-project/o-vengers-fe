import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

import {
  changeGroupColor,
  deleteGroup,
  getUserNearestReservation,
} from '@/utils/api';
import { useUserReservationActions } from '@/store/userReservationStore';
import ShowGroup from './ShowGroup';
import EditGroup, { GroupsItem } from './EditGroup';
import {
  useSelectedGroupId,
  useSelectedGroupIdActions,
} from '@/store/groupStore';

const Groups = ({ groupId, groupName, color, secret, path }: GroupsItem) => {
  const { setSelectedGroupId, setGroupColorById } = useSelectedGroupIdActions();
  const { removeUserGroupReservation } = useUserReservationActions();

  // let newColor = color;
  // if (color === null) {
  //   newColor = ['primary', 'secondary', 'accent', 'neutral'][
  //     Math.floor(Math.random() * 4)
  //   ];
  // }

  // const [selectedColor, setSelectedColor] = useState(newColor);
  const [selectedColor, setSelectedColor] = useState(
    color === null ? 'accent' : color
  );
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
      setSelectedGroupId(1);
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
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.currentTarget.value;
    setSelectedColor(selectedValue);
    changeGroupColor(groupId, selectedValue);
    setGroupColorById(groupId, selectedValue);
  };

  const [onEdit, setOnEdit] = useState(false);
  const handleEdit = () => {
    setOnEdit(!onEdit);
  };

  const selectedGroup = useSelectedGroupId();

  useEffect(() => {
    setOnEdit(onEdit && groupId === selectedGroup);
  }, [groupId, onEdit, selectedGroup]);

  return onEdit && groupId === selectedGroup ? (
    <EditGroup
      selectedColor={selectedColor}
      groupId={groupId}
      path={path}
      handleInvite={handleInvite}
      handleDelete={handleDelete}
      handleRadioChange={handleRadioChange}
      handleEdit={handleEdit}
    />
  ) : (
    <ShowGroup
      selectedColor={selectedColor}
      groupId={groupId}
      groupName={groupName}
      secret={secret}
      handleEdit={handleEdit}
    />
  );
};

export default Groups;
