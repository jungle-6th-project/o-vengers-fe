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
    <div className="grid grid-rows-profile card card-bordered h-profile min-h-profile max-h-profile p-4 items-center border-[#D9D9D9] w-ranking_todo min-w-leftbar max-w-leftbar bg-[#FAFAFA] rounded-md justify-items-center">
      <div
        className="mx-auto mt-2 mb-4 overflow-hidden rounded-full aspect-square"
        style={{ width: 'calc( 100% - 4.1rem )', maxWidth: '200px' }}
      >
        <img src={user.profile} alt={user.name} className="" />
      </div>
      <span className="text-[1.3rem] font-semibold text-black profile-name">
        {user.name}
      </span>
      <button
        type="button"
        className="items-center font-medium text-[0.9rem] text-black w-[5rem] h-[1.8rem] bg-gray-200 border-transparent rounded btn btn-xs"
        onClick={() => logOut()}
      >
        로그아웃
      </button>
    </div>
  );
};

export default Profile;
