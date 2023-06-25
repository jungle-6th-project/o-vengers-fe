import { useUser } from '@/store/userStore';

const Profile = () => {
  const user = useUser();
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
      >
        로그아웃
      </button>
    </div>
  );
};

export default Profile;
