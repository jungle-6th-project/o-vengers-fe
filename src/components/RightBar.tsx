import React, { useState } from 'react';
import ChatData from './Chat/ChatData';
import TodoList from './Todo/TodoList';
import ChatContainer from './Chat/ChatContainer';

const RightBar = () => {
  const [selectedOption, setSelectedOption] = useState('TODO');
  const [datas, setDatas] = useState<ChatData[]>([]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="rightbar">
      <div className="join">
        <input
          className="join-item btn"
          type="radio"
          name="options"
          value="TODO"
          aria-label="TODO"
          checked={selectedOption === 'TODO'}
          onChange={handleOptionChange}
        />
        <input
          className="join-item btn "
          type="radio"
          name="options"
          value="CHAT"
          aria-label="CHAT"
          checked={selectedOption === 'CHAT'}
          onChange={handleOptionChange}
        />
      </div>

      {selectedOption === 'TODO' && <TodoList />}
      {selectedOption === 'CHAT' && (
        <ChatContainer datas={datas} setDatas={setDatas} />
      )}
    </div>
  );
};

export default RightBar;
