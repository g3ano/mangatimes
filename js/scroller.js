import { EventStore } from './helpers.js';

export class Scroller {
  pointer;
  container;
  eventStore;

  /**
   * Defined scroll direction (rtl)
   */
  #SIGN = -1;
  #BASE_SPEED = 0.35;

  static instance;

  /**
   *
   * @param {HTMLElement} container
   */
  constructor(container) {
    if (Scroller.instance) {
      return Scroller.instance;
    }

    this.container = container;
    this.eventStore = new EventStore(container);
    this.pointer = new Pointer();

    Scroller.instance = this;
  }

  init() {
    this.eventStore.add('wheel', this.onWheel.bind(this));
  }

  /**
   * @param {WheelEvent} event
   */
  onWheel(event) {
    event.preventDefault();

    this.pointer.update(event);
    this.scrollBy();
  }

  scrollBy() {
    this.container.scrollBy({
      left: this.pointer.getDiff() * this.#BASE_SPEED * this.#SIGN,
    });
  }

  destroy() {
    this.eventStore.clear();
  }
}

class Pointer {
  /**
   * @type {number}
   */
  #diff;

  constructor() {
    this.#diff = 0;
  }

  /**
   * @param {WheelEvent} event
   */
  update(event) {
    this.#diff = event.deltaY;
  }

  getDiff() {
    return this.#diff;
  }
}
