/* eslint-disable react/jsx-no-useless-fragment */
import { useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

function KakaoCallback() {
  const [, setAccessToken] = useCookies(['accessToken']);
  const [, setRefreshToken] = useCookies(['refreshToken']);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      try {
        const response = await axios.post(
          `https://www.sangyeop.shop/api/v1/members/tokens?authCode=${code}`
        );
        const { accessToken, refreshToken } = response.data.data;

        setAccessToken('accessToken', accessToken, { path: '/' });
        setRefreshToken('refreshToken', refreshToken, { path: '/' });

        navigate('/');
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [setAccessToken, setRefreshToken, navigate]);

  return <></>;
}

export default KakaoCallback;
