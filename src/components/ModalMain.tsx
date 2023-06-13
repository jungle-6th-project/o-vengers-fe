import { useState } from 'react';
import { plusIcon } from '../utils/icons';

declare global {
  interface Window {
    my_modal_1: HTMLDialogElement;
  }
}

function ModalMain() {
  const [inputs, setInputs] = useState({
    groupName: '',
    password: '',
  });
  const [isPassword, setIsPassword] = useState(true);

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value, name } = e.currentTarget;
    setInputs({
      ...inputs, // 기존의 input 객체를 복사한 뒤
      [name]: value, // name 키를 가진 값을 value 로 설정
    });
  };

  const onChangeToggle = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    if (value === 'on') {
      e.currentTarget.value = 'off';
    } else if (value === 'off') {
      e.currentTarget.value = 'on';
    }
    setIsPassword(prev => !prev);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-square"
        onClick={() => window.my_modal_1.showModal()}
      >
        {plusIcon}
      </button>
      <dialog id="my_modal_1" className="modal">
        <form action="..." method="POST" className="modal-box">
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
              />
            </label>
          </div>
          <div className="form-control w-ful ">
            <label className="label flex-col items-stretch" htmlFor="password">
              <div className="flex justify-between items-center">
                <span className="label-text text-lg mb-2">비밀번호 설정</span>
                <input
                  type="checkbox"
                  className="toggle"
                  onChange={onChangeToggle}
                  name="passwordToggle"
                />
              </div>
              <input
                id="password"
                type="text"
                placeholder="비밀번호를 입력하세요"
                className="input input-bordered w-full "
                name="groupPassword"
                onChange={onChange}
                checked={isPassword}
              />
            </label>
          </div>
          <div className="modal-action flex">
            <button
              type="button"
              className="btn"
              onClick={() => window.my_modal_1.close()}
            >
              취소
            </button>
            <button type="submit" className="btn btn-neutral">
              방 만들기
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default ModalMain;
