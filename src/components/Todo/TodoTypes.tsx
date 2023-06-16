export interface Todo {
  todoId: number;
  groupId: number;
  content: string;
  done: boolean;
}

export interface GroupTodoData {
  data: Todo[];
}

export interface GroupData {
  color: string;
  groupId: number;
  groupName: string;
  secret: boolean;
}
