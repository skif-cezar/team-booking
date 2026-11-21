import { describe, expect, it, vi } from 'vitest';
import { h } from './dom';

describe('h', () => {
  it('создаёт элемент с классом, атрибутами и дочерними элементами', () => {
    const el = h('div', { class: 'box', 'data-x': '1' }, 'text', null, false, h('span', null, 'a'));
    expect(el.className).toBe('box');
    expect(el.dataset.x).toBe('1');
    expect(el.textContent).toBe('texta');
  });

  it('добавляет обработчики событий', () => {
    const onClick = vi.fn();
    const button = h('button', { onClick }, 'ok');
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('устанавливает значение select после добавления дочерних элементов', () => {
    const select = h('select', { value: 'b' }, h('option', { value: 'a' }, 'A'), h('option', { value: 'b' }, 'B'));
    expect(select.value).toBe('b');
  });

  it('применяет class, className, dataset и data-* атрибуты', () => {
    const card = h('article', {
      class: 'property-card',
      dataset: { id: 'prop-01', guests: 4 },
      'data-category': 'Loft',
      'data-featured': true,
      'data-ignored': false,
      'data-missing': undefined,
    });

    expect(card.className).toBe('property-card');
    expect(card.dataset.id).toBe('prop-01');
    expect(card.dataset.guests).toBe('4');
    expect(card.getAttribute('data-category')).toBe('Loft');
    expect(card.getAttribute('data-featured')).toBe('');
    expect(card.hasAttribute('data-ignored')).toBe(false);
    expect(card.hasAttribute('data-missing')).toBe(false);

    const updated = h('div', { className: 'updated-box' });
    expect(updated.className).toBe('updated-box');
  });

  it('устанавливает value, checked и disabled для элементов форм и выбирает option в select', () => {
    const input = h('input', {
      type: 'text',
      value: 'Солнечный лофт',
      disabled: true,
    });
    expect(input.value).toBe('Солнечный лофт');
    expect(input.disabled).toBe(true);

    const checkbox = h('input', {
      type: 'checkbox',
      checked: true,
      disabled: false,
    });
    expect(checkbox.checked).toBe(true);
    expect(checkbox.disabled).toBe(false);

    const select = h(
      'select',
      { value: 'Villa' },
      h('option', { value: 'Studio' }, 'Studio'),
      h('option', { value: 'Villa' }, 'Villa'),
    );
    expect(select.value).toBe('Villa');
  });
});
