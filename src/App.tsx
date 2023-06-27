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
    <>
      <div className="grid m-10 gap-x-10 gap-y-5 grid-rows-container grid-cols-container w-max-full h-max-full">
        <div className="row-span-2 flex flex-col flex-grow">
          <Logo
            className="mb-8 w-ranking_todo min-w-leftbar max-w-leftbar"
            width="w-ranking_todo min-w-leftbar max-w-leftbar"
            height="90"
          />
          <Ranking />
          <TodoList />
        </div>
        <div className="Navigator flex justify-between max-w-calendar">
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
          <div className="flex">
            <div className="flex">
              <GroupsList />
            </div>
          </div>
          <Timer />
        </div>
        <div className="self-start col-start-2 col-end-3 row-start-2 row-end-3 overflow-hidden rounded-2xl bg-calendar max-w-calendar">
          <Calendar />
        </div>
      </div>
      <footer className="p-10 footer footer-center bg-primary text-primary-content">
        <div>
          <p className="font-bold">
            리더스 푸르넷 공부방 - 뽀독뽀독 독서실 <br />
          </p>
          <p>
            주소 : 광주광역시 광산구 도산동 남동길 30번길 13 | 사업자 등록 번호
            : 865-91-01383 | 대표 번호 : 010-3649-3666 (원장)
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
