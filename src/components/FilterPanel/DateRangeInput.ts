import { todayISO } from '../../features/booking/booking';
import { Control, IsoDate } from '../../types';
import { h } from '../../utils/dom';
import { parseDateInput } from '../../utils/parse';
import './FilterPanel.scss';

export const createDateRangeInput = (
  onCheckInChange: (value: IsoDate | null) => void,
  onCheckOutChange: (value: IsoDate | null) => void,
): Control => {
  const today = todayISO();
  const makeInput = (id: string, label: string) =>
    h('input', { id, type: 'date', class: 'filters__input', min: today, 'aria-label': label });

  const checkIn = makeInput('filter-checkin', 'Дата заезда');
  const checkOut = makeInput('filter-checkout', 'Дата выезда');

  checkIn.addEventListener('input', () => onCheckInChange(parseDateInput(checkIn.value)));
  checkOut.addEventListener('input', () => onCheckOutChange(parseDateInput(checkOut.value)));

  const makeSubfield = (text: string, input: HTMLElement) =>
    h('label', { class: 'filters__subfield' }, h('span', { class: 'filters__text' }, text), input);

  return {
    element: h(
      'div',
      { class: 'filters__field' },
      h('div', { class: 'filters__range' }, makeSubfield('Заезд', checkIn), makeSubfield('Выезд', checkOut)),
    ),
    sync: (state) => {
      const checkInValue = state.checkIn ?? '';
      if (checkIn.value !== checkInValue) checkIn.value = checkInValue;

      const minCheckOut = state.checkIn && state.checkIn > today ? state.checkIn : today;
      if (checkOut.min !== minCheckOut) checkOut.min = minCheckOut;

      const checkOutValue = state.checkOut ?? '';
      if (checkOut.value !== checkOutValue) checkOut.value = checkOutValue;
    },
  };
};
