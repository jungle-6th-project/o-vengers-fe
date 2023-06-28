import React, { ChangeEvent, FocusEvent } from 'react';

interface GroupTodoInputProps {
  inputValue: string;
  inputRef: React.RefObject<HTMLInputElement>;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
}

const TodoAdd = ({
  inputValue,
  inputRef,
  handleInputChange,
  onKeyPress,
  onBlur,
}: GroupTodoInputProps) => {
  return (
    <div className="flex w-full">
      <div className="flex w-full p-1 mx-2 mb-2 rounded-lg bg-accent">
        <input
          className="w-full input bg-inherit border-hidden input-sm input-accent text-todo placeholder-todo placeholder-opacity-50"
          ref={inputRef}
          id="myInput"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={onKeyPress}
          onBlur={onBlur}
          placeholder="할 일을 입력하세요."
        />
      </div>
    </div>
  );
};

export default TodoAdd;
