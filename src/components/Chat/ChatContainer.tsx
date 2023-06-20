import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { useUser } from '@/store/userStore';
import ChatData from './ChatData';
import ChatForm from './ChatForm';
import ChatList from './ChatList';

const ChatContainer: React.FC<{
  datas: ChatData[];
  setDatas: React.Dispatch<React.SetStateAction<ChatData[]>>;
}> = ({ datas, setDatas }) => {
  const [chat, setChat] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const { roomID } = useParams();
  const user = useUser();

  useEffect(() => {
    const newSocket = io('localhost:5173/study');
    setSocket(newSocket);

    newSocket.emit('enter-room', roomID);

    return () => {
      newSocket.disconnect();
    };
  }, [roomID, user]);

  useEffect(() => {
    if (!socket) return; // 소켓이 초기화되지 않았을 경우 처리합니다.

    socket.on('showMessage', (chatData: ChatData) => {
      const newChatData: ChatData = {
        userData: chatData.userData,
        content: chatData.content,
        id: chatData.id,
      };

      setDatas(prevDatas => [...prevDatas, newChatData]);
    });
    // eslint-disable-next-line consistent-return
    return () => {
      socket.off('showMessage');
    };
  }, [setDatas, socket]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (socket && chat.trim() !== '') {
      const newChatData: ChatData = {
        userData: {
          name: user.name,
          profile: user.profile,
        },
        content: chat,
        id: new Date().toLocaleTimeString(),
      };
      socket.emit('sentMessage', newChatData);
      setChat('');
      setDatas(prevDatas => [...prevDatas, newChatData]);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChat(event.target.value);
  };

  return (
    <>
      <ChatList datas={datas} user={user} />
      <ChatForm onSubmit={handleSubmit} onChange={onChange} chat={chat} />
    </>
  );
};

export default ChatContainer;
