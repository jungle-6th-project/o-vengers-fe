// import React from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from './components/ModalMain';

export async function loader() {
  const res = await axios.get('https://jsonplaceholder.typicode.com/users');
  const data = await res.data;
  await console.log(data);

  return data;
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
