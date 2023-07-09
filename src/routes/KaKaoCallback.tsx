import { useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useUserActions } from '@/store/userStore';
import requestPermission from '@/utils/fcm';
import Loading from '@/components/Loading/Loading';

function getFcmToken(key: string) {
  return new Promise((resolve, reject) => {
    try {
      const value = localStorage.getItem(key);
      resolve(value);
    } catch (error) {
      reject(error);
    }
  });
}

function KakaoCallback() {
  const { setUser, setIsLoggedIn } = useUserActions();
  const [, setAccessToken] = useCookies(['accessToken']);
  const [, setRefreshToken] = useCookies(['refreshToken']);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await requestPermission();
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const url =
        import.meta.env.MODE === 'production'
          ? 'https://www.sangyeop.shop'
          : 'https://www.api-bbodog.shop';

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

        await getFcmToken('fcmToken')
          .then((result: unknown) => {
            const fcmToken = result as string;
            if (fcmToken !== null) {
              axios.post(
                '/api/v1/clients',
                {
                  fcmToken,
                },
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );
            }
            return null;
          })
          .catch(error => console.log(error));

        await navigate('/');
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [setAccessToken, setRefreshToken, navigate, setUser, setIsLoggedIn]);

  return <Loading />;
}

export default KakaoCallback;
