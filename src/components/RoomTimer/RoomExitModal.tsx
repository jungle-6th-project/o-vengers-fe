import { useNavigate } from 'react-router-dom';
import { leaveVideoRoom } from '@/utils/api';

declare global {
  interface Window {
    roomExitModal: HTMLDialogElement;
  }
}

const ExitModal = ({ roomId }: { roomId: number }) => {
  const navigate = useNavigate();

  if (window.roomExitModal.open) {
    window.roomExitModal.close();
  }
  window.roomExitModal.showModal();

  const handleOnLeave = async () => {
    navigate('/');
    await leaveVideoRoom(roomId);
  };

  return (
    <dialog id="roomExitModal" className="modal">
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">수고하셨습니다!</h3>
        <div className="modal-action">
          <button type="button" className="btn" onClick={handleOnLeave}>
            캘린더로 돌아가기
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default ExitModal;
