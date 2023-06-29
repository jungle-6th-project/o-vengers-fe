import { useEffect, useRef } from 'react';
import UserData from './UserData';
import ChatData from './ChatData';
import ChatEnd from './ChatEnd';
import ChatStart from './ChatStart';

interface ChatListProps {
  datas: ChatData[];
  user: UserData;
}

const ChatList = ({ datas, user }: ChatListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [datas]);

  return (
    <div
      className="absolute w-full px-4 overflow-scroll"
      style={{ height: 'calc(100% - 60px - 0.75rem)' }}
    >
      {datas.map(data =>
        data.userData.name === user.name ? (
          <ChatEnd
            key={data.id}
            src={user.profile}
            name={user.name}
            time={data.time}
            message={data.content}
          />
        ) : (
          <ChatStart
            key={data.id}
            src={data.userData.profile}
            name={data.userData.name}
            time={data.time}
            message={data.content}
          />
        )
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatList;
