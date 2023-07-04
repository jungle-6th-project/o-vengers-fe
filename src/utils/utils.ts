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
    await removeAccessTokenCookies('accessToken');
    await removeRefreshTokenCookies('refreshToken');
    await localStorage.clear();
    await setIsLoggedIn(false);
    await reset();
    await resetUserReservation();
    await resetGroup();
    await resetGroupReservationStore();
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
