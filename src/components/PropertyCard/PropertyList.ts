import { Apartment } from '../../types';
import { h } from '../../utils/dom';
import { createPropertyCard } from '../PropertyCard/PropertyCard';
import './PropertyList.scss';

export interface PropertyListCallbacks {
  onSelect?: (apartment: Apartment) => void;
}

export const createPropertyList = (apartments: Apartment[], callbacks: PropertyListCallbacks = {}): HTMLElement => {
  const { onSelect } = callbacks;

  return h(
    'ul',
    { class: 'property-list' },
    ...apartments.map((apt) => h('li', { class: 'property-list__item' }, createPropertyCard(apt, { onSelect }))),
  );
};
