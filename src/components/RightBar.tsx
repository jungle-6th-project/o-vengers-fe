import { useState } from 'react';
import { ChatData } from '@/components/Chat/ChatData';
import ChatContainer from '@/components/Chat/ChatContainer';
import VideoTodoList from './Todo/VideoTodoList';

const RightBar = () => {
  const [selectedOption, setSelectedOption] = useState('TODO');
  const [datas, setDatas] = useState<ChatData[]>([]);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="h-rightbar max-h-rightbar min-w-leftbar max-w-rightbar rightbar">
      <div className="grid w-full h-rightbar max-h-rightbar min-w-leftbar max-w-rightbar grid-rows-rightbar">
        <div className="flex-grow w-full min-w-leftbar max-w-rightbar tabs flex-nowrap">
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
            style={{ width: '50%' }}
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
            style={{ width: '50%' }}
          >
            Chat
          </button>
        </div>
        <div className="overflow-auto">
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
