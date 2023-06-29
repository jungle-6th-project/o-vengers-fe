import { useState } from 'react';
import ChatData from '@/components/Chat/ChatData';
import ChatContainer from '@/components/Chat/ChatContainer';
import VideoTodoList from './Todo/VideoTodoList';

const RightBar = () => {
  const [selectedOption, setSelectedOption] = useState('TODO');
  const [datas, setDatas] = useState<ChatData[]>([]);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="w-full h-full rightbar">
      <div className="grid w-full h-full grid-rows-rightbar">
        <div className="tabs">
          <button
            type="button"
            onClick={() => handleOptionChange('TODO')}
            className={`tab tab-lg tab-lifted ${
              selectedOption === 'TODO' ? 'tab-active' : ''
            } ${
              selectedOption === 'TODO'
                ? 'bg-[#FAFAFA]'
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
                ? 'bg-[#FAFAFA]'
                : 'bg-neutral text-neutral-content'
            }`}
          >
            Chat
          </button>
        </div>
        <div>
          {selectedOption === 'TODO' && <VideoTodoList />}
          {selectedOption === 'CHAT' && (
            <ChatContainer datas={datas} setDatas={setDatas} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
