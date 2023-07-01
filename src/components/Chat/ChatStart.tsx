interface ChatStartProps {
  src: string;
  name: string;
  time: string;
  message: string;
}

const ChatStart = ({ src, name, time, message }: ChatStartProps) => {
  return (
    <div className="chat chat-start">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="" src={src} />
        </div>
      </div>
      <div className="chat-header">{name}</div>
      <div className="flex items-end">
        <div className="chat-bubble">{message}</div>
        <time className="ml-1 text-xs opacity-50">{time}</time>
      </div>
    </div>
  );
};

export default ChatStart;
