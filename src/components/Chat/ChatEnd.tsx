interface ChatStartProps {
  src: string;
  name: string;
  time: string;
  message: string;
}

const ChatEnd = ({ src, name, time, message }: ChatStartProps) => {
  return (
    <div className="chat chat-end">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="" src={src} />
        </div>
      </div>
      <div className="chat-header">{name}</div>

      <div className="flex flex-row-reverse items-end">
        <div className="chat-bubble">{message}</div>
        <time className="mr-1 text-xs opacity-50">{time}</time>
      </div>
    </div>
  );
};

export default ChatEnd;
