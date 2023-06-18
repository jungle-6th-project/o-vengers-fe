import axios from 'axios';

export async function getUsers() {
  const res = await axios.get('https://jsonplaceholder.typicode.com/users');
  const data = await res.data;
  return data;
}

export async function getUser(accessToken: string) {
  const res = await axios.get('https://www.sangyeop.shop/api/v1/members', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await res.data;
  return data;
}

export async function getAllGroups(accessToken: string) {
  const res = await axios.get('https://www.sangyeop.shop/api/v1/groups/all', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const { data } = res.data;
  return data;
}

export async function getMyGroups(accessToken: string) {
  const res = await axios.get('https://www.sangyeop.shop/api/v1/groups', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const { data } = res.data;
  return data;
}

export async function joinGroup({
  accessToken,
  groupId,
  password,
}: {
  accessToken: string;
  groupId: number;
  password: string;
}) {
  const res = await axios.post(
    `https://www.sangyeop.shop/api/v1/groups/${groupId}`,
    {
      // eslint-disable-next-line object-shorthand
      password: password,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const { data } = res.data;
  console.log('joinGroup', data);
  return data;
}

export async function getTodoDatas(accessToken: string, groupId: number) {
  const res = await axios.get(
    `https://www.sangyeop.shop/api/v1/todos?groupId=${groupId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const { data } = res.data;
  return data;
}

export async function postTodo({
  accessToken,
  content,
  groupId,
}: {
  accessToken: string;
  content: string;
  groupId: number;
}) {
  const res = await axios.post(
    `https://www.sangyeop.shop/api/v1/todos`,
    {
      // eslint-disable-next-line object-shorthand
      content: content,
      // eslint-disable-next-line object-shorthand
      groupId: groupId,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const { data } = res.data;
  console.log('postTodo', data);
  return data;
}

export async function eidtOrDoneTodo({
  accessToken,
  content,
  done,
  todoId,
}: {
  accessToken: string;
  content: string;
  done: boolean;
  todoId: number;
}) {
  const res = await axios.patch(
    `https://www.sangyeop.shop/api/v1/todos`,
    {
      // eslint-disable-next-line object-shorthand
      content: content,
      // eslint-disable-next-line object-shorthand
      done: done,
      // eslint-disable-next-line object-shorthand
      todoId: todoId,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const { data } = res.data;
  console.log('eidtOrDoneTodo', data);
  return data;
}

export async function deleteTodo({
  accessToken,
  todoId,
}: {
  accessToken: string;
  todoId: number;
}) {
  const res = await axios.delete(`https://www.sangyeop.shop/api/v1/todos`, {
    data: {
      // eslint-disable-next-line object-shorthand
      todoId: todoId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const { data } = res.data;
  console.log('deleteTodo', data);
  return data;
}

export async function makeGroup({
  accessToken,
  groupName,
  password,
  path,
  secret,
}: {
  accessToken: string;
  groupName: string;
  password: string;
  path: string;
  secret: boolean;
}) {
  const res = await axios.post(
    `https://www.sangyeop.shop/api/v1/groups`,
    {
      // eslint-disable-next-line object-shorthand
      groupName: groupName,
      // eslint-disable-next-line object-shorthand
      password: password,
      // eslint-disable-next-line object-shorthand
      path: path,
      // eslint-disable-next-line object-shorthand
      secret: secret,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const { data } = res.data;
  console.log('makeGroup', data);
  return data;
}

export async function pathJoinGroup({
  accessToken,
  path,
}: {
  accessToken: string;
  path: string;
}) {
  const res = await axios.post(
    `https://www.sangyeop.shop/api/v1/groups/path`,
    // eslint-disable-next-line object-shorthand
    { path: path },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const { data } = res.data;
  console.log('joinGroup', data);
  return data;
}

export async function getGroupNameByPath({
  accessToken,
  path,
}: {
  accessToken: string;
  path: string;
}) {
  const res = await axios.get('https://www.sangyeop.shop/api/v1/groups/path', {
    // eslint-disable-next-line object-shorthand
    params: { path: path },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const { data } = res.data;
  return data;
}
