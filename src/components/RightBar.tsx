import { useState } from 'react';
import ChatData from '@/components/Chat/ChatData';
import ChatContainer from '@/components/Chat/ChatContainer';
import TodoList from '@/components/Todo/TodoList';

const RightBar = () => {
  const [selectedOption, setSelectedOption] = useState('TODO');
  const [datas, setDatas] = useState<ChatData[]>([]);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="rightbar">
      <div className="tabs">
        <button
          type="button"
          onClick={() => handleOptionChange('TODO')}
          className={`tab tab-lg tab-lifted ${
            selectedOption === 'TODO' ? 'tab-active' : ''
          } ${
            selectedOption === 'TODO'
              ? 'bg-white'
              : 'bg-neutral text-neutral-content'
          }`}
        >
          TO DO
        </button>
        <button
          type="button"
          onClick={() => handleOptionChange('CHAT')}
          className={`tab tab-lg tab-lifted ${
            selectedOption === 'CHAT' ? 'tab-active' : ''
          } ${
            selectedOption === 'CHAT'
              ? 'bg-white'
              : 'bg-neutral text-neutral-content'
          }`}
        >
          Chat
        </button>
        {selectedOption === 'TODO' && <TodoList />}
        {selectedOption === 'CHAT' && (
          <ChatContainer datas={datas} setDatas={setDatas} />
        )}
      </div>
    </div>
  );
};

export default RightBar;
