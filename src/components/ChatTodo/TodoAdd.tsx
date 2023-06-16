import React, { ChangeEvent, useRef } from 'react';

interface GroupTodoInputProps {
  inputValue: string;
  inputRef: React.RefObject<HTMLInputElement>;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TodoAdd = ({
  inputValue,
  inputRef,
  handleInputChange,
  onKeyPress,
}: GroupTodoInputProps) => {
  return (
    <div className="bg-gray-100 rounded-lg p-2 m-2">
      <input
        className="input bg-inherit border-hidden w-full input-sm m-2"
        ref={inputRef}
        id="myInput"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={onKeyPress}
        placeholder="할 일을 입력하세요."
      />
    </div>
  );
};

export default TodoAdd;
