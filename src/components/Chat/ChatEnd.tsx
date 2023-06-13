interface ChatStartProps {
  src: string;
  name: string;
  time: string;
  message: string;
}

const ChatEnd: React.FC<ChatStartProps> = ({ src, name, time, message }) => {
  return (
    <div className="chat chat-end">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="" src={src} />
        </div>
      </div>
      <div className="chat-header">
        {name}
        <time className="text-xs opacity-50">{time}</time>
      </div>
      <div className="chat-bubble">{message}</div>
    </div>
  );
};

export default ChatEnd;
