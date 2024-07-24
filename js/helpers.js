export class EventStore {
  /**
   * @type {Listener[]}
   */
  listeners;

  /**
   * @type {HTMLElement}
   */
  container;

  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    this.container = container;
    this.listeners = [];
  }

  /**
   * @callback Listener
   * @param {Event} e
   * @returns {void}
   */
  /**
   *
   * @param {keyof HTMLElementEventMap} type
   * @param {Listener} listener
   * @param {AddEventListenerOptions} options
   */
  add(type, listener, options = {}) {
    this.container.addEventListener(type, listener, options);
    this.listeners.push(() =>
      this.container.removeEventListener(type, listener, options)
    );
  }

  clear() {
    if (!this.listeners.length) {
      return;
    }

    this.listeners.forEach((l) => l());
    this.listeners = [];
  }

  hasAny() {
    return !!this.listeners.length;
  }
}

export class LocalStorage {
  /**
   * @param {string} key
   * @param {unknown} value
   */
  add(key, value) {
    localStorage.setItem(key, this.#stringify(value));
  }

  /**
   * @param {string} key
   */
  get(key) {
    return this.#parse(localStorage.getItem(key));
  }

  /**
   * @param {string} key
   * @param {unknown} defaultValue
   */
  getOrCreate(key, defaultValue) {
    if (this.get(key)) {
      return this.get(key);
    }

    this.add(key, defaultValue);
    return defaultValue;
  }

  /**
   * @param {string} key
   */
  remove(key) {
    localStorage.removeItem(key);
  }

  /**
   * @param {unknown} value
   */
  #stringify(value) {
    return JSON.stringify(value);
  }

  /**
   * @param {string|null} value
   */
  #parse(value) {
    if (!value) {
      return '';
    }

    return JSON.parse(value);
  }
}
