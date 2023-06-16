import React, { useState } from 'react';
import Options from './Options';
import TodoList from '../Todo/TodoList';
import ChatContainer from '../Chat/ChatContainer';
import ChatData from '../Chat/ChatData';

const RightBar: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState('TODO');
  const [datas, setDatas] = useState<ChatData[]>([]); // Chat 컴포넌트에서 상태를 정의하고 ChatContainer로 전달합니다.

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <Options
        selectedOption={selectedOption}
        handleOptionChange={handleOptionChange}
      />
      {selectedOption === 'TODO' && <TodoList />}
      {selectedOption === 'CHAT' && (
        <ChatContainer datas={datas} setDatas={setDatas} />
      )}{' '}
      {/* ChatContainer에 datas와 setDatas를 전달합니다. */}
    </>
  );
};

export default RightBar;
