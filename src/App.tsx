import { Link, redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Modal from './components/ModalMain';
import { useUser, useIsLoggedIn, useUserActions } from './store/useStore';
import Calendar from './components/Calendar/Calendar';
import Ranking from './components/Ranking';
import Timer from './components/Timer';
import GroupSearchModal from './components/GroupSearchModal';
import TodoList from './components/ChatTodo/TodoList';

function App() {
  const user = useUser();
  const isLoggedIn = useIsLoggedIn();
  const { setIsLoggedIn, reset } = useUserActions();
  const [, , removeAccessTokenCookies] = useCookies(['accessToken']);
  const [, , removeRefreshTokenCookies] = useCookies(['refreshToken']);

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
          <button type="button" className="btn text-center" onClick={logOut}>
            로그아웃
          </button>
        </>
      ) : (
        <Link to="/login">
          <button type="button" className="btn text-center">
            로그인
          </button>
        </Link>
      )}
      <Modal />
      <GroupSearchModal />
      <br />
      <Ranking />
      <TodoList />
      <Timer reservedTime={new Date(Date.now() + 605000).toISOString()} />
      <Calendar />
    </div>
  );
}

export default App;
