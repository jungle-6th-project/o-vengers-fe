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
    } w-[14.125rem] h-[2.8125rem] text-2xl rounded-xl`}
    disabled={onIdle}
    onClick={handleEnterRoom}
  >
    방 입장하기
  </button>
);

export default EntryButton;
