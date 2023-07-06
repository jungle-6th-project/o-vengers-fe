import axios, { AxiosResponse } from 'axios';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  name: string;
  profile: string;
  email: string;
  duration: string;
  memberId: number;
}

interface UserActions {
  setUser: (accessToken: string) => Promise<void>;
  setIsLoggedIn: (isLogged: boolean) => void;
  setVideoNickname: (nickname: string) => void;
  resetUser: () => void;
}

interface UserState {
  user: User;
  isLoggedIn: boolean;
  videoNickname: string;
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
          memberId: 0,
        },
        isLoggedIn: false,
        videoNickname: '',
        actions: {
          setUser: async (accessToken: string) => {
            const url =
              import.meta.env.MODE === 'production'
                ? 'https://www.sangyeop.shop'
                : 'https://www.api-bbodog.shop';
            try {
              const response: AxiosResponse = await axios.get(
                `${url}/api/v1/members`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );

              set({
                user: {
                  ...response.data.data,
                  profile:
                    response.data.data.profile ?? '../../defaultProfile.png',
                },
              });
            } catch (error) {
              console.error(error);
            }
          },
          setIsLoggedIn: isLogged => {
            set({ isLoggedIn: isLogged });
          },
          resetUser: () => {
            set({
              user: {
                name: '',
                profile: '',
                email: '',
                duration: '',
                memberId: 0,
              },
              isLoggedIn: false,
              videoNickname: '',
            });
          },
          setVideoNickname(nickname: string) {
            set({ videoNickname: nickname });
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
export const useVideoNickname = () =>
  useUserStore(state => state.videoNickname);
export const useUserActions = () => useUserStore(state => state.actions);
