import { Header } from '../components/header/Header';
import { h } from '../utils/dom';
import { getActivePath } from './routes';

const getCurrentPath = () => getActivePath(window.location.hash);

/**
 * Каркас приложения: шапка с навигацией и контейнер <main> для страниц
 *
 * При смене хэша в адресе заново создаётся только шапка, чтобы подсветка
 * активной ссылки была актуальной
 */
export const App = (): HTMLElement => {
  const main = h('main', { class: 'app__main' });
  const root = h('div', { class: 'app' }, Header(getCurrentPath()), main);

  window.addEventListener('hashchange', () => {
    root.querySelector('header')?.replaceWith(Header(getCurrentPath()));
  });

  return root;
};
