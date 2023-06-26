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
    <div className="min-h-screen bg-cover bg-login min-w-max">
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
      <footer className="p-10 footer footer-center bg-primary text-primary-content">
        <div>
          <p className="font-bold">
            리더스 푸르넷 공부방 - 뽀독뽀독 독서실 <br />
          </p>
          <p>
            주소 : 광주광역시 광산구 도산동 남동길 30번길 13 | 사업자 등록 번호
            : 865-91-01383 | 대표 번호 : 010-3649-3666 (원장)
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Login;
