import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useCookies } from 'react-cookie';
import { plusIcon } from '../utils/icons';
import { makeGroup } from '../utils/api';

declare global {
  interface Window {
    my_modal_1: HTMLDialogElement;
  }
}

const GroupMakeModal = () => {
  const initialInputs = {
    groupName: '',
    password: '',
  };
  const [{ accessToken }] = useCookies(['accessToken']);

  const [inputs, setInputs] = useState(initialInputs);
  const [isPassword, setIsPassword] = useState(false);

  const postMakeGroupMutation = useMutation(
    (values: {
      accessToken: string;
      groupName: string;
      password: string;
      path: string;
      secret: boolean;
    }) => makeGroup(values)
  );

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value, name } = e.currentTarget;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const onChangeToggle = () => {
    setIsPassword(prev => !prev);
    if (!isPassword) {
      setInputs(prevInputs => ({
        ...prevInputs,
        password: '',
      }));
    }
  };

  const handleModalOpen = () => {
    setInputs(initialInputs);
    setIsPassword(false);
    window.my_modal_1.showModal();
  };

  const handleModalClose = () => {
    window.my_modal_1.close();
    setInputs(initialInputs);
    setIsPassword(false);
  };

  const generateRandomString = () => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < 15; i += 1) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  };

  const onClick = () => {
    postMakeGroupMutation.mutate({
      accessToken,
      groupName: inputs.groupName,
      password: inputs.password,
      path: generateRandomString(),
      secret: isPassword,
    });
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-square"
        onClick={handleModalOpen}
      >
        {plusIcon}
      </button>
      <dialog id="my_modal_1" className="modal">
        <form action="..." className="modal-box">
          <div className="form-control w-full mb-5">
            <label className="label flex-col items-start" htmlFor="groupName">
              <span className="label-text text-lg mb-2">그룹 이름</span>
              <input
                id="groupName"
                type="text"
                placeholder="그룹 이름을 입력하세요"
                className="input input-bordered w-full"
                name="groupName"
                onChange={onChange}
                value={inputs.groupName}
              />
            </label>
          </div>
          <div className="form-control w-full">
            <label className="label flex-col items-stretch" htmlFor="password">
              <div className="flex justify-between items-center">
                <span className="label-text text-lg mb-2">비밀번호 설정</span>
                <input
                  type="checkbox"
                  className="toggle"
                  onChange={onChangeToggle}
                  name="passwordToggle"
                  checked={isPassword}
                />
              </div>
              <input
                id="password"
                type="text"
                placeholder="비밀번호를 입력하세요"
                className="input input-bordered w-full"
                name="password"
                onChange={onChange}
                value={inputs.password}
                disabled={!isPassword}
              />
            </label>
          </div>
          <div className="modal-action flex">
            <button type="button" className="btn" onClick={handleModalClose}>
              취소
            </button>
            <button type="submit" className="btn btn-neutral" onClick={onClick}>
              방 만들기
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default GroupMakeModal;
