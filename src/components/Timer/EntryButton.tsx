const EntryButton = ({
  onIdle,
  handleEnterRoom,
}: {
  onIdle: boolean;
  handleEnterRoom: () => void;
}) => (
  <button
    type="button"
    className={`btn btn-outline ${
      onIdle ? '' : 'btn-accent'
    } w-[14.125rem] h-[2.8125rem] text-2xl rounded-xl disabled:btn-ghost disabled:outline`}
    disabled={onIdle}
    onClick={handleEnterRoom}
  >
    {onIdle ? '입장 대기중' : '방 입장하기'}
  </button>
);

export default EntryButton;
