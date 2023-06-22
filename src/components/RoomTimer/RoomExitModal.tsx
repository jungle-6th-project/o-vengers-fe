import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaveVideoRoom } from '@/utils/api';

declare global {
  interface Window {
    roomExitModal: HTMLDialogElement;
  }
}

const ExitModal = ({ roomId }: { roomId: number }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnLeave = async () => {
      navigate('/');
      await leaveVideoRoom(roomId);
    };

    if (window.roomExitModal.open) {
      window.roomExitModal.close();
    }

    window.roomExitModal.showModal();
    handleOnLeave();
  }, [navigate, roomId]);

  return (
    <dialog id="roomExitModal" className="modal">
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">수고하셨습니다!</h3>
      </form>
    </dialog>
  );
};

export default ExitModal;
