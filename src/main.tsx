import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CookiesProvider } from 'react-cookie';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App';
import Login from './routes/Login';
import KakaoCallback from './routes/KaKaoCallback';
import Study from '@/routes/Study';
import Mypage from '@/routes/Mypage';
import NotFoundErrorPage from './routes/NotFoundErrorPage';
import ErrorPage from './routes/ErrorPage';

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
  },
  {
    path: '/invite/:joinPath',
    element: <App />,
    errorElement: <ErrorPage />,
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

const queryClient = new QueryClient();

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
