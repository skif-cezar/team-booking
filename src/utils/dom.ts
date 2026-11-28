import { IsoDate } from '../types';

type Child = Node | string | null | undefined | false;
type Props = Record<string, unknown>;

const isRenderable = (child: Child): child is Node | string => child !== null && child !== undefined && child !== false;

const applyProp = (el: HTMLElement, key: string, value: unknown): void => {
  if (value === undefined || value === null || value === false) return;

  if (key.startsWith('on') && typeof value === 'function') {
    el.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
    return;
  }

  if (key === 'class' || key === 'className') {
    el.className = String(value);
    return;
  }

  if (key === 'value' && 'value' in el) {
    (el as unknown as { value: string }).value = String(value);
    return;
  }

  if (key === 'dataset' && typeof value === 'object') {
    for (const [dataKey, dataVal] of Object.entries(value as Record<string, unknown>)) {
      if (dataVal !== undefined && dataVal !== null) {
        el.dataset[dataKey] = String(dataVal);
      }
    }
    return;
  }

  if (key === 'checked' && 'checked' in el) {
    (el as unknown as { checked: boolean }).checked = Boolean(value);
    return;
  }

  if (key === 'disabled' && 'disabled' in el) {
    (el as unknown as { disabled: boolean }).disabled = Boolean(value);
    return;
  }

  el.setAttribute(key, value === true ? '' : String(value));
};

/**
 * DOM-helper создает DOM-элемент
 * Пример: h('div', { class: 'box' }, 'text', childNode)
 */
export const h = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Props | null = null,
  ...children: Child[]
): HTMLElementTagNameMap[K] => {
  const el = document.createElement(tag);

  el.append(...children.filter(isRenderable));
  Object.entries(props ?? {}).forEach(([key, value]) => applyProp(el, key, value));

  return el;
};

/**
 * DOM-helper создает SVG-элемент
 * Пример: svg('svg', { class: 'box' })
 */
export const SVG_NS = 'http://www.w3.org/2000/svg';

export type SvgTag = 'svg' | 'path' | 'circle';

export const svg = (tag: SvgTag, attrs: Record<string, string | number>, ...children: SVGElement[]): SVGElement => {
  const el = document.createElementNS(SVG_NS, tag);

  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, String(value));
  }

  for (const child of children) {
    el.appendChild(child);
  }

  return el;
};

export const toggleSelectedDate = (current: readonly IsoDate[], target: IsoDate): IsoDate[] =>
  current.includes(target) ? current.filter((date) => date !== target) : [...current, target];
