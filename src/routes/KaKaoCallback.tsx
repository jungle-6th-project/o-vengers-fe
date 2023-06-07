/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

function KakaoCallback() {
  useEffect(() => {
    const params = new URL(document.location.toString()).searchParams;
    const code = params.get('code');
    const grantType = 'authorization_code';
    const REST_API_KEY = `${import.meta.env.VITE_REST_API_KEY}`;
    const REDIRECT_URI = `${import.meta.env.VITE_REDIRECT_URL}`;

    axios
      .post(
        `https://kauth.kakao.com/oauth/token?grant_type=${grantType}&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${code}`,
        {},
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        }
      )
      .then((res: AxiosResponse) => {
        return res.data?.access_token;
      })
      .then(token => {
        const userInfo = axios.get('https://kapi.kakao.com/v2/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        return userInfo;
      })
      .then(userInfo => console.log(userInfo))
      .catch((error: AxiosError) => console.log(error));
  }, []);
  return <></>;
}
export default KakaoCallback;
