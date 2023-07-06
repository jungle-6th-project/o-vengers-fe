import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

type Reservation = {
  roomId: number;
  profiles: string[];
  participants: number[];
};

type GroupReservationStore = {
  reservationStatus: { [key: string]: Reservation };
  actions: {
    setGroupReservation: (
      key: string,
      roomId: number,
      profiles: string[],
      participants: number[]
    ) => void;
    resetGroupReservation: () => void;
  };
};

const initialReservationStatus: { [key: string]: Reservation } = {};

const useGroupReservationStore = create<GroupReservationStore>(set => ({
  reservationStatus: initialReservationStatus,

  actions: {
    setGroupReservation: (
      key: string,
      roomId: number,
      profiles: string[],
      participants: number[]
    ) => {
      if (roomId === null) {
        // delete reservation
        set(state => {
          const { [key]: ignoredKey, ...newReservationStatus } =
            state.reservationStatus;
          return { reservationStatus: newReservationStatus };
        });
      } else {
        // update reservation
        set(state => {
          const newReservation = { roomId, profiles, participants };

          return {
            reservationStatus: {
              ...state.reservationStatus,
              [key]: newReservation,
            },
          };
        });
      }
    },
    resetGroupReservation: () =>
      set(() => ({ reservationStatus: initialReservationStatus })),
  },
}));

export const useGroupReservation = (key: string) =>
  useGroupReservationStore(state => state.reservationStatus[key]);
export const useGroupReservationActions = () =>
  useGroupReservationStore(state => state.actions, shallow);
