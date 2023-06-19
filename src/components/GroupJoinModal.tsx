import { isValidElement, useEffect, useRef, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
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

  const { data } = useQuery(['groupName'], async () => {
    try {
      const groupData = await getGroupNameByPath({
        accessToken,
        path: joinPath,
      });
      return groupData;
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
    navigate('/');
  };

  const handleAcceptInvite = () => {
    postPathJoinGroupMutation.mutate({ accessToken, path: joinPath });
    joinModalRef.current?.close();
    navigate('/');
    window.location.reload();
  };

  return (
    <dialog ref={joinModalRef} id="groupJoinModal" className="modal">
      <form method="dialog" className="w-11/12 max-w-5xl modal-box">
        {isAlreadyJoined && (
          <div>
            <p className="py-4">이미 가입된 그룹입니다!</p>
            <div className="modal-action">
              <button type="button" className="btn" onClick={handleModalClose}>
                닫기
              </button>
            </div>
          </div>
        )}
        {isNotValidPath && (
          <div>
            <p className="py-4">유효하지 않은 초대코드 입니다.</p>
            <div className="modal-action">
              <button type="button" className="btn" onClick={handleModalClose}>
                닫기
              </button>
            </div>
          </div>
        )}
        {!isAlreadyJoined && !isNotValidPath && (
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
              >
                초대수락
              </button>
            </div>
          </div>
        )}
      </form>
    </dialog>
  );
};

export default GroupJoinModal;
