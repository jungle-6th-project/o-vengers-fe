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
    <div className="grid grid-rows-profile card card-bordered h-full p-4 items-center border-[#D9D9D9] w-ranking_todo min-w-leftbar max-w-leftbar bg-[#FAFAFA] rounded-2xl min-h-[280px]">
      <div className="flex justify-center p-3 avatar">
        <div className="rounded-full h-full min-h-[150px]">
          <img src={user.profile} alt="Profile" />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="text-[1.3rem] font-semibold text-black profile-name">
          {user.name}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          type="button"
          className="items-center font-medium text-[0.9rem] text-black w-[5rem] h-[1.8rem] bg-gray-200 border-transparent rounded btn btn-xs"
          onClick={() => logOut()}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Profile;
