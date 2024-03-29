import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useUser, useVideoNickname } from '@/store/userStore';
import { ChatData } from './ChatData';
import ChatForm from './ChatForm';
import ChatList from './ChatList';

dayjs.locale('ko');
interface ChatContainerProps {
  datas: ChatData[];
  setDatas: React.Dispatch<React.SetStateAction<ChatData[]>>;
}

const ChatContainer = ({ datas, setDatas }: ChatContainerProps) => {
  const [chat, setChat] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const { roomId } = useParams();
  const user = useUser();
  const videoNickname = useVideoNickname();
  const currentTime = dayjs().format('A hh:mm');

  useEffect(() => {
    const url =
      import.meta.env.MODE === 'development'
        ? 'localhost:5173'
        : 'wss://www.sangyeop.shop';

    const newSocket = io(url);
    setSocket(newSocket);
    newSocket.connect();

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socket) return; // 소켓이 초기화되지 않았을 경우 처리합니다.
    socket.emit('enter-room', roomId);

    socket.on('showMessage', (chatData: ChatData) => {
      const newChatData: ChatData = {
        userData: chatData.userData,
        videoNickname: chatData.videoNickname,
        content: chatData.content,
        time: chatData.time,
        id: chatData.id,
      };

      setDatas(prevDatas => [...prevDatas, newChatData]);
    });
    // eslint-disable-next-line consistent-return
    return () => {
      socket.off('showMessage');
    };
  }, [setDatas, socket, roomId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (socket && chat.trim() !== '') {
      const newChatData: ChatData = {
        userData: {
          name: user.name,
          profile: user.profile,
        },
        videoNickname,
        content: chat,
        time: currentTime,
        id: crypto.randomUUID(),
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
    <div className="rounded-b-lg border border-[#D9D9D9] min-w-leftbar max-w-leftbar h-full w-full bg-[#FAFAFA] border-t-0 relative overflow-scroll grid grid-rows-chat gap-3">
      <div className="h-full">
        <ChatList datas={datas} user={user} />
      </div>
      <div>
        <ChatForm onSubmit={handleSubmit} onChange={onChange} chat={chat} />
      </div>
    </div>
  );
};

export default ChatContainer;
