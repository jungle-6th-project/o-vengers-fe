import axios from 'axios';

axios.defaults.baseURL = 'https://www.sangyeop.shop';

export function parseCookies(cookieString: string) {
  const cookies: { [key: string]: string } = {};
  cookieString.split(';').forEach(cookie => {
    const [key, value] = cookie.split('=');
    cookies[key.trim()] = decodeURIComponent(value);
  });
  return cookies;
}

axios.interceptors.request.use(
  function requestInterceptor(config) {
    const cookieString = document.cookie;
    const cookies = parseCookies(cookieString);
    if (
      config.url !== 'https://www.sangyeop.shop/api/v1/members/login' &&
      !cookies.accessToken
    ) {
      window.location.href = '/login';
    }

    const newConfig = { ...config };

    newConfig.headers.Authorization = `Bearer ${cookies.accessToken}`;
    return newConfig;
  },
  function errorInterceptor(error) {
    console.log(error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function responseInterceptor(response) {
    return response;
  },
  function errorInterceptor(error) {
    console.log(error);
    const originalRequest = error.config;
    const cookieString = document.cookie;
    const cookies = parseCookies(cookieString);

    if (error.response.status === 401) {
      return axios
        .post('/api/v1/members/tokens', null, {
          headers: {
            'X-BBODOK-REFRESH-TOKEN': cookies.refreshToken,
          },
        })
        .then(response => {
          const newAccessToken = response.data.accessToken;

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axios(originalRequest);
        })
        .catch(err => {
          console.log(err);
          window.location.href = '/login';
          return Promise.reject(err);
        });
    }

    return Promise.reject(error);
  }
);

export async function getUser() {
  const res = await axios.get('/api/v1/members');

  if (!res.data || !res.data.data) {
    throw new Error('User data is not available');
  }

  const { data } = await res.data;
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
export const getGroupMembers = async (groupId: number) => {
  const res = await axios.get(`/api/v1/ranks?groupId=${groupId}`);

  if (!res.data || !res.data.data) {
    throw new Error('Group member data is not available');
  }

  const { data } = res.data;
  return data;
};

export async function getTodoDatas(groupId: number) {
  const res = await axios.get(`/api/v1/todos?groupId=${groupId}`);

  const { data } = res.data;
  return data;
}

export const getUserReservation = async (from: string, to: string) => {
  const res = await axios.get(`/api/v1/rooms/all?from=${from}&to=${to}`);

  if (!res.data || !res.data.data) {
    throw new Error('User reservation data is not available');
  }

  const { data } = res.data;
  return data;
};

export const getUserNearestReservation = async () => {
  const res = await axios.get('/api/v1/rooms/nearest');

  if (!res.data || res.data.data === undefined) {
    throw new Error('User nearest reservation data is not available');
  }

  const { data } = res.data;
  return data;
};

export const getUserInGroupReservation = async (
  groupId: number,
  from: string,
  to: string
) => {
  const res = await axios.get(
    `/api/v1/rooms/reservation?groupId=${groupId}&from=${from}&to=${to}`
  );

  if (!res.data || !res.data.data) {
    throw new Error('User reservation in group data is not available');
  }

  const { data } = res.data;
  return data;
};

export const getGroupReservation = async (
  groupId: number,
  from: string,
  to: string
) => {
  const res = await axios.get(
    `/api/v1/rooms?groupId=${groupId}&from=${from}&to=${to}`
  );

  if (!res.data || !res.data.data) {
    throw new Error('Group reservation data is not available');
  }

  const { data } = res.data;
  return data;
};

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

export async function editOrDoneTodo({
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

export async function pathJoinGroup({ path }: { path: string }) {
  const res = await axios.post(
    `/api/v1/groups/path`,
    // eslint-disable-next-line object-shorthand
    { path: path }
  );

  const { data } = res.data;
  return data;
}

export async function getGroupNameByPath({ path }: { path: string }) {
  const res = await axios.get('/api/v1/groups/path', {
    // eslint-disable-next-line object-shorthand
    params: { path: path },
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

export const enterVideoRoom = async (roomId: number) => {
  await axios.post('/api/v1/rooms/histories', {
    roomId,
  });
};

export const leaveVideoRoom = async (roomId: number) => {
  await axios.patch('/api/v1/rooms/histories', {
    roomId,
  });
};

export const getStudyHistory = async (DateStart: string, DateEnd: string) => {
  const res = await axios.get(
    `https://www.sangyeop.shop/api/v1/study-histories/durations?from=${DateStart}&to=${DateEnd}`
  );

  const { data } = res.data;
  console.log(data);
  return data;
};
