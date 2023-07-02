import { ReactComponent as KakoLogin } from '@/assets/login.svg';

function Login() {
  const KakaoLogin = () => {
    const kakaoUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${
      import.meta.env.VITE_REST_API_KEY
    }&redirect_uri=${import.meta.env.VITE_REDIRECT_URL}
      `;

    window.location.href = kakaoUrl;
  };

  return (
    <div className="w-screen h-screen min-h-screen bg-cover bg-login min-w-max">
      <div className="min-h-screen hero">
        <div className="text-center hero-content">
          <div className="flex flex-col items-center max-w-md">
            <h1 className="mb-8 font-bold text-9xl">뽀독뽀독</h1>
            <KakoLogin
              onClick={KakaoLogin}
              className="cursor-pointer hover:brightness-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
