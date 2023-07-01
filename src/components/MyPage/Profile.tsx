import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useUser, useUserActions } from '@/store/userStore';
import { withdraw } from '@/utils/api';

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

  const withdrawUser = async () => {
    await withdraw();
    await navigate('/login');
  };

  return (
    <div className="card card-bordered grid grid-rows-7 grid-cols-1 p-4 items-center border-[#D9D9D9] w-ranking_todo min-w-leftbar max-w-leftbar bg-[#FAFAFA] rounded-md min-h-[250px] h-[20.5vw]">
      <div className="flex justify-center row-span-5 avatar">
        <div className="rounded-full w-[13vw] min-w-[150px]">
          <img src={user.profile} alt="Profile" />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="text-[1.3rem] font-semibold text-black profile-name">
          {user.name}
        </div>
      </div>
      <div className="flex items-center justify-center pb-4">
        <button
          type="button"
          className="items-center font-medium text-[0.9rem] text-black w-[5rem] h-[1.8rem] bg-gray-200 border-transparent rounded btn btn-xs"
          onClick={() => logOut()}
        >
          로그아웃
        </button>
        <button
          type="button"
          className="items-center font-medium text-[0.9rem] text-black w-[5rem] h-[1.8rem] bg-gray-200 border-transparent rounded btn btn-xs"
          onClick={() => withdrawUser()}
        >
          회원탈퇴
        </button>
      </div>
    </div>
  );
};

export default Profile;
