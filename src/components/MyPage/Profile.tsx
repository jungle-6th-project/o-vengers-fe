import { useUser } from '@/store/userStore';

const Profile = () => {
  const user = useUser();
  return (
    <div className="absolute p-1 border-gray-200 border-[1px] rounded-[8px] card w-[185px] h-[252px] left-[33px] top-[91px]">
      <div className="avatar">
        <div className="relative rounded-full w-[132px] h-[132px] left-[27px] top-[30px]">
          <img src={user.profile} alt="Profile" />
        </div>
      </div>
      <div className="absolute items-center text-l font-semibold text-black profile-name top-[178px] left-[71px]">
        {user.name}
      </div>
      <button
        type="button"
        className="absolute items-center font-medium text-xs text-black w-[70px] h-[10px] bg-gray-200 border-transparent rounded btn btn-xs left-[57.5px] top-[205px]"
      >
        로그아웃
      </button>
    </div>
  );
};

export default Profile;
