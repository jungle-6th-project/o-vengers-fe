import { Link, redirect, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useSelectedGroupId } from './store/groupStore';
import GroupMakeModal from './components/GroupMakeModal';
import { useIsLoggedIn, useUserActions } from './store/userStore';
import Calendar from './components/Calendar/Calendar';
import Ranking from './components/Ranking';
import Timer from './components/Timer';
import GroupSearchModal from './components/GroupSearchModal';
import GroupList from './components/Groups/GrouptList';
import TodoList from './components/Todo/TodoList';
import GroupJoinModal from './components/GroupJoinModal';

function App() {
  const groupId = useSelectedGroupId();
  const isLoggedIn = useIsLoggedIn();
  const { setIsLoggedIn, reset } = useUserActions();
  const [token, , removeAccessTokenCookies] = useCookies(['accessToken']);
  const [, , removeRefreshTokenCookies] = useCookies(['refreshToken']);
  const location = useLocation().pathname.split('/').filter(Boolean);

  const isGroupPath = !(location.length < 1);

  const logOut = async () => {
    await removeAccessTokenCookies('accessToken');
    await removeRefreshTokenCookies('refreshToken');
    await localStorage.removeItem('user');
    await setIsLoggedIn(false);
    await reset();
    await redirect('/');
  };

  axios.defaults.headers.common.Authorization = `Bearer ${token.accessToken}`;
  return (
    <div>
      {isLoggedIn ? (
        <button type="button" className="text-center btn" onClick={logOut}>
          로그아웃
        </button>
      ) : (
        <Link to="/login">
          <button type="button" className="text-center btn">
            로그인
          </button>
        </Link>
      )}

      {isGroupPath && <GroupJoinModal joinPath={location[0]} />}
      <div className="flex">
        <div className="flex flex-col">
          <GroupMakeModal />
          <GroupSearchModal />
        </div>
        <GroupList />
        <Timer reservedTime={new Date(Date.now() + 305000).toISOString()} />
      </div>
      <br />
      <div>
        <Ranking groupId={groupId} />
        <TodoList />
      </div>
      <Calendar groupId={groupId} />
    </div>
  );
}

export default App;
