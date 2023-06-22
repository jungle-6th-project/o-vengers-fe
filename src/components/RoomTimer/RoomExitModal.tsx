import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaveVideoRoom } from '@/utils/api';

declare global {
  interface Window {
    roomExitModal: HTMLDialogElement;
  }
}

const ExitModal = ({
  roomId,
  expired,
}: {
  roomId: number;
  expired: boolean;
}) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDialogElement>(null);
  const [modalReady, setModalReady] = useState(false);

  const handleOnLeave = useCallback(async () => {
    navigate('/');
    await leaveVideoRoom(roomId);
  }, [navigate, roomId]);

  useEffect(() => {
    if (modalRef.current) {
      window.roomExitModal = modalRef.current;
      setModalReady(true);
    }
  }, []);

  useEffect(() => {
    if (modalReady && expired) {
      if (window.roomExitModal.open) {
        window.roomExitModal.close();
      }
      window.roomExitModal.showModal();

      const handleESCDown = async (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          handleOnLeave();
        }
      };

      window.addEventListener('keydown', handleESCDown);

      return () => {
        // Clean up the event listener
        window.removeEventListener('keydown', handleESCDown);
      };
    }

    return () => {};
  }, [modalReady, expired, handleOnLeave]);

  return (
    <dialog ref={modalRef} id="roomExitModal" className="modal">
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
