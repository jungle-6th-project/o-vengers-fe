import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getGroupNameByPath, pathJoinGroup } from '@/utils/api';
import { useSelectedGroupIdActions } from '@/store/groupStore';

interface GroupJoinModalProps {
  joinPath: string;
}

const GroupJoinModal = ({ joinPath }: GroupJoinModalProps) => {
  const joinModalRef = useRef<HTMLDialogElement>(null);
  const [isAlreadyJoined, setAlreadyJoined] = useState(false);
  const [isNotValidPath, setIsNotValidPath] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data } = useQuery(
    ['groupName'],
    async () => {
      try {
        const groupData = await getGroupNameByPath(joinPath);
        return groupData;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
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
    },
    {
      refetchOnWindowFocus: false,
      retryDelay: Infinity,
    }
  );

  const { setGroupId } = useSelectedGroupIdActions();

  const postPathJoinGroupMutation = useMutation(() => pathJoinGroup(joinPath), {
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
  });

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
    postPathJoinGroupMutation.mutate();
    joinModalRef.current?.close();
    navigate('/');
  };

  let message = '초대 링크를 확인하고 있습니다...';
  if (isAlreadyJoined) {
    message = '이미 가입된 그룹입니다.';
  } else if (isNotValidPath) {
    message = '유효하지 않은 초대 링크입니다.';
  } else if (data) {
    message = `${data.groupName} 그룹에 초대되었습니다!`;
  }

  return (
    <dialog ref={joinModalRef} id="groupJoinModal" className="modal">
      <form method="dialog" className="modal-box">
        <div>
          <p>{message}</p>
          <div className="modal-action m-0">
            <button type="button" className="btn" onClick={handleModalClose}>
              {data ? '취소' : '닫기'}
            </button>
            {data && (
              <button
                type="button"
                className="btn"
                onClick={handleAcceptInvite}
              >
                초대 수락
              </button>
            )}
          </div>
        </div>
      </form>
    </dialog>
  );
};

export default GroupJoinModal;
