import './styles/main.scss';
import { h } from './utils/dom';

document.querySelector<HTMLDivElement>('#app')?.append(h('h1', null, 'Booking'));
