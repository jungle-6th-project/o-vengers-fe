function Login() {
  const KakaoLogin = () => {
    const kakaoUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${
      import.meta.env.VITE_REST_API_KEY
    }&redirect_uri=${import.meta.env.VITE_REDIRECT_URL}
      `;

    window.location.href = kakaoUrl;
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <button type="button" onClick={KakaoLogin} className="btn">
        <img src="./kakao-login.png" alt="kakao-login" />
      </button>
    </div>
  );
}

export default Login;
