import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BiSearch } from '@react-icons/all-files/bi/BiSearch';
import { getAllGroups, joinGroup } from '@/utils/api';
import { GroupData, SelectedGroup } from './GroupRadio';
import GroupSearchList from './GroupSearchList';
import { useSelectedGroupIdActions } from '@/store/groupStore';

declare global {
  interface Window {
    groupSearchModal: HTMLDialogElement;
  }
}

const GroupSearchModal = () => {
  const queryInfo = useQuery(['allGroupData'], () => getAllGroups(), {
    enabled: false,
  });
  const { data } = queryInfo;

  const queryClient = useQueryClient();

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

  const { setGroupId } = useSelectedGroupIdActions();

  const joinGroupMutation = useMutation(
    (values: { groupId: number; password: string }) => joinGroup(values),
    {
      onSuccess: (res: {
        color: string;
        groupId: number;
        groupName: string;
        path: string;
        secret: boolean;
      }) => {
        if (res !== null) {
          onClose();
          setGroupId(res.groupId);
        }
        queryClient.invalidateQueries(['MyGroupData']);
      },
    }
  );

  const onJoin = () => {
    if (!selectedGroup) {
      return;
    }

    joinGroupMutation.mutate({
      groupId: selectedGroup.groupId,
      password: passwordRef.current?.value || '',
    });
  };

  return (
    <>
      <button type="button" className="btn btn-square" onClick={handleOpen}>
        <BiSearch size={24} />
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
          <GroupSearchList
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
              className="col-auto mt-10 mb-2 btn btn-primary btn-block"
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
