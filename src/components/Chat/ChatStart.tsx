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
          <img alt={name} src={src} />
        </div>
      </div>
      <div className="chat-header">
        {name}
        <time className="ml-2 text-xs opacity-50">{time}</time>
      </div>
      <div className="break-words chat-bubble" style={{ width: 'fit-content' }}>
        {message}
      </div>
    </div>
  );
};

export default ChatStart;
