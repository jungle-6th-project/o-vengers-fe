import { Link, redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import GroupMakeModal from './components/GroupMakeModal';
import { useUser, useIsLoggedIn, useUserActions } from './store/userStore';
import Calendar from './components/Calendar/Calendar';
import Ranking from './components/Ranking';
import Timer from './components/Timer';
import GroupSearchModal from './components/GroupSearchModal';
import GroupList from './components/Groups/GrouptList';
import TodoList from './components/Todo/TodoList';

function App() {
  const user = useUser();
  const isLoggedIn = useIsLoggedIn();
  const { setIsLoggedIn, reset } = useUserActions();
  const [token, , removeAccessTokenCookies] = useCookies(['accessToken']);
  const [, , removeRefreshTokenCookies] = useCookies(['refreshToken']);

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
      <GroupMakeModal />
      <GroupSearchModal />
      <GroupList />
      <br />
      <Ranking />
      <TodoList />
      <Timer reservedTime={new Date(Date.now() + 605000).toISOString()} />
      <Calendar />
    </div>
  );
}

export default App;
