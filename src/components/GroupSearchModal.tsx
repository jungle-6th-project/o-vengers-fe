import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCookies } from 'react-cookie';
import { getAllGroups } from '../utils/fetcher';
import { lockIcon, searchIcon } from '../utils/icons';

declare global {
  interface Window {
    groupSearchModal: HTMLDialogElement;
  }
}

const GroupSearchModalOpenButton = () => {
  const handleOpen = () => {
    window.groupSearchModal.showModal();
  };

  return (
    <button type="button" className="btn btn-square" onClick={handleOpen}>
      {searchIcon}
    </button>
  );
};

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
        <label className="label cursor-pointer" htmlFor={`${groupId}`}>
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
    <div className="overflow-y-scroll max-h-64 mt-8">
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
  const { data } = useQuery(['allGroupData'], () => getAllGroups(accessToken));

  const [searchInputs, setSearchInputs] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<SelectedGroup | null>(
    null
  );

  const passwordRef = useRef<HTMLInputElement>(null);

  // FIXME: 이미 가입한 건 안 보이게
  const filteredData = data?.filter((group: GroupData) =>
    group.groupName.toLowerCase().includes(searchInputs.toLowerCase())
  );

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchInputs(e.currentTarget.value);
  };

  const onClose = () => {
    setSearchInputs('');
    setSelectedGroup(null);
    window.groupSearchModal.close();
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

  // const onJoin = () => {
  //   selectedGroup;
  // }

  return (
    <>
      <GroupSearchModalOpenButton />
      <dialog id="groupSearchModal" className="modal">
        <form method="dialog" className="modal-box">
          <h1 className="font-semibold text-3xl">그룹 검색</h1>
          <p className="py-4 text-lg">그룹을 검색하고 참여할 수 있습니다.</p>
          <input
            type="text"
            placeholder="그룹 이름을 입력하세요"
            className="input input-bordered w-full"
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
              className="input input-bordered w-full mt-8"
              id="groupPassword"
              name="groupPassword"
              ref={passwordRef}
            />
          )}
          <div className="flex flex-col">
            <input
              type="reset"
              className="btn btn-info btn-block col-auto mt-10 mb-2"
              value="그룹 참여하기"
              onClick={() => console.log('clicked!')}
              disabled={!selectedGroup}
            />
            <input
              type="reset"
              className="btn btn-block col-auto"
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
