import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

type Reservation = {
  roomId: number;
  participants: string[];
};

type GroupReservationStore = {
  reservationStatus: { [key: string]: Reservation };
  actions: {
    setGroupReservation: (
      key: string,
      roomId: number,
      participants: string[]
    ) => void;
    resetGroupReservationStore: () => void;
  };
};

const initialReservationStatus: { [key: string]: Reservation } = {};

const useGroupReservationStore = create<GroupReservationStore>(set => ({
  reservationStatus: initialReservationStatus,

  actions: {
    setGroupReservation: (
      key: string,
      roomId: number,
      participants: string[]
    ) => {
      if (roomId === null) {
        set(state => {
          const { [key]: ignoredKey, ...newReservationStatus } =
            state.reservationStatus;
          return { reservationStatus: newReservationStatus };
        });
      } else {
        set(state => {
          const newReservation = { roomId, participants };

          return {
            reservationStatus: {
              ...state.reservationStatus,
              [key]: newReservation,
            },
          };
        });
      }
    },
    resetGroupReservationStore: () =>
      set(() => ({ reservationStatus: initialReservationStatus })),
  },
}));

export const useGroupReservation = (key: string) =>
  useGroupReservationStore(state => state.reservationStatus[key]);
export const useGroupReservationActions = () =>
  useGroupReservationStore(state => state.actions, shallow);
