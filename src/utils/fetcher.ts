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
  const res = await axios.get('https://www.sangyeop.shop/api/v1/groups', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await res.data.data;
  return data;
}
