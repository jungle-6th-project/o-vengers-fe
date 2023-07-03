import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCopyToClipboard } from 'usehooks-ts';
import { AiOutlineCopy } from '@react-icons/all-files/ai/AiOutlineCopy';
import { AiOutlineCheck } from '@react-icons/all-files/ai/AiOutlineCheck';
import { AiOutlinePlus } from '@react-icons/all-files/ai/AiOutlinePlus';
import { makeGroup } from '@/utils/api';
import { useSelectedGroupIdActions } from '@/store/groupStore';

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

  const [inputs, setInputs] = useState(initialInputs);
  const [isPassword, setIsPassword] = useState(false);
  const [randomRoomId, setRandomRoomId] = useState('');
  const [, copy] = useCopyToClipboard();
  const queryClient = useQueryClient();

  const { setSelectedGroupId } = useSelectedGroupIdActions();

  const postMakeGroupMutation = useMutation(
    (values: {
      groupName: string;
      password: string;
      path: string;
      secret: boolean;
    }) => makeGroup(values),
    {
      onSuccess: (res: {
        color: string;
        groupId: number;
        groupName: string;
        path: string;
        secret: boolean;
      }) => {
        if (res !== null) {
          setSelectedGroupId(res.groupId);
        }
        queryClient.invalidateQueries(['MyGroupData']);
      },
    }
  );

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value, name } = e.currentTarget;
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value,
    }));
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
    setRandomRoomId('');
    copy('');
    setShowCreateForm(true);
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

  const onClickMakeGroup = () => {
    const randomString = generateRandomString();
    setRandomRoomId(randomString);
    setShowCreateForm(false);

    postMakeGroupMutation.mutate({
      groupName: inputs.groupName,
      password: inputs.password,
      path: randomString,
      secret: isPassword,
    });
  };

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 4000);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-square bg-[#E7E7E7] text-[#5A5A5A] hover:bg-[#C7C7C7]"
        onClick={handleModalOpen}
      >
        <AiOutlinePlus size={24} />
      </button>
      <dialog id="groupMakeModal" className="modal">
        {showCreateForm ? (
          <form className="modal-box" onSubmit={e => e.preventDefault()}>
            <h1 className="text-3xl font-semibold">그룹 생성</h1>
            <p className="py-4 text-lg">새로운 그룹을 만들 수 있습니다.</p>
            <div className="w-full mb-5 form-control">
              <label
                className="flex-col items-stretch pb-0 label"
                htmlFor="groupName"
              >
                <div className="flex items-center justify-between">
                  <span className="mb-2 text-lg label-text">그룹 이름</span>
                  {inputs.groupName.length > 0 &&
                    inputs.groupName.trim().length < 1 && (
                      <p className="text-red-500">
                        유효한 글자가 하나라도 있어야 합니다
                      </p>
                    )}
                </div>
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
                  {isPassword && inputs.password === '' && (
                    <p className="text-red-500">
                      비밀번호는 한 글자 이상이어야 합니다
                    </p>
                  )}
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
                onClick={onClickMakeGroup}
                disabled={
                  (isPassword && inputs.password.length < 1) ||
                  inputs.groupName.trim().length < 1
                }
              >
                그룹 만들기
              </button>
            </div>
          </form>
        ) : (
          <div className="modal-box">
            <h1 className="text-3xl font-semibold">그룹 초대</h1>
            <p className="py-4 text-lg">
              축하합니다! 새 그룹이 만들어졌습니다.
            </p>
            <p className="text-lg">
              함께하고 싶은 사람들에게 <strong>초대 링크</strong>를 보내보세요.
              <br />
              바로 참여할 수 있습니다.
            </p>
            <div className="px-0 my-3 form-control">
              <div className="join">
                <input
                  className="w-full h-10 bg-gray-100 input join-item"
                  type="text"
                  value={
                    import.meta.env.MODE === 'development'
                      ? `http://localhost:5173/invite/${randomRoomId}`
                      : `https://bbodogstudy.com/invite/${randomRoomId}`
                  }
                  readOnly
                />
                <button
                  type="button"
                  className="w-10 h-10 min-h-0 p-0 btn btn-neutral join-item"
                  onClick={() => {
                    copy(
                      import.meta.env.MODE === 'development'
                        ? `http://localhost:5173/invite/${randomRoomId}`
                        : `https://bbodogstudy.com/invite/${randomRoomId}`
                    );
                    handleCopy();
                  }}
                >
                  {isCopied ? (
                    <AiOutlineCheck size={20} />
                  ) : (
                    <AiOutlineCopy size={20} />
                  )}
                </button>
              </div>
              <div className="py-0 label">
                <span className="text-sm label-text-alt">
                  초대 링크는 그룹 카드에서 언제든 다시 복사할 수 있어요.
                </span>
              </div>
            </div>
            <div className="mt-2 modal-action">
              <button type="button" className="btn" onClick={handleModalClose}>
                닫기
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
};

export default GroupMakeModal;
