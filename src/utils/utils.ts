import { useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { QueryClient } from '@tanstack/react-query';
import { useUserActions } from '@/store/userStore';
import { useUserReservationActions } from '@/store/userReservationStore';
import { useSelectedGroupIdActions } from '@/store/groupStore';
import { useGroupReservationActions } from '@/store/groupReservationStore';

const useLogout = () => {
  const { resetUser } = useUserActions();
  const { resetUserReservation } = useUserReservationActions();
  const { resetGroupReservation } = useGroupReservationActions();
  const { resetGroup } = useSelectedGroupIdActions();
  const [, , removeAccessTokenCookies] = useCookies(['accessToken']);
  const [, , removeRefreshTokenCookies] = useCookies(['refreshToken']);

  const logout = useCallback(async () => {
    // remove token cookies
    removeAccessTokenCookies('accessToken');
    removeRefreshTokenCookies('refreshToken');

    // reset zustand stores
    resetUser();
    resetUserReservation();
    resetGroup();
    resetGroupReservation();

    // clear local storage
    localStorage.clear();

    // remove react-query created caches/local storage/session storage
    const queryClient = new QueryClient();
    queryClient.clear();

    // go back to login page
    window.location.href = '/login';
  }, [
    removeAccessTokenCookies,
    removeRefreshTokenCookies,
    resetUser,
    resetUserReservation,
    resetGroup,
    resetGroupReservation,
  ]);

  return logout;
};

export default useLogout;
