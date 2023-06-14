import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { create } from 'zustand';
import dayjs, { Dayjs } from 'dayjs';

dayjs.extend(isSameOrBefore);
type Week = {
  date: string;
  dayOfWeek: string;
};

type CalendarStore = {
  weeks: Week[];
  timeSlots: string[];
};

const today: Dayjs = dayjs();
const startOfWeek: number = today.startOf('week').valueOf();

const weeks: { date: string; dayOfWeek: string }[] = Array.from(
  { length: 7 },
  (_, i) => {
    const currentDate: Dayjs = dayjs(startOfWeek).add(i, 'day');
    const date: string = currentDate.format('DD');
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

const useCalendarStore = create<CalendarStore>(set => ({
  weeks,
  timeSlots,
}));

export const useWeeks = () => useCalendarStore(state => state.weeks);
export const useTimeSlots = () => useCalendarStore(state => state.timeSlots);

// export const useWeeksActions =+
