import React from 'react';

interface ChatFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  chat: string;
}

const ChatForm: React.FC<ChatFormProps> = ({ onSubmit, onChange, chat }) => {
  return (
    <form onSubmit={onSubmit} className="join">
      <div>
        <input
          type="text"
          className="input join-item"
          placeholder="채팅을 입력하세요."
          onChange={onChange}
          value={chat}
        />
      </div>
      <div className="indicator">
        <button type="submit" className="btn join-item">
          보내기
        </button>
      </div>
    </form>
  );
};

export default ChatForm;
