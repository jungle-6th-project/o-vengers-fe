import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { create } from 'zustand';
import dayjs, { Dayjs } from 'dayjs';

dayjs.extend(isSameOrBefore);

type Week = {
  date: string;
  dayOfWeek: string;
};

const today: Dayjs = dayjs();

const weeks: { date: string; dayOfWeek: string }[] = Array.from(
  { length: 14 },
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

type CalendarStore = {
  weeks: Week[];
  timeSlots: string[];
};

const useCalendarStore = create<CalendarStore>(() => ({
  weeks,
  timeSlots,
}));

export const useWeeks = () => useCalendarStore(state => state.weeks);
export const useTimeSlots = () => useCalendarStore(state => state.timeSlots);
