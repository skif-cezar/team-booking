import { FilterState } from '../../types';
import { DEFAULT_FILTERS } from './constants';

export type Listener = (state: FilterState) => void;

/**
 * Создаёт хранилище (store) состояния фильтров и сортировки
 * по паттерну Observer без мутации предыдущего состояния.
 *
 * @param initial - Начальные значения фильтров (по умолчанию DEFAULT_FILTERS)
 */
export const createStore = (initial: FilterState = DEFAULT_FILTERS) => {
  let state = initial;
  const listeners = new Set<Listener>();

  /** Уведомляет всех активных подписчиков об актуальном состоянии */
  const notify = (): void => {
    listeners.forEach((listener) => listener(state));
  };

  return {
    /** Возвращает текущий снимок состояния фильтров. */
    getState: (): FilterState => state,

    /**
     * Обновляет одно поле фильтра по ключу с проверкой типа значения
     * и оповещает всех подписчиков.
     *
     * @param key - Ключ поля из FilterState ('query', 'category', 'minPrice' и т.д.)
     * @param value - Новое значение, строго соответствующее типу выбранного ключа
     */
    setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]): void => {
      state = { ...state, [key]: value };
      notify();
    },

    /**
     * Сбрасывает все фильтры и сортировку к исходному состоянию `initial`
     * и оповещает подписчиков (чтобы UI-контролы очистили свои значения).
     */
    reset: (): void => {
      state = initial;
      notify();
    },

    /**
     * Подписывает функцию `listener` на обновления состояния.
     *
     * @param listener - Колбэк, который будет вызываться после setFilter и reset
     * @returns Функция отписки — вызовите её при размонтировании компонента
     */
    subscribe: (listener: Listener): (() => void) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
};

export type Store = ReturnType<typeof createStore>;

export const store: Store = createStore();
