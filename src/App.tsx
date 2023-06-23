import { Link, redirect, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import GroupMakeModal from './components/GroupMakeModal';
import { useUserActions } from './store/userStore';
import Calendar from './components/Calendar/Calendar';
import Ranking from './components/Ranking/Ranking';
import Timer from './components/Timer/Timer';
import GroupSearchModal from './components/GroupSearchModal/GroupSearchModal';
import GroupList from './components/Groups/GrouptList';
import TodoList from './components/Todo/TodoList';
import GroupJoinModal from './components/GroupJoinModal';
import { ReactComponent as Logo } from '@/assets/bbodog_log_svg.svg';

function App() {
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
    <>
      <div className="grid m-10 gap-x-10 grid-rows-container grid-cols-container">
        <div className="row-span-3 col-todo">
          <Logo width="200" height="150" />
          <Ranking />
          <TodoList />
        </div>
        <div className="flex justify-between mb-5">
          <div className="flex">
            <div className="flex flex-col justify-between mr-3 btn-3 h-groupList">
              {isGroupPath && <GroupJoinModal joinPath={location[1]} />}
              <GroupMakeModal />
              <GroupSearchModal />
              <Link to="/mypage">
                <button type="button" className="btn btn-square">
                  MY
                </button>
              </Link>
            </div>

            <div className="flex">
              <GroupList />
            </div>
          </div>
          <Timer />
        </div>
        <div className="self-start col-start-2 col-end-3 row-start-2 row-end-3">
          <Calendar />
        </div>
      </div>
      <button type="button" onClick={() => logOut()}>
        로그아웃
      </button>
    </>
  );
}

export default App;
