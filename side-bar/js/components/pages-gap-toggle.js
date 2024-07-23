import { BaseToggle } from './base-toggle.js';

export class PagesGapToggle extends BaseToggle {
  constructor() {
    super();
    this.name = 'pages-gap-toggle';
    this.setData({ gapSize: 4 });
    this.setStatus(true);
  }

  static setObservedAttributes() {
    return ['data-gap-size'];
  }

  setDefaultSlot() {
    if (this.getStatus()) {
      return `مسافة بين الصفحات`;
    } else {
      return `بدون مسافات`;
    }
  }

  markup() {
    return `
      <style>
        .input-container {
          width: 100%;
        }

        .gap-size {
          display: inline-block;
          min-height: 1.25rem;
          min-width: 99%;
          padding: 0;
          margin: 0;
        }
      </style>
      <div class='input-container'>
        <input
          type='number'
          name='${this.name}-size'
          min='0'
          max='100'
          id='${this.name}-size'
          class='gap-size'
          value='${this.getData().gapSize}'
          autofocus />
      </div>
    `;
  }

  onAttributesUpdate(name, oldValue, newValue) {
    if (name === 'data-gap-size' && !isNaN(+newValue)) {
      this.setData({ gapSize: +newValue });
    }
  }

  onRender() {
    this.#attachEventListeners();
    this.#updateAttributes(this.getData().gapSize);
  }

  onUpdate() {
    this.#updateMarkup();
    this.#updateInputValue();
  }

  /**
   * @param {string} value
   */
  #updateAttributes(value) {
    this.setAttribute('data-gap-size', value > 100 ? 100 : value);
  }

  #attachEventListeners() {
    const input = this.shadowRoot.querySelector('input.gap-size');

    if (!input) {
      return;
    }

    input.addEventListener('input', (e) => {
      this.#updateAttributes(e.target.value);
    });
  }

  #updateMarkup() {
    this.shadow.querySelector('.content').style.display = this.getStatus()
      ? 'inline-block'
      : 'none';
  }

  #updateInputValue() {
    const input = this.shadow.querySelector('input.gap-size');

    if (!input) {
      return;
    }

    input.value = this.getData().gapSize;
  }
}
