import { Link, redirect, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import GroupMakeModal from './components/GroupMakeModal';
import { useUser, useIsLoggedIn, useUserActions } from './store/userStore';
import Calendar from './components/Calendar/Calendar';
import Ranking from './components/Ranking';
import Timer from './components/Timer';
import GroupSearchModal from './components/GroupSearchModal';
import TodoList from './components/Todo/TodoList';
import GroupJoinModal from './components/GroupJoinModal';

const groupId = 77;

function App() {
  const user = useUser();
  const isLoggedIn = useIsLoggedIn();
  const { setIsLoggedIn, reset } = useUserActions();
  const [, , removeAccessTokenCookies] = useCookies(['accessToken']);
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

  return (
    <div>
      <h1 className="text-center">메인 페이지</h1>
      {isLoggedIn ? (
        <>
          <div>{user.name}</div>
          <button type="button" className="text-center btn" onClick={logOut}>
            로그아웃
          </button>
        </>
      ) : (
        <Link to="/login">
          <button type="button" className="text-center btn">
            로그인
          </button>
        </Link>
      )}

      {isGroupPath && <GroupJoinModal joinPath={location[0]} />}
      <GroupMakeModal />
      <GroupSearchModal />
      <br />
      <Ranking groupId={groupId} />
      <TodoList />
      <Timer reservedTime={new Date(Date.now() + 305000).toISOString()} />
      <Calendar groupId={groupId} />
    </div>
  );
}

export default App;
