import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useUser, useUserActions } from '@/store/userStore';

const Profile = () => {
  const user = useUser();
  const navigate = useNavigate();

  const { setIsLoggedIn, reset } = useUserActions();
  const [, , removeAccessTokenCookies] = useCookies(['accessToken']);
  const [, , removeRefreshTokenCookies] = useCookies(['refreshToken']);

  const logOut = async () => {
    await removeAccessTokenCookies('accessToken');
    await removeRefreshTokenCookies('refreshToken');
    await localStorage.removeItem('user');
    await setIsLoggedIn(false);
    await reset();
    await navigate('/login');
  };
  return (
    <div className="card card-bordered flex items-center border-[#D9D9D9] w-ranking_todo bg-[#FAFAFA] rounded-xl h-[45vh] mb-3">
      <div className="flex items-center avatar">
        <div className="rounded-full w-[13vw] h-[13vw] mt-[3vh]">
          <img src={user.profile} alt="Profile" />
        </div>
      </div>
      <div className="mt-1 text-xl font-semibold text-black profile-name">
        {user.name}
      </div>
      <button
        type="button"
        className="mt-1 items-center font-medium text-sm text-black w-[5vw] h-[3vh] bg-gray-200 border-transparent rounded btn btn-xs"
        onClick={() => logOut()}
      >
        로그아웃
      </button>
    </div>
  );
};

export default Profile;
