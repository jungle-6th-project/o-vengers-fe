import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { AiFillEdit } from '@react-icons/all-files/ai/AiFillEdit';
import { AiFillDelete } from '@react-icons/all-files/ai/AiFillDelete';
import { AiOutlineCheck } from '@react-icons/all-files/ai/AiOutlineCheck';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Todo } from './TodoTypes';
import { editOrDoneTodo, deleteTodo } from '@/utils/api';

interface TodoItemProps {
  todoData: Todo;
  onDelete: () => void;
}

const TodoItem = ({ todoData, onDelete }: TodoItemProps) => {
  const queryClient = useQueryClient();
  const [editedContent, setEditedContent] = useState(todoData.content);
  const [isEditing, setIsEditing] = useState(false);
  const [isChecked, setIsChecked] = useState(todoData.done);
  const [isHovering, setIsHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: editOrDoneTodoMutation } = useMutation(editOrDoneTodo, {
    onSuccess() {
      return queryClient.invalidateQueries(['MyTodoList']);
    },
  });
  const { mutate: deleteTodoMutation } = useMutation(deleteTodo, {
    onSuccess() {
      return queryClient.invalidateQueries(['MyTodoList']);
    },
  });

  const onClickEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isChecked && !isEditing) {
      setIsEditing(true);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEditedContent(event.target.value);
  };

  const saveTodo = () => {
    editOrDoneTodoMutation({
      content: editedContent,
      done: isChecked,
      todoId: todoData.todoId,
      groupId: todoData.groupId,
    });
    setIsEditing(false);
  };

  const onClickSave = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.FocusEvent<HTMLInputElement>
  ) => {
    event.stopPropagation();
    saveTodo();
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveTodo();
    }
  };

  const handleCheck = () => {
    editOrDoneTodoMutation({
      content: todoData.content,
      done: !isChecked,
      todoId: todoData.todoId,
      groupId: todoData.groupId,
    });
    setIsChecked(!isChecked);
  };

  const onClickDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    deleteTodoMutation({
      todoId: todoData.todoId,
    });
    onDelete();
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
        className={`cursor-pointer label flex items-center p-2 mx-2 mb-2 ${
          isChecked ? 'bg-gray-100' : 'bg-accent'
        } rounded-lg`}
        style={{ width: 'calc( 100% - 1rem )' }}
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
              className="flex-grow w-full h-full pl-1 pr-0 bg-transparent border-transparent rounded-sm input"
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onBlur={onClickSave}
              ref={inputRef}
            />
            <button
              className="pl-2 pr-1 m-0"
              onClick={onClickSave}
              type="button"
            >
              <AiOutlineCheck />
            </button>
          </>
        ) : (
          <>
            <span
              className={`Content pl-2 flex-grow break-words overflow-auto w-full ${
                isChecked ? 'text-gray-400 line-through' : 'text-todo'
              }`}
            >
              {editedContent}
            </span>
            <button
              className={`px-1 m-0 focus:opacity-100 ${
                isChecked ? 'opacity-0' : 'text-todo'
              } ${isHovering && !isChecked ? 'opacity-100' : 'opacity-0'}`}
              style={{ minHeight: 1 }}
              onClick={onClickEdit}
              type="button"
              disabled={isChecked}
            >
              <AiFillEdit />
            </button>
            <button
              className={`px-1 m-0 focus:opacity-100 ${
                isChecked ? 'text-gray-400' : 'text-todo'
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
