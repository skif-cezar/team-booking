import { Header } from '../components/header/Header';
import { h } from '../utils/dom';
import { getActivePath } from './routes';
import './App.scss';

/** Сколько пузырей описано в App.scss (список $bubbles) */
const BUBBLES_COUNT = 8;

const getCurrentPath = () => getActivePath(window.location.hash);

/** Декоративный фон из пузырей. Скрыт от скринридеров. */
const createBubbles = (): HTMLElement =>
  h('div', { class: 'bubbles', 'aria-hidden': 'true' }, ...Array.from({ length: BUBBLES_COUNT }, () => h('i')));

/**
 * Каркас приложения: фон из пузырей, шапка с навигацией и контейнер <main> для страниц.
 *
 * При смене хэша в адресе заново создаётся только шапка, чтобы подсветка
 * активной ссылки была актуальной. Сам <main> не трогаем: в него роутер
 * будет вставлять содержимое страниц.
 */
export const App = (): HTMLElement => {
  const main = h('main', { class: 'app__main' });
  const root = h('div', { class: 'app' }, createBubbles(), Header(getCurrentPath()), main);

  window.addEventListener('hashchange', () => {
    root.querySelector('header')?.replaceWith(Header(getCurrentPath()));
  });

  return root;
};
