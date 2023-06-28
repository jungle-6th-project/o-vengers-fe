const MemberProfiles = ({ profiles }: { profiles: string[] }) => {
  return (
    <div className="-space-x-6 avatar-group">
      {profiles.slice(0, 3).map((profile: string) => {
        return (
          <div key={`profile${Math.random()}`} className="w-10 h-10 avatar">
            <div className="w-12">
              <img
                alt="profile"
                src={profile ? `${profile}` : '../../defaultProfile.png'}
              />
            </div>
          </div>
        );
      })}
      {profiles.length > 3 && (
        <div className="w-10 h-10 avatar placeholder">
          <div className="text-black bg-gray-300 ">
            <span>+{profiles.length - 3}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberProfiles;
