import { AboutUs } from '../components/AboutUs/AboutUs';
import { Footer } from '../components/footer/Footer';
import { Header } from '../components/header/Header';
import { h } from '../utils/dom';
import { DEFAULT_ROUTE, getActivePath, RoutePath, ROUTES, shouldScrollToCatalog } from './routes';
import './App.scss';
import { AppOptions, Page } from '../types';
import { CatalogPage } from '../components/Catalog/CatalogPage';
import { store } from '../features/filtering/store';
import { APARTMENTS } from '../data/properties';

/** Сколько пузырей описано в App.scss (список $bubbles) */
const BUBBLES_COUNT = 8;
const INITIAL_HASH = `#${DEFAULT_ROUTE}`;

const getCurrentPath = (): RoutePath => getActivePath(window.location.hash);

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
export const App = ({ apartments = APARTMENTS, filterStore = store }: AppOptions = {}): HTMLElement => {
  // Принудительно ставим стартовый хэш #/about без лишней записи в истории браузера
  if (window.location.hash !== INITIAL_HASH) {
    window.history.replaceState(null, '', INITIAL_HASH);
  }

  const main = h('main', { class: 'app__main' });
  const root = h('div', { class: 'app' }, createBubbles(), Header(getCurrentPath()), main, Footer());

  let activePage: Page | null = null;

  const navigateTo = (route: RoutePath): void => {
    window.location.hash = `#${route}`;
  };

  const renderPage = (path: RoutePath): Page => {
    switch (path) {
      case ROUTES.catalog:
        return CatalogPage(filterStore, apartments, {
          onSelect: (apartment) => {
            window.location.hash = `#${ROUTES.catalog}/${apartment.slug}`;
          },
        });
      case ROUTES.about:
      default:
        return {
          element: AboutUs({
            onGoToSearch: () => navigateTo(ROUTES.catalog),
          }),
        };
    }
  };

  const renderRoute = (): void => {
    activePage?.destroy?.();

    const hash = window.location.hash;
    const currentPath = getCurrentPath();
    const nextPage = renderPage(currentPath);

    activePage = nextPage;
    main.replaceChildren(nextPage.element);

    if (shouldScrollToCatalog(hash)) {
      setTimeout(() => {
        document.querySelector('#catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  renderRoute();

  window.addEventListener('hashchange', () => {
    root.querySelector('header')?.replaceWith(Header(getCurrentPath()));
    renderRoute();
  });

  return root;
};
