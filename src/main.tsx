import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App';
import Login from './routes/Login';
import KakaoCallback from './routes/KaKaoCallback';
import Study from './routes/Study';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/kakao_redirect',
    element: <KakaoCallback />,
  },
  {
    path: '/study/:roomId',
    element: <Study />,
  },
  {
    path: '/:joinPath',
    element: <App />,
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
