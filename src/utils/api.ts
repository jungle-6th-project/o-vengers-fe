import axios from 'axios';

axios.defaults.baseURL = 'https://www.sangyeop.shop';

export async function getUser() {
  const res = await axios.get('/api/v1/members');
  const data = await res.data;
  return data;
}

export async function getAllGroups() {
  const res = await axios.get('/api/v1/groups/all');
  const { data } = await res.data;
  return data;
}

export async function getMyGroups() {
  const res = await axios.get('/api/v1/groups');
  const { data } = await res.data;
  return data;
}

export async function joinGroup({
  groupId,
  password,
}: {
  groupId: number;
  password: string;
}) {
  const res = await axios.post(`/api/v1/groups/${groupId}`, {
    // eslint-disable-next-line object-shorthand
    password: password,
  });
  const { data } = res.data;

  return data;
}

export async function getJoinedGroupMemebers(groupId: number) {
  const res = await axios.get(`/api/v1/ranks?groupId=${groupId}`);
  const { data } = res.data;

  return data;
}

export async function getTodoDatas(groupId: number) {
  const res = await axios.get(`/api/v1/todos?groupId=${groupId}`);
  const { data } = res.data;
  return data;
}

export async function postTodo({
  content,
  groupId,
}: {
  content: string;
  groupId: number;
}) {
  const res = await axios.post(`/api/v1/todos`, {
    // eslint-disable-next-line object-shorthand
    content: content,
    // eslint-disable-next-line object-shorthand
    groupId: groupId,
  });
  const { data } = res.data;

  return data;
}

export async function eidtOrDoneTodo({
  content,
  done,
  todoId,
}: {
  content: string;
  done: boolean;
  todoId: number;
}) {
  const res = await axios.patch(`/api/v1/todos`, {
    // eslint-disable-next-line object-shorthand
    content: content,
    // eslint-disable-next-line object-shorthand
    done: done,
    // eslint-disable-next-line object-shorthand
    todoId: todoId,
  });
  const { data } = res.data;

  return data;
}

export async function deleteTodo({ todoId }: { todoId: number }) {
  const res = await axios.delete(`/api/v1/todos`, {
    data: {
      // eslint-disable-next-line object-shorthand
      todoId: todoId,
    },
  });

  const { data } = res.data;

  return data;
}

export async function makeGroup({
  groupName,
  password,
  path,
  secret,
}: {
  groupName: string;
  password: string;
  path: string;
  secret: boolean;
}) {
  const res = await axios.post(`/api/v1/groups`, {
    // eslint-disable-next-line object-shorthand
    groupName: groupName,
    // eslint-disable-next-line object-shorthand
    password: password,
    // eslint-disable-next-line object-shorthand
    path: path,
    // eslint-disable-next-line object-shorthand
    secret: secret,
  });

  const { data } = res.data;

  return data;
}

export async function deleteGroup(groupId: number) {
  axios.delete('/api/v1/groups', {
    data: {
      groupId,
    },
  });
}

export const changeGroupColor = async (groupId: number, color: string) => {
  await axios.patch('/api/v1/groups/color', {
    color,
    groupId,
  });
};
