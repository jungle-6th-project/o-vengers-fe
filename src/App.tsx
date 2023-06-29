import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import GroupMakeModal from './components/GroupMakeModal/GroupMakeModal';
import Calendar from './components/Calendar/Calendar';
import Ranking from './components/Ranking/Ranking';
import Timer from './components/Timer/Timer';
import GroupSearchModal from './components/GroupSearchModal/GroupSearchModal';
import GroupsList from './components/Groups/GroupsList';
import TodoList from './components/Todo/TodoList';
import GroupJoinModal from './components/GroupJoinModal';
import { ReactComponent as Logo } from '@/assets/bbodog_log_svg.svg';

function App() {
  const location = useLocation().pathname.split('/').filter(Boolean);
  const isGroupPath = !(location.length < 1);
  const [token, ,] = useCookies(['accessToken']);

  axios.defaults.headers.common.Authorization = `Bearer ${token.accessToken}`;
  return (
    <div className="grid h-screen p-10 gap-x-5 gap-y-5 grid-rows-container grid-cols-container w-max-full h-max-screen">
      <div className="grid row-span-2 gap-3 grid-rows-leftbar">
        <div className="mb-8 w-ranking_todo min-w-leftbar max-w-leftbar h-[90px]">
          <Logo width="100%" height="100%" />
        </div>
        <Ranking />
        <TodoList />
      </div>
      <div className="grid gap-3 Navigator max-w-calendar grid-cols-navigator">
        <div className="flex flex-col justify-between mr-3 btn-3 h-groupList min-h-header-min max-h-header-max">
          {isGroupPath && <GroupJoinModal joinPath={location[1]} />}
          <GroupMakeModal />
          <GroupSearchModal />
          <Link to="/mypage">
            <button type="button" className="btn btn-square">
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
    </div>
  );
}

export default App;
