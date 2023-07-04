import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';

import GroupMakeModal from './components/GroupMakeModal/GroupMakeModal';
import Calendar from './components/Calendar/Calendar';
import Ranking from './components/Ranking/Ranking';
import Timer from './components/Timer/Timer';
import GroupSearchModal from './components/GroupSearchModal/GroupSearchModal';
import GroupsList from './components/Groups/GroupsList';
import TodoList from './components/Todo/TodoList';
import GroupJoinModal from './components/GroupJoinModal';
import { parseCookies } from './utils/api';
import Loading from './components/Loading/Loading';
import NotificationAlarm from './components/NotificationAlarm';

import { ReactComponent as Logo } from '@/assets/bbodog_log_svg.svg';

function App() {
  const [joinPath, setJoinPath] = useState('');
  const location = useLocation().pathname.split('/').filter(Boolean);
  const isGroupPath = !(location.length < 1) || Boolean(joinPath);

  const [token] = useCookies(['accessToken']);

  axios.defaults.headers.common.Authorization = `Bearer ${token.accessToken}`;

  useEffect(() => {
    const path = localStorage.getItem('joinPath');
    setJoinPath(prevState => (path !== null ? path : prevState));
  }, []);

  const cookies = parseCookies(document.cookie);

  return (
    <>
      {!cookies.accessToken && <Loading />}
      <div className="grid h-screen gap-5 p-10 grid-rows-container grid-cols-container w-max-full h-max-screen">
        <div className="grid row-span-2 gap-3 grid-rows-leftbar">
          <div className="mb-8 w-ranking_todo min-w-leftbar max-w-leftbar h-[90px]">
            <Logo width="100%" height="100%" />
          </div>
          <Ranking />
          <TodoList />
        </div>
        <div className="grid Navigator max-w-calendar grid-cols-navigator">
          <div className="flex flex-col justify-between btn-3 h-groupList min-h-header-min max-h-header-max">
            {isGroupPath && cookies.accessToken && (
              <GroupJoinModal joinPath={location[1] || joinPath} />
            )}
            <GroupMakeModal />
            <GroupSearchModal />
            <Link to="/mypage">
              <button
                type="button"
                className="btn btn-square bg-[#E7E7E7] text-[#5A5A5A] hover:bg-[#C7C7C7]"
              >
                MY
              </button>
            </Link>
          </div>
          <GroupsList />
          <Timer />
        </div>
        <div className="h-full col-start-2 row-start-2 overflow-auto max-w-calendar">
          <Calendar />
        </div>
        <NotificationAlarm />
      </div>
    </>
  );
}

export default App;
