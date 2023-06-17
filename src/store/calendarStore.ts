import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { create } from 'zustand';
import dayjs, { Dayjs } from 'dayjs';
import { shallow } from 'zustand/shallow';

dayjs.extend(isSameOrBefore);
type Week = {
  date: string;
  dayOfWeek: string;
};

const today: Dayjs = dayjs();
// const startOfWeek: number = today.startOf('week').valueOf();

const weeks: { date: string; dayOfWeek: string }[] = Array.from(
  { length: 21 },
  (_, i) => {
    const currentDate: Dayjs = today.add(i, 'day');
    const date: string = currentDate.format('YYYY-MM-DD');
    const dayOfWeek: string = currentDate.format('ddd');
    return { date, dayOfWeek };
  }
);

const startTime = dayjs().startOf('day').set('hour', 0).set('minute', 0);
const endTime = dayjs().startOf('day').set('hour', 23).set('minute', 30);
const timeSlots: string[] = [];

let currentTime = startTime;

while (currentTime.isSameOrBefore(endTime)) {
  timeSlots.push(currentTime.format('HH:mm'));
  currentTime = currentTime.add(30, 'minute');
}

// 한 칸마다 해당 날짜/시간, 유저가 예약한건지 아닌지, 방이 있다면 그 방 번호와 참여자가 저장됨
// 그룹이 바뀌면 쓸모없어짐
type Reservation = {
  userReserved: boolean;
  roomId: number;
  participants: string[];
};

type CalendarStore = {
  weeks: Week[];
  timeSlots: string[];
  reservationStatus: { [key: string]: Reservation };

  updateReservation: (
    key: string,
    update: (reservation: Reservation) => Reservation
  ) => void;

  actions: {
    setReservationUserReservedStatus: (
      key: string,
      userReserved: boolean
    ) => void;
    setReservationRoomId: (key: string, roomId: number) => void;
    setReservationParticipants: (key: string, participants: string[]) => void;
  };
};

const updateReservation = (
  state: CalendarStore,
  key: string,
  update: (reservation: Reservation) => Reservation
) => {
  const currentReservation = state.reservationStatus[key];
  let newReservation;

  if (currentReservation) {
    newReservation = update(currentReservation); // update the reservation
  } else {
    const defaultReservation: Reservation = {
      userReserved: false,
      roomId: -1,
      participants: [],
    };
    newReservation = update(defaultReservation); // create a new reservation
  }

  return {
    reservationStatus: { ...state.reservationStatus, [key]: newReservation },
  };
};

const initialReservationStatus: { [key: string]: Reservation } = {};

const useCalendarStore = create<CalendarStore>(set => ({
  weeks,
  timeSlots,
  reservationStatus: initialReservationStatus,

  updateReservation: (
    key: string,
    update: (reservation: Reservation) => Reservation
  ) => {
    set(state => updateReservation(state, key, update));
  },

  actions: {
    setReservationUserReservedStatus: (key: string, userReserved: boolean) => {
      set(state =>
        updateReservation(state, key, reservation => ({
          ...reservation,
          userReserved,
        }))
      );
    },
    setReservationRoomId: (key: string, roomId: number) => {
      set(state =>
        updateReservation(state, key, reservation => ({
          ...reservation,
          roomId,
        }))
      );
    },
    setReservationParticipants: (key: string, participants: string[]) => {
      set(state =>
        updateReservation(state, key, reservation => ({
          ...reservation,
          participants,
        }))
      );
    },
  },
}));

export const useWeeks = () => useCalendarStore(state => state.weeks);
export const useTimeSlots = () => useCalendarStore(state => state.timeSlots);
export const useReservation = (key: string) =>
  useCalendarStore(state => state.reservationStatus[key]);
export const useCalendarActions = () =>
  useCalendarStore(state => state.actions, shallow);
