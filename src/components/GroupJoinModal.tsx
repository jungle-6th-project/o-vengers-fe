import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getGroupNameByPath, pathJoinGroup } from '@/utils/api';
import { useSelectedGroupIdActions } from '@/store/groupStore';

interface GroupJoinModalProps {
  joinPath: string;
}

const GroupJoinModal = ({ joinPath }: GroupJoinModalProps) => {
  const joinModalRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const [isAlreadyJoined, setAlreadyJoined] = useState(false);
  const [isNotValidPath, setIsNotValidPath] = useState(false);
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

  const { setSelectedGroupId } = useSelectedGroupIdActions();

  const postPathJoinGroupMutation = useMutation(() => pathJoinGroup(joinPath), {
    onSuccess: (res: {
      color: string;
      groupId: number;
      groupName: string;
      path: string;
      secret: boolean;
    }) => {
      if (res !== null) {
        setSelectedGroupId(res.groupId);
      }
      queryClient.invalidateQueries(['MyGroupData']);
    },
  });

  useEffect(() => {
    if (joinModalRef.current) {
      joinModalRef.current.open = true;
    }
    localStorage.setItem('joinPath', joinPath);
  }, [joinPath]);

  const handleModalClose = () => {
    localStorage.removeItem('joinPath');
    joinModalRef.current?.close();
    navigate('/');
  };

  const handleAcceptInvite = async () => {
    await postPathJoinGroupMutation.mutate();
    await localStorage.removeItem('joinPath');
    await joinModalRef.current?.close();
    await navigate('/');
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
        <h1 className="text-3xl font-semibold">그룹 초대</h1>
        <p className="py-4 text-lg">{message}</p>
        <div className="m-0 modal-action">
          <button type="button" className="btn" onClick={handleModalClose}>
            {data ? '취소' : '닫기'}
          </button>
          {data && (
            <button
              type="button"
              className="btn btn-neutral"
              onClick={handleAcceptInvite}
            >
              초대 수락
            </button>
          )}
        </div>
      </form>
    </dialog>
  );
};

export default GroupJoinModal;
