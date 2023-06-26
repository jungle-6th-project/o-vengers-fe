import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import { useMutation } from '@tanstack/react-query';
import { Todo } from './TodoTypes';
import { editOrDoneTodo, deleteTodo } from '@/utils/api';

interface TodoItemProps {
  todoData: Todo;
  onDelete: () => void;
}

const TodoItem = ({ todoData, onDelete }: TodoItemProps) => {
  const [editedContent, setEditedContent] = useState(todoData.content);
  const [isEditing, setIsEditing] = useState(false);
  const [isChecked, setIsChecked] = useState(todoData.done);
  const [isHovering, setIsHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: editOrDoneTodoMutation } = useMutation(editOrDoneTodo);
  const { mutate: deleteTodoMutation } = useMutation(deleteTodo);

  const onClickEdit = () => {
    setIsChecked(!isChecked);
    if (!todoData.done && !isEditing) {
      setIsEditing(true);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEditedContent(event.target.value);
  };

  const onClickSave = () => {
    editOrDoneTodoMutation({
      content: editedContent,
      done: isChecked,
      todoId: todoData.todoId,
    });
    setIsEditing(false);
  };

  const onClickDelete = () => {
    deleteTodoMutation({
      todoId: todoData.todoId,
    });
    onDelete();
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onClickSave();
    }
  };

  const handleCheck = () => {
    // eslint-disable-next-line no-param-reassign
    todoData.done = !isChecked;
    editOrDoneTodoMutation({
      content: todoData.content,
      done: !isChecked,
      todoId: todoData.todoId,
    });
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className="flex w-full TodoItem">
      <label
        className={`cursor-pointer label flex items-center w-full p-2 mx-2 mb-2 ${
          isChecked ? 'bg-gray-100' : 'bg-accent'
        } rounded-lg`}
        htmlFor={`todo${todoData.todoId}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <input
          className="hidden"
          id={`todo${todoData.todoId}`}
          onClick={handleCheck}
          defaultChecked={isChecked}
        />
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedContent}
              className="w-full h-full pl-1 pr-0 bg-transparent border-transparent rounded-sm input flex-grow"
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onBlur={onClickSave}
              ref={inputRef}
            />
            <button
              className={`pl-2 pr-1 m-0 ${
                isHovering ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={onClickSave}
              type="button"
            >
              <BsCheckLg />
            </button>
          </>
        ) : (
          <>
            <span
              className={`Content ml-2 flex-grow break-words overflow-auto w-full ${
                todoData.done ? 'text-gray-400 line-through' : 'text-todo'
              }`}
            >
              {editedContent}
            </span>
            <button
              className={`px-1 m-0 ${
                todoData.done ? 'opacity-0' : 'text-todo'
              }  ${isHovering && !todoData.done ? 'opacity-100' : 'opacity-0'}`}
              style={{ minHeight: 1 }}
              onClick={onClickEdit}
              type="button"
              disabled={todoData.done}
            >
              <AiFillEdit />
            </button>
            <button
              className={`px-1 m-0 ${
                todoData.done ? 'text-gray-400' : 'text-todo'
              } ${isHovering ? 'opacity-100' : 'opacity-0'}`}
              onClick={onClickDelete}
              type="button"
            >
              <AiFillDelete />
            </button>
          </>
        )}
      </label>
    </div>
  );
};

export default TodoItem;
