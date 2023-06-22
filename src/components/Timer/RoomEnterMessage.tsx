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
        <span className="text-base text-white">지금 입장할 수 있어요</span>
        {groupId !== 0 && (
          <div className="text-lg text-white text-ellipsis text-center">{`${getGroupNameById(
            groupId
          )}`}</div>
        )}
      </div>
    );
  }

  let text = '방 입장까지 남은 시간';

  if (onTimerIdle) {
    text = '100시간 이내에 예약한 방이 없어요';
  }

  return <div className="text-base text-white">{text}</div>;
};

export default RoomEnterMessage;
