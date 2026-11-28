import { MONTHS_GENITIVE_RU, MONTHS_RU, WEEKDAYS_RU } from '../../features/filtering/constants';
import {
  AvailabilityCalendarComponent,
  AvailabilityCalendarState,
  BookingReason,
  BusyDateEntry,
  BusyNoticeState,
  DayCellData,
  IsoDate,
  YearMonth,
} from '../../types';
import { h, svg } from '../../utils/dom';
import './AvailabilityCalendar.scss';

const pad2 = (value: number): string => String(value).padStart(2, '0');

const toIsoDate = (year: number, monthIndex0: number, day: number): IsoDate =>
  `${year}-${pad2(monthIndex0 + 1)}-${pad2(day)}` as IsoDate;

const getSystemToday = (): IsoDate => {
  const now = new Date();

  return toIsoDate(now.getFullYear(), now.getMonth(), now.getDate());
};

const resolveToday = (today?: IsoDate): IsoDate => today ?? getSystemToday();

const toMonthKey = (iso: IsoDate): string => iso.slice(0, 7);

const parseMonthKey = (monthKey: string): YearMonth => {
  const [yearStr, monthStr] = monthKey.split('-');
  const rawMonth = Number(monthStr);
  const monthIndex0 = Number.isInteger(rawMonth) && rawMonth >= 1 && rawMonth <= 12 ? rawMonth - 1 : 0;

  return {
    year: Number(yearStr) || new Date().getFullYear(),
    monthIndex0,
  };
};

const shiftMonthKey = (monthKey: string, delta: number): string => {
  const { year, monthIndex0 } = parseMonthKey(monthKey);
  const shifted = new Date(Date.UTC(year, monthIndex0 + delta, 1));

  return `${shifted.getUTCFullYear()}-${pad2(shifted.getUTCMonth() + 1)}`;
};

const formatMonthTitle = (monthKey: string): string => {
  const { year, monthIndex0 } = parseMonthKey(monthKey);

  return `${MONTHS_RU[monthIndex0]} ${year}`;
};

const formatRuDate = (iso: IsoDate): string => {
  const [yearStr, monthStr, dayStr] = iso.split('-');
  const rawMonth = Number(monthStr);
  const monthIndex0 = Number.isInteger(rawMonth) && rawMonth >= 1 && rawMonth <= 12 ? rawMonth - 1 : 0;

  return `${Number(dayStr)} ${MONTHS_GENITIVE_RU[monthIndex0]} ${Number(yearStr)}`;
};

const stripBusyPrefix = (reason: BookingReason): string => reason.replace(/^Занято:\s*/i, '');

const formatNoticeReason = (reason: BookingReason): string => (/^Занято:/i.test(reason) ? reason : `Занято: ${reason}`);

const buildBusyAriaLabel = (formattedDate: string, reason: BookingReason): string =>
  reason.startsWith('Занято:') ? `${formattedDate} — ${reason}` : `${formattedDate} — Занято: ${reason}`;

const buildBusyNotice = (
  inspectedBusyDate: IsoDate | null,
  bookedDates: Record<IsoDate, BookingReason>,
): BusyNoticeState | null => {
  if (!inspectedBusyDate) {
    return null;
  }

  const reason = bookedDates[inspectedBusyDate];
  if (!reason) {
    return null;
  }

  return {
    iso: inspectedBusyDate,
    formattedDate: formatRuDate(inspectedBusyDate),
    reasonText: formatNoticeReason(reason),
  };
};

const getAvailableMonths = (bookedDates: Record<IsoDate, BookingReason>, today: IsoDate): string[] => {
  const monthKeys = new Set<string>([toMonthKey(today)]);

  for (const iso of Object.keys(bookedDates)) {
    monthKeys.add(iso.slice(0, 7));
  }

  return Array.from(monthKeys).sort();
};

const getInitialMonth = (availableMonths: string[], today: IsoDate): string => {
  const currentMonth = toMonthKey(today);

  return availableMonths.includes(currentMonth) ? currentMonth : (availableMonths[0] ?? currentMonth);
};

const normalizeCalendarState = (
  nextState: AvailabilityCalendarState,
  fallbackToday?: IsoDate,
): Required<AvailabilityCalendarState> => ({
  apartment: nextState.apartment,
  selectedDates: nextState.selectedDates ?? [],
  today: resolveToday(nextState.today ?? fallbackToday),
});

const resolveActiveMonth = (currentActiveMonth: string, availableMonths: readonly string[], today: IsoDate): string =>
  availableMonths.includes(currentActiveMonth) ? currentActiveMonth : getInitialMonth([...availableMonths], today);

const buildDayCell = (
  iso: IsoDate,
  dayNumber: number,
  today: IsoDate,
  bookedDates: Record<IsoDate, BookingReason>,
  selectedSet: ReadonlySet<IsoDate>,
  inspectedBusyDate: IsoDate | null,
): DayCellData => {
  const formattedDate = formatRuDate(iso);

  if (iso < today) {
    return {
      kind: 'day',
      iso,
      dayNumber,
      isPast: true,
      ariaLabel: `${formattedDate} — прошла`,
    };
  }

  const busyReason = bookedDates[iso];
  const isBusy = Boolean(busyReason);
  const isSelected = !isBusy && selectedSet.has(iso);
  const isInspected = isBusy && inspectedBusyDate === iso;

  return {
    kind: 'day',
    iso,
    dayNumber,
    isPast: false,
    isBusy,
    isSelected,
    isInspected,
    statusLabel: isBusy ? 'занято' : 'своб.',
    ariaLabel: isBusy && busyReason ? buildBusyAriaLabel(formattedDate, busyReason) : `${formattedDate} — свободно`,
  };
};

const buildMonthCells = (
  monthKey: string,
  today: IsoDate,
  bookedDates: Record<IsoDate, BookingReason>,
  selectedDates: readonly IsoDate[],
  inspectedBusyDate: IsoDate | null,
): DayCellData[] => {
  const { year, monthIndex0 } = parseMonthKey(monthKey);
  const firstWeekdayMon0 = (new Date(Date.UTC(year, monthIndex0, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, monthIndex0 + 1, 0)).getUTCDate();
  const totalCells = Math.ceil((firstWeekdayMon0 + daysInMonth) / 7) * 7;
  const trailingEmptyCount = totalCells - (firstWeekdayMon0 + daysInMonth);
  const selectedSet = new Set<IsoDate>(selectedDates);

  const leadingEmpty: DayCellData[] = Array.from({ length: firstWeekdayMon0 }, () => ({ kind: 'empty' }));
  const trailingEmpty: DayCellData[] = Array.from({ length: trailingEmptyCount }, () => ({ kind: 'empty' }));

  const days: DayCellData[] = Array.from({ length: daysInMonth }, (_, index) => {
    const dayNumber = index + 1;
    const iso = toIsoDate(year, monthIndex0, dayNumber);

    return buildDayCell(iso, dayNumber, today, bookedDates, selectedSet, inspectedBusyDate);
  });

  return [...leadingEmpty, ...days, ...trailingEmpty];
};

const getMonthBusyEntries = (monthKey: string, bookedDates: Record<IsoDate, BookingReason>): BusyDateEntry[] =>
  Object.entries(bookedDates)
    .filter(([iso]) => iso.startsWith(`${monthKey}-`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([iso, reason]) => ({
      iso: iso as IsoDate,
      formattedDate: formatRuDate(iso as IsoDate),
      reason: stripBusyPrefix(reason),
    }));

const getDayClasses = (cell: DayCellData): string => {
  const classes = ['calendar__day'];
  if (cell.isPast) classes.push('calendar__day--past');
  else if (cell.isBusy) classes.push('calendar__day--busy');
  else classes.push('calendar__day--free');

  if (cell.isSelected) classes.push('calendar__day--selected');
  if (cell.isInspected) classes.push('calendar__day--inspected');

  return classes.join(' ');
};

/* --- Функции построения DOM --- */

const createChevronSvg = (direction: 'left' | 'right'): SVGElement =>
  svg(
    'svg',
    {
      class: 'calendar__nav-icon',
      width: 24,
      height: 24,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'aria-hidden': 'true',
    },
    svg('path', { d: direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6' }),
  );

const createLegend = (): HTMLElement =>
  h(
    'ul',
    { class: 'calendar__legend', 'aria-label': 'Обозначения статусов дат' },
    h(
      'li',
      { class: 'calendar__legend-item calendar__legend-item--free' },
      svg(
        'svg',
        {
          class: 'calendar__legend-icon',
          width: 24,
          height: 24,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'aria-hidden': 'true',
        },
        svg('circle', { cx: 12, cy: 12, r: 10 }),
        svg('path', { d: 'm9 12 2 2 4-4' }),
      ),
      h('span', {}, 'Свободно'),
    ),
    h(
      'li',
      { class: 'calendar__legend-item calendar__legend-item--busy' },
      svg(
        'svg',
        {
          class: 'calendar__legend-icon',
          width: 24,
          height: 24,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'aria-hidden': 'true',
        },
        svg('path', { d: 'M4.929 4.929 19.07 19.071' }),
        svg('circle', { cx: 12, cy: 12, r: 10 }),
      ),
      h('span', { class: 'calendar__legend-text--crossed' }, 'Занято'),
    ),
    h(
      'li',
      { class: 'calendar__legend-item calendar__legend-item--selected' },
      h('span', { class: 'calendar__legend-swatch', 'aria-hidden': 'true' }),
      h('span', {}, 'Выбранные даты'),
    ),
  );

const createWeekdaysRow = (): HTMLElement =>
  h(
    'ul',
    { class: 'calendar__weekdays', 'aria-hidden': 'true' },
    ...WEEKDAYS_RU.map((dayName) => h('li', { class: 'calendar__weekday' }, dayName)),
  );

const createDayNode = (
  cell: DayCellData,
  onFreeDateClick?: (date: IsoDate) => void,
  onBusyDateClick?: (date: IsoDate) => void,
): HTMLElement => {
  if (cell.kind === 'empty' || !cell.iso || !cell.dayNumber) {
    return h('span', { class: 'calendar__empty', 'aria-hidden': 'true' });
  }

  if (cell.isPast) {
    return h(
      'button',
      {
        type: 'button',
        class: getDayClasses(cell),
        disabled: true,
        'aria-label': cell.ariaLabel ?? '',
      },
      h('span', { class: 'calendar__day-num' }, String(cell.dayNumber)),
    );
  }

  const attrs: Record<string, string> = {
    type: 'button',
    class: getDayClasses(cell),
    'aria-label': cell.ariaLabel ?? '',
  };

  if (!cell.isBusy) {
    attrs['aria-pressed'] = String(Boolean(cell.isSelected));
  }

  const button = h(
    'button',
    attrs,
    h('span', { class: 'calendar__day-num' }, String(cell.dayNumber)),
    h('span', { class: 'calendar__day-status' }, cell.statusLabel ?? ''),
  ) as HTMLButtonElement;

  const targetDate = cell.iso;
  button.addEventListener('click', () => {
    if (cell.isBusy) {
      onBusyDateClick?.(targetDate);
      return;
    }
    onFreeDateClick?.(targetDate);
  });

  return button;
};

const createSummaryItem = (entry: BusyDateEntry): HTMLElement =>
  h(
    'li',
    { class: 'calendar__summary-item' },
    h('time', { class: 'calendar__summary-date', datetime: entry.iso }, entry.formattedDate),
    h('span', { class: 'calendar__summary-sep', 'aria-hidden': 'true' }, '—'),
    h('span', { class: 'calendar__summary-note' }, entry.reason),
  );

/** Компонент Календарь */
export const createAvailabilityCalendar = (
  initialState: AvailabilityCalendarState,
  onSelectDate?: (date: IsoDate) => void,
): AvailabilityCalendarComponent => {
  let state: Required<AvailabilityCalendarState> = normalizeCalendarState(initialState);
  let availableMonths = getAvailableMonths(state.apartment.bookedDates, state.today);
  let activeMonth = getInitialMonth(availableMonths, state.today);
  let inspectedBusyDate: IsoDate | null = null;

  const monthTitleEl = h('h3', {
    id: 'calendar-month',
    class: 'calendar__month',
  });

  const prevBtn = h(
    'button',
    { type: 'button', class: 'calendar__nav-btn', 'aria-label': 'Предыдущий месяц' },
    createChevronSvg('left'),
  ) as HTMLButtonElement;

  const nextBtn = h(
    'button',
    { type: 'button', class: 'calendar__nav-btn', 'aria-label': 'Следующий месяц' },
    createChevronSvg('right'),
  ) as HTMLButtonElement;

  const daysGridEl = h('div', { class: 'calendar__days' });
  const noticeDateEl = h('strong', { class: 'calendar__notice-date' });
  const noticeReasonEl = h('span', { class: 'calendar__notice-reason' });
  const noticeHideBtn = h('button', { type: 'button', class: 'calendar__notice-close' }, 'Скрыть') as HTMLButtonElement;

  const noticeEl = h(
    'div',
    { class: 'calendar__notice', role: 'status', 'aria-live': 'polite' },
    h('p', { class: 'calendar__notice-text' }, noticeDateEl, ' ', noticeReasonEl),
    noticeHideBtn,
  );

  const summaryTitleEl = h('h4', { class: 'calendar__summary-title' });
  const summaryListEl = h('ul', { class: 'calendar__summary-list' });

  const renderNotice = (notice: BusyNoticeState | null): void => {
    if (!notice) {
      noticeEl.hidden = true;
      return;
    }

    noticeEl.hidden = false;
    noticeDateEl.textContent = `${notice.formattedDate}:`;
    noticeReasonEl.textContent = notice.reasonText;
  };

  const render = (): void => {
    const { today, selectedDates, apartment } = state;
    const { bookedDates } = apartment;

    monthTitleEl.textContent = formatMonthTitle(activeMonth);
    prevBtn.disabled = activeMonth <= availableMonths[0];
    nextBtn.disabled = activeMonth >= availableMonths[availableMonths.length - 1];

    const cells = buildMonthCells(activeMonth, today, bookedDates, selectedDates, inspectedBusyDate);
    daysGridEl.replaceChildren(
      ...cells.map((cell) =>
        createDayNode(
          cell,
          (freeDate) => {
            onSelectDate?.(freeDate);
          },
          (busyDate) => {
            inspectedBusyDate = busyDate;
            render();
          },
        ),
      ),
    );

    renderNotice(buildBusyNotice(inspectedBusyDate, bookedDates));

    const busyEntries = getMonthBusyEntries(activeMonth, bookedDates);
    summaryTitleEl.textContent = `Занятые даты в этом месяце (${busyEntries.length})`;
    summaryListEl.replaceChildren(...busyEntries.map(createSummaryItem));
  };

  noticeHideBtn.addEventListener('click', () => {
    inspectedBusyDate = null;
    render();
  });

  prevBtn.addEventListener('click', () => {
    activeMonth = shiftMonthKey(activeMonth, -1);
    render();
  });

  nextBtn.addEventListener('click', () => {
    activeMonth = shiftMonthKey(activeMonth, 1);
    render();
  });

  const element = h(
    'section',
    { class: 'calendar', 'aria-labelledby': 'calendar-title' },
    h('h2', { id: 'calendar-title', class: 'calendar__heading' }, 'Календарь доступности'),
    h(
      'div',
      { class: 'calendar__card' },
      h(
        'header',
        { class: 'calendar__header' },
        h(
          'div',
          { class: 'calendar__title-group' },
          monthTitleEl,
          h('p', { class: 'calendar__hint' }, 'Нажмите на свободную дату для выбора заезда и выезда'),
        ),
        h('nav', { class: 'calendar__nav', 'aria-label': 'Навигация по месяцам' }, prevBtn, nextBtn),
      ),
      createLegend(),
      h(
        'div',
        {
          class: 'calendar__grid-wrapper',
          role: 'group',
          'aria-labelledby': 'calendar-month',
        },
        createWeekdaysRow(),
        daysGridEl,
      ),
      noticeEl,
      h('footer', { class: 'calendar__summary' }, summaryTitleEl, summaryListEl),
    ),
  ) as HTMLElement;

  render();

  return {
    element,
    sync: (nextState) => {
      state = normalizeCalendarState({ ...state, ...nextState }, state.today);
      availableMonths = getAvailableMonths(state.apartment.bookedDates, state.today);
      activeMonth = resolveActiveMonth(activeMonth, availableMonths, state.today);

      if (inspectedBusyDate && !state.apartment.bookedDates[inspectedBusyDate]) {
        inspectedBusyDate = null;
      }

      render();
    },
  };
};
