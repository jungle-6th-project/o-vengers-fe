import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AiOutlinePlus } from 'react-icons/ai';
import { Todo, GroupData } from './TodoTypes';
import { getTodoDatas, postTodo } from '@/utils/api';
import TodoItem from './TodoItem';
import TodoAdd from './TodoAdd';

interface GroupDataProps {
  groupData: GroupData;
}

const useKeyPress = (
  groupData: GroupData,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  setShowInput: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const postTodoMutation = useMutation(
    (values: { content: string; groupId: number }) => postTodo(values)
  );

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const inputValue = e.currentTarget.value.trim();
      if (inputValue !== '') {
        try {
          const data = await postTodoMutation.mutateAsync({
            content: inputValue,
            groupId: groupData.groupId,
          });

          const newTodo: Todo = {
            todoId: data.todoId,
            groupId: groupData.groupId,
            content: inputValue,
            done: false,
          };
          setTodos(prevTodos => [newTodo, ...prevTodos]);
          setInputValue('');
          setShowInput(false);
        } catch (error) {
          // handle error
        }
      }
    }
  };

  return handleKeyPress;
};

const GroupTodo = ({ groupData }: GroupDataProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: todoList,
    isLoading,
    isError,
  } = useQuery(['MyTodoList', groupData.groupId], () =>
    getTodoDatas(groupData.groupId)
  );

  useEffect(() => {
    if (todoList) {
      setTodos(todoList);
    }
  }, [todoList]);

  const handleButtonClick = (): void => {
    setShowInput(true);
  };

  const handleBlur = (): void => {
    setShowInput(false);
    setInputValue('');
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
  };

  const onKeyPress = useKeyPress(
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
    <div className="card bg-white border border-[#D9D9D9] rounded-md">
      <div className="flex justify-between p-2">
        <h3 className="text-xl font-semibold pl-0.5">{groupData.groupName}</h3>
        <button
          type="button"
          className="text-gray-600 mr-0.5 mt-[0.2rem] align-top max-h-5"
          onClick={handleButtonClick}
        >
          <AiOutlinePlus size={20} />
        </button>
      </div>
      {showInput && (
        <TodoAdd
          inputValue={inputValue}
          inputRef={inputRef}
          handleInputChange={handleInputChange}
          onKeyPress={onKeyPress}
          onBlur={handleBlur}
        />
      )}
      {todos.map((todo: Todo) => (
        <TodoItem
          key={todo.todoId}
          todoData={todo}
          onDelete={() => handleDelete(todo.todoId)}
        />
      ))}
    </div>
  );
};

export default GroupTodo;
