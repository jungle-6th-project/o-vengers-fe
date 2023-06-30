import './entryButton.css';

const EntryButton = ({
  onIdle,
  isNear,
  handleEnterRoom,
}: {
  onIdle: boolean;
  isNear: boolean;
  handleEnterRoom: () => void;
}) => (
  <button
    type="button"
    className={`btn btn-outline ${
      onIdle ? '' : 'btn-accent'
    } w-[14.125rem] h-[2.8125rem] text-2xl rounded-xl disabled:btn-ghost disabled:border-white disabled:text-white disabled:opacity-70 ${
      isNear && 'ripple'
    }`}
    disabled={onIdle}
    onClick={handleEnterRoom}
  >
    {onIdle ? '입장 대기중' : '공부방 들어가기'}
  </button>
);

export default EntryButton;
