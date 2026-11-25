import { DEVELOPERS } from '../../data/properties';
import { DeveloperProfile } from '../../types';
import { h } from '../../utils/dom';
import './AboutUs.scss';

interface AboutUsCallbacks {
  onGoToSearch: () => void;
}

const createDeveloperCard = (dev: DeveloperProfile): HTMLElement =>
  h(
    'article',
    { class: 'about-us__developer' },
    h(
      'div',
      { class: 'about-us__developer-photo' },
      h('img', {
        src: dev.image,
        alt: `${dev.name} — ${dev.role}`,
        class: 'about-us__developer-img',
        loading: 'lazy',
        referrerpolicy: 'no-referrer',
      }),
    ),
    h(
      'div',
      { class: 'about-us__developer-body' },
      h('h3', { class: 'about-us__developer-name' }, dev.name),
      h('span', { class: 'about-us__developer-meta' }, `${dev.role} · ${dev.nickname}`),
      h('p', { class: 'about-us__developer-bio' }, dev.bio),
      h('p', { class: 'about-us__developer-quote' }, dev.quote),
      h(
        'div',
        { class: 'about-us__tags' },
        ...dev.specialty
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
          .map((item) => h('span', { class: 'about-us__tag' }, item)),
      ),
    ),
  );

export const AboutUs = ({ onGoToSearch }: AboutUsCallbacks): HTMLElement =>
  h(
    'div',
    { class: 'about-us' },
    h(
      'section',
      { class: 'about-us__hero' },
      h(
        'div',
        { class: 'about-us__manifesto' },
        h('span', { class: 'about-us__badge' }, 'О проекте «Гена Букинг»'),
        h('h1', { class: 'about-us__title' }, 'Сервис аренды жилья, где диван проверяют жёстче, чем паспорт'),
        h(
          'p',
          { class: 'about-us__intro' },
          '«Гена Букинг» родился в Екатеринбурге после того, как двое друзей попытались снять квартиру на выходные, а получили три часа переписок с риелтором и диван, на котором невозможно досмотреть второй тайм. Мы решили сделать честную и весёлую альтернативу: с прозрачным календарём, настоящими правилами дома и духом легендарной семьи Букиных.',
        ),
      ),
      h(
        'div',
        { class: 'about-us__rules' },
        h('h2', { class: 'about-us__rules-title' }, 'Четыре правила «Гена Букинг»'),
        h(
          'ul',
          { class: 'about-us__rules-list' },
          h(
            'li',
            null,
            h('strong', null, 'Честный календарь:'),
            ' если дата занята под футбол или визит тёщи, вы видите это сразу.',
          ),
          h(
            'li',
            null,
            h('strong', null, 'Цена без сюрпризов:'),
            ' никаких скрытых сборов за воздух и право посидеть на диване.',
          ),
          h(
            'li',
            null,
            h('strong', null, 'Удобства по делу:'),
            ' только то, что пригодится — от быстрого Wi-Fi до ложки для обуви.',
          ),
          h('li', null, h('strong', null, 'Самоирония в комплекте:'), ' поднимает настроение ещё до сбора чемодана.'),
        ),
        h(
          'button',
          {
            type: 'button',
            class: 'about-us__cta',
            onClick: onGoToSearch,
          },
          'Перейти к выбору квартиры',
        ),
      ),
    ),
    h(
      'section',
      { class: 'about-us__developers', 'aria-labelledby': 'developers-heading' },
      h('h2', { id: 'developers-heading', class: 'about-us__section-title' }, 'Разработчики'),
      h('div', { class: 'about-us__developers-grid' }, ...DEVELOPERS.map(createDeveloperCard)),
    ),
  );
