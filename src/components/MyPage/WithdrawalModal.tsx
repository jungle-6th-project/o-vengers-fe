import { useNavigate } from 'react-router-dom';
import { FaRegSadTear } from '@react-icons/all-files/fa/FaRegSadTear';
import { useUser } from '@/store/userStore';
import { withdraw } from '@/utils/api';

declare global {
  interface Window {
    withdrawal_modal: HTMLDialogElement;
  }
}

const WithdrawalModal = () => {
  const user = useUser();
  const navigate = useNavigate();

  const withdrawUser = async () => {
    await withdraw();
    navigate('/login');
  };

  return (
    <>
      <button
        type="button"
        className="items-center font-medium text-[0.9rem] w-[5rem] h-[1.8rem] min-h-[1.8rem] px-0 rounded-md btn btn-outline btn-error ml-1"
        onClick={() => {
          window.withdrawal_modal.showModal();
        }}
      >
        회원탈퇴
      </button>
      <dialog id="withdrawal_modal" className="modal">
        <form method="dialog" className="modal-box">
          <div className="flex items-center">
            <FaRegSadTear size={30} style={{ color: '#F87272' }} />
            <h3 className="ml-3 text-3xl font-semibold">회원 탈퇴</h3>
          </div>
          <p className="py-4 text-lg">
            {user.name}님, 정말로 떠나시겠어요?
            <br />
            가기 전에 그룹 친구들에게 인사라도 하고 가시는 건 어떨까요?
          </p>
          <div className="mt-5 modal-action">
            <button
              type="button"
              className="btn"
              onClick={() => {
                window.withdrawal_modal.close();
              }}
            >
              취소
            </button>
            <button
              type="button"
              className="text-white btn btn-error"
              onClick={withdrawUser}
            >
              탈퇴하기
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default WithdrawalModal;
