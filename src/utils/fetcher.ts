import axios from 'axios';

export async function getUsers() {
  const res = await axios.get('https://jsonplaceholder.typicode.com/users');
  const data = await res.data;
  return data;
}

export async function getUser(id: number) {
  const res = await axios.get(
    `https://jsonplaceholder.typicode.com/user/${id}`
  );
  const data = await res.data;
  return data;
}
