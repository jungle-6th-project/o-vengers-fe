import { useUser } from '@/store/userStore';

const Profile = () => {
  const user = useUser();
  return (
    <div className="bg-white card profile-container">
      <div className="avatar">
        <div className="rounded-full">
          <img src={user.profile} alt="Profile" />
        </div>
      </div>
      <div className="profile-name">{user.name}</div>
      <button type="button" className="border-transparent btn btn-sm">
        로그아웃
      </button>
    </div>
  );
};

export default Profile;
