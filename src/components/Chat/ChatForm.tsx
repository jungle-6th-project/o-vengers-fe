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
      className="absolute bottom-0 grid w-full px-2 pt-1 pb-2 min-w-leftbar max-w-leftbar"
      style={{ gridTemplateColumns: '1fr auto' }}
    >
      <input
        type="text"
        className="input border-success border-[2.5px] border-r-0 join-item bg-white text-black"
        style={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
        placeholder="채팅을 입력하세요."
        onChange={onChange}
        value={chat}
      />

      <div className="indicator">
        <button
          type="submit"
          className="btn join-item btn-neutral"
          style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        >
          보내기
        </button>
      </div>
    </form>
  );
};

export default ChatForm;
