import { useEffect, useRef, useState } from 'react';
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
  const [isAlreadyJoined, setAlreadyJoined] = useState(false);
  const [isNotValidPath, setIsNotValidPath] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery(['groupName'], async () => {
    try {
      const groupData = await getGroupNameByPath({
        accessToken,
        path: joinPath,
      });
      return groupData;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      if (
        error.response.data.message ===
        `유효하지 않은 초대 코드입니다. : ${joinPath}`
      ) {
        setIsNotValidPath(true);
      }
      if (error.response.data.message === '이미 가입한 그룹입니다.') {
        setAlreadyJoined(true);
      }
      throw error;
    }
  });

  const postPathJoinGroupMutation = useMutation(
    (values: { accessToken: string; path: string }) => pathJoinGroup(values)
  );

  useEffect(() => {
    if (joinModalRef.current) {
      joinModalRef.current.open = true;
    }
  }, []);

  const handleModalClose = () => {
    joinModalRef.current?.close();
    setTimeout(() => {
      navigate('/');
    }, 200);
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

    if (isNotValidPath) {
      return (
        <div>
          <p className="py-4">유효하지 않은 초대코드 입니다.</p>
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
        {!isLoading && renderContent()}
      </form>
    </dialog>
  );
};

export default GroupJoinModal;
