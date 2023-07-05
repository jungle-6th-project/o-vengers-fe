import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CookiesProvider } from 'react-cookie';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './index.css';
import App from './App';
import Login from './routes/Login';
import Study, { loader as studyLoader } from '@/routes/Study';
import KakaoCallback from './routes/KaKaoCallback';
import Mypage from '@/routes/Mypage';
import NotFoundErrorPage from './routes/NotFoundErrorPage';
import ErrorPage from './routes/ErrorPage';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/kakao_redirect',
    element: <KakaoCallback />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/study/:roomId',
    element: <Study />,
    errorElement: <ErrorPage />,
    loader: studyLoader(queryClient),
  },
  {
    path: '/invite/:joinPath',
    element: <App />,
    errorElement: <ErrorPage />,
    loader: async ({ params }) => {
      const { joinPath } = params;
      localStorage.setItem('joinPath', joinPath ?? '');
      return null;
    },
  },
  {
    path: '/mypage',
    element: <Mypage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <NotFoundErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <RouterProvider router={router} />
      </CookiesProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
