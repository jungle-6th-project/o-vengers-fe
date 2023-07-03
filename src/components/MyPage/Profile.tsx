import { useUser } from '@/store/userStore';
import WithdrawalModal from './WithdrawalModal';
import useLogout from '@/utils/utils';

const Profile = () => {
  const user = useUser();
  const logout = useLogout();

  return (
    <div className="grid grid-rows-profile card card-bordered h-profile min-h-profile max-h-profile p-4 items-center border-[#D9D9D9] w-ranking_todo min-w-leftbar max-w-leftbar bg-[#FAFAFA] rounded-md justify-items-center">
      <div className="justify-center mx-auto avatar">
        <div
          className="w-full mask mask-squircle"
          style={{ maxWidth: '180px' }}
        >
          <img src={user.profile} alt={user.name} />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <span className="text-[1.3rem] font-semibold text-black profile-name">
          {user.name}
        </span>
      </div>
      <div className="flex items-center justify-center">
        <button
          type="button"
          className="items-center font-medium text-[0.9rem] w-[5rem] h-[1.8rem] bg-[#E7E7E7] text-black hover:bg-[#C7C7C7] rounded-md btn btn-xs mr-1"
          onClick={logout}
        >
          로그아웃
        </button>
        <WithdrawalModal />
      </div>
    </div>
  );
};

export default Profile;
