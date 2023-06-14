import { verticalEllipsis } from '../utils/icons';
import { useUser } from '../store';

const GroupEntry = () => {
  const user = useUser();

  return (
    <div className="card w-96 h-96 shadow">
      <div className="card-body">
        <div className="card-actions">
          <div className="avatar-group -space-x-6">
            <div className="avatar">
              <div className="w-12">
                <img alt="profile" src={user.profile} />
              </div>
            </div>
            <div className="avatar">
              <div className="w-12">
                <img alt="profile" src={user.profile} />
              </div>
            </div>
            <div className="avatar">
              <div className="w-12">
                <img alt="profile" src={user.profile} />
              </div>
            </div>
            <div className="avatar placeholder">
              <div className="w-12 bg-gray-300 text-black">
                <span>+99</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-square btn-xs justify-end"
          >
            {verticalEllipsis}
          </button>
        </div>
        <h2 className="card-title">그룹이름</h2>
      </div>
    </div>
  );
};

export default GroupEntry;
