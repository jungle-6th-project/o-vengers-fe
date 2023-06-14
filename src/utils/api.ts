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