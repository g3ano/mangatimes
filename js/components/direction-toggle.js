import { BaseToggle } from './base-toggle.js';

export class DirectionToggle extends BaseToggle {
  constructor() {
    super();
    this.name = 'direction-toggle';
    this.setData({ direction: 'column' });
    this.setStatus(true);
  }

  static setObservedAttributes() {
    return ['data-direction'];
  }

  setDefaultSlot() {
    if (this.getStatus()) {
      return `الوضع العمودي`;
    } else {
      return `الوضع الافقي`;
    }
  }

  onRender() {
    this.#updateAttributes();
  }

  onClick() {
    this.#updateAttributes();
  }

  onAttributesUpdate(name, oldValue, newValue) {
    if (name === 'data-direction') {
      this.setData({ direction: newValue });
    }
  }

  #updateAttributes() {
    this.setAttribute(
      'data-direction',
      this.getStatus() ? 'column' : 'row-reverse'
    );
  }
}
