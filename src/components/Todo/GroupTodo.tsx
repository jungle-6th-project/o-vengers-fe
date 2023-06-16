import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useCookies } from 'react-cookie';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AiOutlinePlus } from 'react-icons/ai';
import { Todo, GroupData } from './TodoTypes';
import { getTodoDatas, postTodo } from '../../utils/api';
import TodoItem from './TodoItem';
import TodoAdd from './TodoAdd';

interface GroupDataProps {
  groupData: GroupData;
}

const useKeyPress = (
  accessToken: string,
  groupData: GroupData,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  setShowInput: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const postTodoMutation = useMutation(
    (values: { accessToken: string; content: string; groupId: number }) =>
      postTodo(values)
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const inputValue = e.currentTarget.value.trim();
      if (inputValue !== '') {
        const newTodo: Todo = {
          todoId: Math.random(),
          groupId: groupData.groupId,
          content: inputValue,
          done: false,
        };
        postTodoMutation.mutate({
          accessToken,
          content: inputValue,
          groupId: groupData.groupId,
        });
        setTodos(prevTodos => [newTodo, ...prevTodos]);
        setInputValue('');
        setShowInput(false);
      }
    }
  };

  return handleKeyPress;
};

const GroupTodo = ({ groupData }: GroupDataProps) => {
  const [{ accessToken }] = useCookies(['accessToken']);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: todoList,
    isLoading,
    isError,
  } = useQuery(['MyTodoList', groupData.groupId], () =>
    getTodoDatas(accessToken, groupData.groupId)
  );

  useEffect(() => {
    if (todoList) {
      setTodos(todoList);
    }
  }, [todoList]);

  const handleButtonClick = (): void => {
    setShowInput(true);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
  };

  const onKeyPress = useKeyPress(
    accessToken,
    groupData,
    setTodos,
    setInputValue,
    setShowInput
  );

  useEffect(() => {
    if (!isLoading && !isError && todoList) {
      setTodos(todoList.reverse());
    }
  }, [todoList, isLoading, isError]);

  const handleDelete = (todoId: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.todoId !== todoId));
  };

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  return (
    <div className="p-2 m-3 bg-white border border-gray-300 rounded-md shadow-md">
      <div className="flex items-center justify-between p-2 m-2">
        <h3 className="text-2xl font-bold">{groupData.groupName}</h3>
        <button
          type="button"
          className="px-4 py-2 text-gray-600"
          onClick={handleButtonClick}
        >
          <AiOutlinePlus size={24} />
        </button>
      </div>
      {showInput && (
        <TodoAdd
          inputValue={inputValue}
          inputRef={inputRef}
          handleInputChange={handleInputChange}
          onKeyPress={onKeyPress}
        />
      )}
      <div className="bg-white rounded-lg">
        {todos.map((todo: Todo) => (
          <TodoItem
            key={todo.todoId}
            todoData={todo}
            onDelete={() => handleDelete(todo.todoId)}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupTodo;
