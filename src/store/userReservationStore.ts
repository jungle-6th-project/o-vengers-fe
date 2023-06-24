import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

type Reservation = {
  groupId: number;
  roomId: number;
  participants: string[];
};

type UserReservationStore = {
  reservationStatus: { [key: string]: Reservation };
  actions: {
    setUserReservation: (
      key: string,
      groupId: number,
      roomId: number,
      participants: string[]
    ) => void;
    removeUserReservation: (key: string) => void;
    removeUserGroupReservation: (groupId: number) => void;
  };
};

const initialReservationStatus: { [key: string]: Reservation } = {};

const useUserReservationStore = create<UserReservationStore>(set => ({
  reservationStatus: initialReservationStatus,

  actions: {
    setUserReservation: (
      key: string,
      groupId: number,
      roomId: number,
      participants: string[]
    ) => {
      set(state => {
        const newReservation = { groupId, roomId, participants };

        return {
          reservationStatus: {
            ...state.reservationStatus,
            [key]: newReservation,
          },
        };
      });
    },
    removeUserReservation: (key: string) => {
      set(state => {
        const { [key]: ignoredKey, ...newReservationStatus } =
          state.reservationStatus;
        return { reservationStatus: newReservationStatus };
      });
    },
    removeUserGroupReservation: (groupId: number) => {
      set(state => {
        const newReservationStatus = Object.fromEntries(
          Object.entries(state.reservationStatus).filter(
            ([, value]) => value.groupId !== groupId
          )
        );

        return { reservationStatus: newReservationStatus };
      });
    },
  },
}));

export const useUserReservation = (key: string) =>
  useUserReservationStore(state => state.reservationStatus[key]);

export const useUserReservationActions = () =>
  useUserReservationStore(state => state.actions, shallow);
