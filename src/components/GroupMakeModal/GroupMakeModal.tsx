import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCopyToClipboard } from 'usehooks-ts';
import { AiOutlineCopy, AiOutlineCheck, AiOutlinePlus } from 'react-icons/ai';
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
  const [groupURL, copy] = useCopyToClipboard();
  const queryClient = useQueryClient();

  const { setGroupId } = useSelectedGroupIdActions();

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
          setGroupId(res.groupId);
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

  const handleModalCloseCancel = () => {
    window.groupMakeModal.close();
    setInputs(initialInputs);
    setIsPassword(false);
    setRandomRoomId('');
    copy('');
    setShowCreateForm(true);
  };

  const handleModalClose = () => {
    window.groupMakeModal.close();
    setInputs(initialInputs);
    setIsPassword(false);
    setRandomRoomId('');
    copy('');
    setShowCreateForm(true);
    postMakeGroupMutation.mutate({
      groupName: inputs.groupName,
      password: inputs.password,
      path: randomRoomId,
      secret: isPassword,
    });
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

    setShowCreateForm(prevState => !prevState);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-square"
        onClick={handleModalOpen}
      >
        <AiOutlinePlus size={24} />
      </button>
      <dialog id="groupMakeModal" className="modal">
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
                  {isPassword && inputs.password === '' && (
                    <p className="text-red-500">
                      비밀번호는 한자리 이상이여야 합니다
                    </p>
                  )}
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
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
              <button
                type="button"
                className="btn"
                onClick={handleModalCloseCancel}
              >
                취소
              </button>
              <button
                type="button"
                className="btn btn-neutral"
                onClick={onClickMakeGroup}
                disabled={isPassword && inputs.password.length < 1}
              >
                그룹 만들기
              </button>
            </div>
          </form>
        ) : (
          <div className="modal-box">
            <div className="mx-5 my-3 text-lg">
              함께하고 싶은 사람들에게 <strong>링크</strong>를 보내보세요!
              <br />
              바로 참여할 수 있습니다.
            </div>
            <div className="form-control">
              <div className="mx-5 join">
                <input
                  className="w-full bg-gray-200 input join-item"
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
                  className="btn btn-primary join-item"
                  onClick={() =>
                    copy(
                      import.meta.env.MODE === 'development'
                        ? `http://localhost:5173/invite/${randomRoomId}`
                        : `https://bbodogstudy.com/invite/${randomRoomId}`
                    )
                  }
                >
                  {groupURL ? (
                    <AiOutlineCheck size={20} />
                  ) : (
                    <AiOutlineCopy size={20} />
                  )}
                </button>
              </div>
            </div>
            <div className="text-gray-500 ml-9">
              링크는 그룹 카드에서 언제든 다시 볼 수 있어요.
            </div>
            <div className="m-0 modal-action">
              <button
                type="button"
                className="m-3 btn"
                onClick={handleModalClose}
              >
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
