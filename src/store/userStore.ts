import axios, { AxiosResponse } from 'axios';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  name: string;
  profile: string;
  email: string;
  duration: string;
}

interface UserActions {
  setUser: () => Promise<void>;
  setIsLoggedIn: (isLogged: boolean) => void;
  reset: () => void;
}

interface UserState {
  user: User;
  isLoggedIn: boolean;
  actions: UserActions;
}

const useUserStore = create<UserState>()(
  devtools(
    persist(
      set => ({
        user: {
          name: '',
          profile: '',
          email: '',
          duration: '',
        },
        isLoggedIn: false,
        actions: {
          setUser: async () => {
            try {
              const response: AxiosResponse = await axios.get(
                'https://www.sangyeop.shop/api/v1/members'
              );
              set({ user: response.data.data });
            } catch (error) {
              console.error(error);
            }
          },
          setIsLoggedIn: isLogged => {
            set({ isLoggedIn: isLogged });
          },
          reset: () => {
            set({
              user: {
                name: '',
                profile: '',
                email: '',
                duration: '',
              },
            });
          },
        },
      }),
      {
        name: 'user',
        partialize: state =>
          Object.fromEntries(
            Object.entries(state).filter(([key]) => !['actions'].includes(key))
          ),
      }
    )
  )
);

export const useUser = () => useUserStore(state => state.user);
export const useIsLoggedIn = () => useUserStore(state => state.isLoggedIn);
export const useUserActions = () => useUserStore(state => state.actions);
