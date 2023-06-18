import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCookies } from 'react-cookie';
import { getAllGroups, joinGroup } from '../utils/api';
import { lockIcon, searchIcon } from '../utils/icons';

declare global {
  interface Window {
    groupSearchModal: HTMLDialogElement;
  }
}

interface SelectedGroup {
  groupId: number;
  secret: boolean;
}
interface GroupData extends SelectedGroup {
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
        <label className="cursor-pointer label" htmlFor={`${groupId}`}>
          {/* 라디오 버튼 */}
          <input
            type="radio"
            name="radio-group"
            className="radio checked:bg-blue-500"
            id={`${groupId}`}
            onChange={onChange}
            checked={selectedGroup?.groupId === groupId}
          />
          {/* 그룹 이름 */}
          <span className="label-text">{groupName}</span>
          {/* 자물쇠 그림 */}
          {secret ? lockIcon : <span className="w-5 h-5" />}
        </label>
      </div>
      {/* 가로선 */}
      <div className="divider" style={{ margin: 0 }} />
    </>
  );
};

type GroupsListProps = {
  filteredData: GroupData[];
  onGroupSelect: (group: SelectedGroup | null) => void;
  selectedGroup: SelectedGroup | null;
};

const GroupsList = ({
  filteredData,
  onGroupSelect,
  selectedGroup,
}: GroupsListProps) => {
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

const GroupSearchModal = () => {
  const { accessToken } = useCookies(['accessToken'])[0];

  const queryInfo = useQuery(
    ['allGroupData'],
    () => getAllGroups(accessToken),
    {
      enabled: false,
    }
  );
  const { data } = queryInfo;

  const [searchInputs, setSearchInputs] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<SelectedGroup | null>(
    null
  );

  const passwordRef = useRef<HTMLInputElement>(null);

  const filteredData = data?.filter((group: GroupData) =>
    group.groupName.toLowerCase().includes(searchInputs.toLowerCase())
  );

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchInputs(e.currentTarget.value);
  };

  const handleOpen = () => {
    queryInfo.refetch();
    window.groupSearchModal.showModal();
  };

  const onClose = () => {
    setSearchInputs('');
    setSelectedGroup(null);
    window.groupSearchModal.close();
    queryInfo.refetch();
  };

  const onGroupSelect = (group: SelectedGroup | null) => {
    setSelectedGroup(group);
  };

  useEffect(() => {
    if (passwordRef.current) {
      passwordRef.current.value = '';
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (
      selectedGroup &&
      !filteredData?.some(
        (group: GroupData) => group.groupId === selectedGroup.groupId
      )
    ) {
      setSelectedGroup(null);
    }
  }, [searchInputs, selectedGroup, filteredData]);

  const joinGroupMutation = useMutation(
    (values: { accessToken: string; groupId: number; password: string }) =>
      joinGroup(values),
    {
      onSuccess: res => {
        if (res !== null) onClose();
      },
    }
  );

  const onJoin = () => {
    if (!selectedGroup) {
      return;
    }

    joinGroupMutation.mutate({
      // eslint-disable-next-line object-shorthand
      accessToken: accessToken,
      groupId: selectedGroup.groupId,
      password: passwordRef.current?.value || '',
    });
    // TODO: 에러 처리, 모달 닫고 해당 그룹으로 이동
  };

  return (
    <>
      <button type="button" className="btn btn-square" onClick={handleOpen}>
        {searchIcon}
      </button>
      <dialog id="groupSearchModal" className="modal">
        <form method="dialog" className="modal-box">
          <h1 className="text-3xl font-semibold">그룹 검색</h1>
          <p className="py-4 text-lg">그룹을 검색하고 참여할 수 있습니다.</p>
          <input
            type="text"
            placeholder="그룹 이름을 입력하세요"
            className="w-full input input-bordered"
            id="groupName"
            name="groupName"
            value={searchInputs}
            onChange={onChange}
          />
          <GroupsList
            filteredData={filteredData}
            onGroupSelect={onGroupSelect}
            selectedGroup={selectedGroup}
          />
          {selectedGroup?.secret && (
            <input
              placeholder="비밀번호를 입력하세요"
              className="w-full mt-8 input input-bordered"
              id="groupPassword"
              name="groupPassword"
              ref={passwordRef}
            />
          )}
          <div className="flex flex-col">
            <input
              type="reset"
              className="mt-10 mb-2 col-auto btn btn-info btn-block"
              value="그룹 참여하기"
              onClick={onJoin}
              disabled={!selectedGroup}
            />
            <input
              type="reset"
              className="col-auto btn btn-block"
              value="취소"
              onClick={onClose}
            />
          </div>
        </form>
      </dialog>
    </>
  );
};

export default GroupSearchModal;
