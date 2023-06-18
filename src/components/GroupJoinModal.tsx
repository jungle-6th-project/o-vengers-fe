import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCookies } from 'react-cookie';
import { getGroupNameByPath, pathJoinGroup } from '../utils/api';

interface GroupJoinModalProps {
  joinPath: string;
}

interface ErrorResponse {
  response?: {
    status: number;
  };
}

const GroupJoinModal = ({ joinPath }: GroupJoinModalProps) => {
  const joinModalRef = useRef<HTMLDialogElement>(null);
  const [{ accessToken }] = useCookies(['accessToken']);
  const [isAlreadyJoined, setAlreadyJoined] = useState(false);
  const navigate = useNavigate();

  const { data } = useQuery(['getGroupName'], () =>
    getGroupNameByPath({ accessToken, path: joinPath })
  );

  const postPathJoinGroupMutation = useMutation(
    (values: { accessToken: string; path: string }) => pathJoinGroup(values),
    {
      onError: (error: ErrorResponse) => {
        if (error.response?.status === 400) {
          setAlreadyJoined(true);
        }
      },
    }
  );

  useEffect(() => {
    if (joinModalRef.current) {
      joinModalRef.current.open = true;
    }
  }, []);

  const handleModalClose = () => {
    joinModalRef.current?.close();
    navigate('/');
  };

  const handleAcceptInvite = () => {
    postPathJoinGroupMutation.mutate({ accessToken, path: joinPath });
  };

  const renderContent = () => {
    if (isAlreadyJoined) {
      return (
        <div>
          <p className="py-4">이미 가입된 그룹입니다!</p>
          <div className="modal-action">
            <button type="button" className="btn" onClick={handleModalClose}>
              닫기
            </button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <p className="py-4">{data?.groupName} 그룹에 초대되었습니다!</p>
        <div className="modal-action">
          <button type="button" className="btn" onClick={handleModalClose}>
            취소
          </button>
          <button
            type="button"
            className="btn"
            onClick={handleAcceptInvite}
            disabled={postPathJoinGroupMutation.isLoading}
          >
            {postPathJoinGroupMutation.isLoading ? '로딩 중...' : '초대 수락'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <dialog ref={joinModalRef} id="groupJoinModal" className="modal">
      <form method="dialog" className="w-11/12 max-w-5xl modal-box">
        <h3 className="text-lg font-bold">그룹 참여 요청</h3>
        {renderContent()}
      </form>
    </dialog>
  );
};

export default GroupJoinModal;
