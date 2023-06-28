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
    <div className="card card-bordered flex items-center border-[#D9D9D9] w-ranking_todo min-w-leftbar max-w-leftbar bg-[#FAFAFA] rounded-md min-h-[250px] h-[20.5vw] mb-3">
      <div className="flex justify-center avatar">
        <div className="rounded-full w-[13vw] min-w-[150px] mt-[1.5vw]">
          <img src={user.profile} alt="Profile" />
        </div>
      </div>
      <div className="mt-[0.5vw] text-[1.3rem] font-semibold text-black profile-name">
        {user.name}
      </div>
      <button
        type="button"
        className="items-center font-medium text-[0.9rem] mb-[0.6vw] text-black w-[5rem] h-[1.8rem] bg-gray-200 border-transparent rounded btn btn-xs"
        onClick={() => logOut()}
      >
        로그아웃
      </button>
    </div>
  );
};

export default Profile;
