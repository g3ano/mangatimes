import { LocalStorage } from './../helpers.js';

export class BaseToggle extends HTMLElement {
  /**
   * ShadowDOM in use
   *
   * @type {ShadowRoot}
   */
  shadow;

  /**
   * Unique name for each subclass, used to name dispatched event,
   * and as key for localStorage entry

   * @type {string}
   */
  name;

  /**
   * Storage engine instance
   *
   * @type {LocalStorage}
   */
  storage;

  /**
   * Toggle associated data
   *
   * @type {Record<string, unknown>}
   */
  #data;

  /**
   * Component toggle
   *
   * @type {HTMLElement|null}
   */
  #button;

  static get observedAttributes() {
    return ['data-status', ...(this.setObservedAttributes() ?? [])];
  }

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: 'open' });
    this.name = '';
    this.storage = new LocalStorage();
    this.#data = {};
    this.#button = null;

    this.setData({ status: false });
  }

  connectedCallback() {
    this.setData(this.storage.getOrCreate(this.name), this.getData());
    this.#render();
  }

  /**
   * @param {string} name
   * @param {unknown} oldValue
   * @param {unknown} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-status') {
      this.setStatus(newValue === 'true');
    }

    this.onAttributesUpdate(name, oldValue, newValue || '');
    this.#persist();
    this.#update();
  }

  /**
   * Define observed attributes
   *
   * @returns {string[]}
   */
  static setObservedAttributes() {
    //
  }

  /**
   * Hook into component click event
   *
   * @param {MouseEvent=} e
   */
  onClick(e) {
    //
  }

  /**
   * Hook into component attributes update phase
   *
   * @param {string} name
   * @param {unknown} oldValue
   * @param {unknown} newValue
   */
  onAttributesUpdate(name, oldValue, newValue) {
    //
  }

  /**
   * Hook into component render phase
   */
  onRender() {
    //
  }

  /**
   * Hook into component re-render phase
   */
  onUpdate() {
    //
  }

  /**
   * @param {(boolean|null)=} status
   */
  setStatus(status = null) {
    this.setData({
      status: status !== null ? status : !this.getStatus(),
    });
  }

  /**
   * @returns {boolean}
   */
  getStatus() {
    return this.getData().status;
  }

  /**
   * @param {Record<string, unknown>} data
   */
  setData(data) {
    if (!Object.keys(this.#data).length) {
      this.#data = data;
      return;
    }

    this.#data = {
      ...this.getData(),
      ...data,
    };
  }

  getData() {
    return this.#data;
  }

  getDefaultSlot() {
    return `<slot></slot>`;
  }

  /**
   * Set the component default slot
   */
  setDefaultSlot() {
    //
  }

  /**
   * Set the component content
   */
  markup() {
    //
  }

  #css() {
    return `
      /* You can change colors here */
      :host {
        --btn-toggle-default: rgb(128, 128, 128);
        --btn-toggle-default-hover: rgba(128, 128, 128, 0.8);
        --btn-toggle-accent: rgb(138, 43, 226);
        --btn-toggle-accent-hover: rgb(138, 43, 226, 0.8);
        
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .button {
        all: unset;
        width: 100%;
        min-height: 1.75rem;
        background-color: var(--btn-toggle-default);
        color: whitesmoke;
        padding-block: 0.25rem;
        border-radius: 0.25rem;
        text-align: center;
        cursor: pointer;

        &:hover,
        &:active {
          background-color: var(--btn-toggle-default-hover);
        }
      }

    `;
  }

  #template() {
    return `
      <style>
        ${this.#css()}
      </style>
      <button class='button'>
        ${this.setDefaultSlot() ?? this.getDefaultSlot()}
      </button>
      <div class='content'>
        ${this.markup() ?? ``}
      </div>
    `;
  }

  #render() {
    this.shadow.innerHTML = this.#template();
    this.#button = this.#getTrigger();

    this.#attachEventListeners();
    this.#updateStatusAttribute();
    this.#fireCustomEvents();

    this.onRender();
  }

  #update() {
    if (!this.#button) {
      return;
    }

    this.#button.innerHTML = this.setDefaultSlot() ?? this.getDefaultSlot();

    this.#fireCustomEvents();
    this.onUpdate();
  }

  /**
   * @param {MouseEvent} e
   */
  #handleClick(e) {
    this.setStatus(!this.getStatus());
    this.#updateStatusAttribute();
    this.onClick(e);
    this.#fireCustomEvents();
  }

  #updateStatusAttribute() {
    this.setAttribute('data-status', `${this.getStatus()}`);
  }

  #attachEventListeners() {
    if (!this.#button) {
      return;
    }

    this.#button.addEventListener('click', this.#handleClick.bind(this));
  }

  #fireCustomEvents() {
    if (!this.name) {
      return;
    }

    const event = new CustomEvent(`${this.name}-click`, {
      detail: this.getData(),
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  /**
   * @returns {HTMLElement}
   */
  #getTrigger() {
    return this.shadow.querySelector('.button');
  }

  /**
   * Persist data to storage
   */
  #persist() {
    this.storage.add(this.name, this.getData());
  }
}
