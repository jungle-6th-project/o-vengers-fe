/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useUserActions } from '@/store/userStore';

function KakaoCallback() {
  const { setUser, setIsLoggedIn } = useUserActions();
  const [, setAccessToken] = useCookies(['accessToken']);
  const [, setRefreshToken] = useCookies(['refreshToken']);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const url =
        import.meta.env.MODE === 'production'
          ? 'https://www.sangyeop.shop'
          : 'https://www.api-bbodog.shop';
      console.log(`${url}/api/v1/members/login`);
      try {
        const response = await axios.post(`${url}/api/v1/members/login`, {
          authCode: code,
        });
        const { accessToken, refreshToken } = response.data.data;

        setAccessToken('accessToken', accessToken, { path: '/' });
        setRefreshToken('refreshToken', refreshToken, { path: '/' });
        setUser(accessToken);
        setIsLoggedIn(true);

        await axios.post(
          '/api/v1/groups/1',
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        navigate('/');
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [setAccessToken, setRefreshToken, navigate, setUser, setIsLoggedIn]);

  return <></>;
}

export default KakaoCallback;
