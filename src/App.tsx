import { Link } from 'react-router-dom';
import Modal from './components/ModalMain';
import { getUsers } from './utils/fetcher';

export async function loader() {
  const users = await getUsers();
  return users;
}

function App() {
  return (
    <div>
      <h1 className="text-center">메인 페이지</h1>
      <Link to="/login">
        <button type="button" className="btn text-center">
          로그인
        </button>
      </Link>
      <Modal />
    </div>
  );
}

export default App;
