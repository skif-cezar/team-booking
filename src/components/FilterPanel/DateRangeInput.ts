import { todayISO } from '../../features/booking/booking';
import { Control, IsoDate } from '../../types';
import { h } from '../../utils/dom';
import { parseDateInput } from '../../utils/parse';

export const createDateRangeInput = (
  onCheckInChange: (value: IsoDate | null) => void,
  onCheckOutChange: (value: IsoDate | null) => void,
): Control[] => {
  const today = todayISO();
  const makeInput = (id: string, label: string) =>
    h('input', { id: id, type: 'date', class: 'filters__input', min: today, 'aria-label': label });

  const checkIn = makeInput('filter-checkin', 'Дата заезда');
  const checkOut = makeInput('filter-checkout', 'Дата выезда');
  checkIn.addEventListener('input', () => onCheckInChange(parseDateInput(checkIn.value)));
  checkOut.addEventListener('input', () => onCheckOutChange(parseDateInput(checkOut.value)));

  return [
    {
      element: h('label', { class: 'filters__field' }, h('span', null, 'Заезд'), checkIn),
      sync: (state) => {
        const value = state.checkIn ?? '';
        if (checkIn.value !== value) checkIn.value = value;
        checkOut.min = state.checkIn && state.checkIn > today ? state.checkIn : today;
      },
    },
    {
      element: h('label', { class: 'filters__field' }, h('span', null, 'Выезд'), checkOut),
      sync: (state) => {
        const value = state.checkOut ?? '';
        if (checkOut.value !== value) checkOut.value = value;
      },
    },
  ];
};
