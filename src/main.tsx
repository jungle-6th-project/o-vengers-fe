import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App, { loader as AppLoader } from './App';
import './index.css';
import Login from './routes/Login';
import KakaoCallback from './routes/KaKaoCallback';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: AppLoader,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/kakao_redirect',
    element: <KakaoCallback />,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <RouterProvider router={router} />
      </CookiesProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
