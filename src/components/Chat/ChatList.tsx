import { useEffect, useRef } from 'react';
import { ChatData, UserData } from './ChatData';
import ChatEnd from './ChatEnd';
import ChatStart from './ChatStart';
import { useVideoNickname } from '@/store/userStore';

interface ChatListProps {
  datas: ChatData[];
  user: UserData;
}

const ChatList = ({ datas, user }: ChatListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoNickname = useVideoNickname();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [datas]);

  return (
    <div
      className="absolute w-full px-3 overflow-scroll"
      style={{ height: 'calc(100% - 60px - 0.75rem)' }}
    >
      {datas.map(data =>
        data.userData.name === user.name ? (
          <ChatEnd
            name={videoNickname}
            key={data.id}
            src={user.profile}
            time={data.time}
            message={data.content}
          />
        ) : (
          <ChatStart
            key={data.id}
            src={data.userData.profile}
            name={data.videoNickname}
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
