import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCookies } from 'react-cookie';

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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  );
};

const fetchGroupData = async (accessToken: string) => {
  const res = await axios.get('https://www.sangyeop.shop/api/v1/groups', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data.data;
};

interface GroupData {
  groupId: number;
  groupName: string;
  secret: boolean;
}

const GroupRadio = ({ groupId, groupName, secret }: GroupData) => {
  return (
    <>
      <div className="form-control">
        <label className="label cursor-pointer" htmlFor={`${groupId}`}>
          <input
            type="radio"
            name="radio-group"
            className="radio checked:bg-blue-500"
            id={`${groupId}`}
          />
          <span className="label-text">{groupName}</span>
          {secret ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <span className="w-5 h-5" />
          )}
        </label>
      </div>
      <div className="divider" style={{ margin: 0 }} />
    </>
  );
};

const GroupSearchModal = () => {
  const [{ accessToken }, ,] = useCookies(['accessToken']);

  const { data } = useQuery(['fetchData'], () => fetchGroupData(accessToken));

  const [inputs, setInputs] = useState('');

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputs(e.currentTarget.value);
  };

  const onClose = () => {
    setInputs('');
    window.groupSearchModal.close();
  };

  const filteredData = data?.filter((group: GroupData) =>
    group.groupName.toLowerCase().includes(inputs.toLowerCase())
  );

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
            value={inputs}
            onChange={onChange}
          />
          <div className="overflow-y-scroll max-h-64 mt-8">
            {filteredData?.map((group: GroupData) => (
              <GroupRadio
                key={group.groupId}
                groupId={group.groupId}
                groupName={group.groupName}
                secret={group.secret}
              />
            ))}
          </div>
          <div className="flex flex-col">
            <input
              type="reset"
              className="btn btn-info btn-block col-auto mt-14 mb-2"
              value="그룹 참여하기"
              onClick={() => console.log('clicked!')}
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
