import React from 'react';

interface ChatFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  chat: string;
}

const ChatForm = ({ onSubmit, onChange, chat }: ChatFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="absolute bottom-0 w-full pb-3 pl-2 join min-w-leftbar max-w-leftbar"
    >
      <input
        type="text"
        className="input border-success border-[2.5px] border-r-0 join-item w-[12vw] bg-white bg-opacity-50 text-success"
        placeholder="채팅을 입력하세요."
        onChange={onChange}
        value={chat}
      />

      <div className="indicator">
        <button type="submit" className="btn join-item btn-success">
          보내기
        </button>
      </div>
    </form>
  );
};

export default ChatForm;
