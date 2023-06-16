import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { useMutation } from '@tanstack/react-query';
import { useCookies } from 'react-cookie';
import { Todo } from './TodoTypes';
import { eidtOrDoneTodo, deleteTodo } from '../../utils/api';

interface TodoItemProps {
  todoData: Todo;
  onDelete: () => void;
}

const TodoItem = ({ todoData, onDelete }: TodoItemProps) => {
  const [{ accessToken }] = useCookies(['accessToken']);

  const [editedContent, setEditedContent] = useState(todoData.content);
  const [isEditing, setIsEditing] = useState(false);
  const [isChecked, setIsChecked] = useState(todoData.done);
  const [isHovering, setIsHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: eidtOrDoneTodoMutation } = useMutation(eidtOrDoneTodo);
  const { mutate: deleteTodoMutation } = useMutation(deleteTodo);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEditedContent(event.target.value);
  };

  const handleCheck = () => {
    const updatedDoneStatus = !isChecked;
    setIsChecked(updatedDoneStatus);

    eidtOrDoneTodoMutation({
      accessToken: `${accessToken}`,
      content: todoData.content,
      done: updatedDoneStatus,
      todoId: todoData.todoId,
    });
  };

  const onClickSave = () => {
    eidtOrDoneTodoMutation({
      accessToken: `${accessToken}`,
      content: editedContent,
      done: isChecked,
      todoId: todoData.todoId,
    });
    setIsEditing(false);
  };

  const onClickDelete = () => {
    deleteTodoMutation({
      accessToken: `${accessToken}`,
      todoId: todoData.todoId,
    });
    onDelete();
  };

  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onClickSave();
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className="flex TodoItem">
      <div
        className="flex items-center w-full h-20 p-2 m-2 bg-gray-100 rounded-lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedContent}
              maxLength={10}
              onChange={handleInputChange}
              ref={inputRef}
              className="input bg-inherit border-hidden w-36 input-sm"
              onKeyPress={onKeyPress}
            />
            <button
              className="self-end m-3 btn btn-link"
              onClick={onClickSave}
              type="button"
            >
              <BsCheckLg />
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={handleCheck}>
              {isChecked ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />}
            </button>
            <span
              className="Content"
              style={{
                textDecoration: todoData.done ? 'line-through' : 'none',
              }}
            >
              {editedContent}
            </span>
            {isHovering && (
              <div className="flex items-end">
                <button
                  className={`btn btn-link justify-end ${
                    todoData.done ? 'hidden' : ''
                  }`}
                  onClick={() => setIsEditing(true)}
                  type="button"
                  disabled={todoData.done}
                >
                  <AiFillEdit />
                </button>
                <button
                  className="justify-end btn btn-link"
                  onClick={onClickDelete}
                  type="button"
                >
                  <AiFillDelete />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
