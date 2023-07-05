import { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

import { changeGroupColor } from '@/utils/api';
import ShowGroup from './ShowGroup';
import EditGroup, { GroupsItem } from './EditGroup';
import {
  useSelectedGroupId,
  useSelectedGroupIdActions,
} from '@/store/groupStore';

const Groups = ({ groupId, groupName, color, secret, path }: GroupsItem) => {
  const { setGroupColorById } = useSelectedGroupIdActions();
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
  const [, copy] = useCopyToClipboard();

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
  const toggleEdit = () => {
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
      handleRadioChange={handleRadioChange}
      toggleEdit={toggleEdit}
    />
  ) : (
    <ShowGroup
      selectedColor={selectedColor}
      groupId={groupId}
      groupName={groupName}
      secret={secret}
      toggleEdit={toggleEdit}
    />
  );
};

export default Groups;
