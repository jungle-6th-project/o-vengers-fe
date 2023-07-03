import { useNavigate } from 'react-router-dom';

const NotFoundErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen z-[51] fixed top-0 left-0 bg-white flex items-center justify-center flex-col">
      <div className="block overflow-hidden aspect-square w-[200px]">
        <img
          src="/tomato.png"
          alt="Popping tomato"
          className="object-cover w-full h-full"
        />
      </div>
      <h1 className="py-6 text-4xl font-bold">404 Not Found</h1>
      <button
        type="button"
        className="h-12 min-h-0 btn btn-neutral btn-lg"
        onClick={() => navigate('/')}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default NotFoundErrorPage;
