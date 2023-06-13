import React from 'react';
import UserData from './UserData';
import ChatData from './ChatData';
import ChatEnd from './ChatEnd';
import ChatStart from './ChatStart';

interface ChatListProps {
  datas: ChatData[];
  user: UserData;
}

const ChatList: React.FC<ChatListProps> = ({ datas, user }) => {
  return (
    <div>
      {datas.map(data =>
        data.userData.name === user.name ? (
          <ChatEnd
            key={data.id}
            src={user.profile}
            name={user.name}
            time={data.id.slice(0, 8)}
            message={data.content}
          />
        ) : (
          <ChatStart
            key={data.id}
            src={data.userData.profile}
            name={data.userData.name}
            time={data.id.slice(0, 8)}
            message={data.content}
          />
        )
      )}
    </div>
  );
};

export default ChatList;
