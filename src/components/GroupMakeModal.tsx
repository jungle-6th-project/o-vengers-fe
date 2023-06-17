import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useCopyToClipboard } from 'usehooks-ts';
import { useCookies } from 'react-cookie';
import { AiOutlineCopy, AiOutlineCheck } from 'react-icons/ai';
import { plusIcon } from '../utils/icons';
import { makeGroup } from '../utils/api';

declare global {
  interface Window {
    groupMakeModal: HTMLDialogElement;
  }
}

const GroupMakeModal = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const initialInputs = {
    groupName: '',
    password: '',
  };
  const [{ accessToken }] = useCookies(['accessToken']);

  const [inputs, setInputs] = useState(initialInputs);
  const [isPassword, setIsPassword] = useState(false);
  const [randomRoomId, setRandomRoomId] = useState('');
  const [groupURL, copy] = useCopyToClipboard();

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
    setShowCreateForm(true);
    window.groupMakeModal.showModal();
  };

  const handleModalClose = () => {
    window.groupMakeModal.close();
    setInputs(initialInputs);
    setIsPassword(false);
    setShowCreateForm(false);
    setRandomRoomId('');
    copy('');
  };

  const generateRandomString = () => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < 10; i += 1) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  };

  const onClick = () => {
    const randomString = generateRandomString();
    setRandomRoomId(randomString);
    console.log(randomString);

    if (showCreateForm) {
      postMakeGroupMutation.mutate({
        accessToken,
        groupName: inputs.groupName,
        password: inputs.password,
        path: randomString,
        secret: isPassword,
      });
      setShowCreateForm(false);
    } else {
      setShowCreateForm(prevState => !prevState);
    }
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
        {showCreateForm ? (
          <form className="modal-box" onSubmit={e => e.preventDefault()}>
            <div className="w-full mb-5 form-control">
              <label className="flex-col items-start label" htmlFor="groupName">
                <span className="mb-2 text-lg label-text">그룹 이름</span>
                <input
                  id="groupName"
                  type="text"
                  placeholder="그룹 이름을 입력하세요"
                  className="w-full input input-bordered"
                  name="groupName"
                  onChange={onChange}
                  value={inputs.groupName}
                />
              </label>
            </div>
            <div className="w-full form-control">
              <label
                className="flex-col items-stretch label"
                htmlFor="password"
              >
                <div className="flex items-center justify-between">
                  <span className="mb-2 text-lg label-text">비밀번호 설정</span>
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
                  className="w-full input input-bordered"
                  name="password"
                  onChange={onChange}
                  value={inputs.password}
                  disabled={!isPassword}
                />
              </label>
            </div>
            <div className="flex modal-action">
              <button type="button" className="btn" onClick={handleModalClose}>
                취소
              </button>
              <button
                type="button"
                className="btn btn-neutral"
                onClick={onClick}
              >
                방 만들기
              </button>
            </div>
          </form>
        ) : (
          <div className="modal-box">
            <div className="m-5 text-lg">
              함께하고 싶은 사람들에게 <strong>링크</strong>를 보내보세요!
            </div>
            <div className="m-5 text-lg">바로 참여할 수 있습니다.</div>
            <div className="form-control">
              <div className="input-group">
                <span>
                  https://d23wakgp76ydiy.cloudfront.net/{randomRoomId}
                </span>
                <button
                  type="button"
                  className="link"
                  onClick={() =>
                    copy(
                      `https://d23wakgp76ydiy.cloudfront.net/${randomRoomId}`
                    )
                  }
                >
                  {groupURL ? <AiOutlineCheck /> : <AiOutlineCopy />}
                </button>
              </div>
            </div>
            <button
              type="button"
              className="m-3 btn"
              onClick={handleModalClose}
            >
              닫기
            </button>
          </div>
        )}
      </dialog>
    </>
  );
};

export default GroupMakeModal;
