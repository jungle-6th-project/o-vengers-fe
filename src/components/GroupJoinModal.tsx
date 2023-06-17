import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCookies } from 'react-cookie';
import { getGroupNameByPath, pathJoinGroup } from '../utils/api';

interface GroupJoinModalProps {
  joinPath: string;
}

const GroupJoinModal = ({ joinPath }: GroupJoinModalProps) => {
  const joinModalRef = useRef<HTMLDialogElement>(null);
  const [{ accessToken }] = useCookies(['accessToken']);
  const navigate = useNavigate();

  const { data: groupName } = useQuery(['getGroupName'], () =>
    getGroupNameByPath({ accessToken, path: joinPath })
  );

  const postPathJoinGroupMutation = useMutation(
    (values: { accessToken: string; path: string }) => pathJoinGroup(values)
  );

  const handleModalClose = () => {
    joinModalRef.current?.close();
    postPathJoinGroupMutation.mutate({
      accessToken,
      path: joinPath,
    });
  };

  useEffect(() => {
    joinModalRef.current?.showModal();
  }, []);

  return (
    <dialog ref={joinModalRef} id="groupJoinModal" className="modal">
      <form method="dialog" className="w-11/12 max-w-5xl modal-box">
        <h3 className="text-lg font-bold">그룹 참여 요청</h3>
        <p className="py-4">{groupName} 그룹에 초대되었습니다!</p>
        <div className="modal-action">
          <button
            type="button"
            className="btn"
            onClick={() => joinModalRef.current?.close()}
          >
            취소
          </button>
          <button type="button" className="btn" onClick={handleModalClose}>
            초대 수락
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default GroupJoinModal;
