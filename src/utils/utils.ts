import { useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { useUserActions } from '@/store/userStore';
import { useUserReservationActions } from '@/store/userReservationStore';
import { useSelectedGroupIdActions } from '@/store/groupStore';
import { useGroupReservationActions } from '@/store/groupReservationStore';

const useLogout = () => {
  const { setIsLoggedIn, reset } = useUserActions();
  const { resetUserReservation } = useUserReservationActions();
  const { resetGroupReservationStore } = useGroupReservationActions();
  const { resetGroup } = useSelectedGroupIdActions();
  const [, , removeAccessTokenCookies] = useCookies(['accessToken']);
  const [, , removeRefreshTokenCookies] = useCookies(['refreshToken']);

  const logout = useCallback(async () => {
    removeAccessTokenCookies('accessToken');
    removeRefreshTokenCookies('refreshToken');
    localStorage.removeItem('fcmToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    reset();
    resetUserReservation();
    resetGroup();
    resetGroupReservationStore();
    window.location.href = '/login';
  }, [
    removeAccessTokenCookies,
    removeRefreshTokenCookies,
    setIsLoggedIn,
    reset,
    resetUserReservation,
    resetGroup,
    resetGroupReservationStore,
  ]);

  return logout;
};

export default useLogout;
