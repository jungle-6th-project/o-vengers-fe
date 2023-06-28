import { useSelectedGroupIdActions } from '@/store/groupStore';

const RoomEnterMessage = ({
  onTimerIdle,
  onRoomIdle,
  groupId,
}: {
  onTimerIdle: boolean;
  onRoomIdle: boolean;
  groupId: number;
}) => {
  const { getGroupNameById } = useSelectedGroupIdActions();
  if (!onRoomIdle) {
    return (
      <div>
        {groupId !== 0 && (
          <div className="text-lg text-center text-white text-ellipsis">{`${getGroupNameById(
            groupId
          )}`}</div>
        )}
      </div>
    );
  }

  let text = '공부방 입장까지 남은 시간';

  if (onTimerIdle) {
    text = '100시간 이내에 예약한 공부방이 없어요';
  }

  return <div className="text-lg text-white">{text}</div>;
};

export default RoomEnterMessage;
