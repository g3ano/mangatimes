export class Toggle extends HTMLElement {
  #shadow;
  #status;
  name;
  event;
  static observedAttributes = ['data-status'];

  constructor() {
    super();

    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#status = false;

    this.#render();

    console.log('toggle is constructed...');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`${name} changed from ${oldValue} to ${newValue}`);

    if (name === 'data-status') {
      this.setStatus(newValue === 'true');
    }
    console.log('status=', this.#status);
  }

  connectedCallback() {
    if (this.name) {
      this.event = new CustomEvent(`${this.name}-clicked`, {
        detail: { status: this.#status },
        bubbles: true,
        compose: true,
      });
    }

    const button = this.#shadow.querySelector('button.button');
    if (!button) {
      return;
    }

    button.addEventListener('click', this.#handleClick.bind(this));
  }

  #css() {
    return `
      /* You can change colors here */
      :host {
        --btn-toggle-default: rgb(128, 128, 128);
        --btn-toggle-default-hover: rgba(128, 128, 128, 0.8);
        --btn-toggle-accent: rgb(138, 43, 226);
        --btn-toggle-accent-hover: rgb(138, 43, 226, 0.8);
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
        ${this.setContent()}
      </button>
    `;
  }

  #render() {
    this.#shadow.innerHTML = `
      ${this.#template()}
    `;
  }

  /**
   * @param {MouseEvent} e
   */
  #handleClick(e) {
    this.#updateAttributes();

    this.onClick(e);

    if (this.name) {
      this.dispatchEvent(this.event);
      console.log(`${this.name}-clicked is dispatched`);
    }
  }

  /**
   * @param {(boolean|null)=} status
   */
  setStatus(status = null) {
    this.#status = status !== null ? status : !this.#status;
  }

  getStatus() {
    return this.#status;
  }

  #updateAttributes() {
    this.setAttribute('data-status', `${!this.#status}`);
  }

  /**
   * Hook into the Toggle's click event
   * @param {PointerEvent} e
   */
  onClick(e) {
    //
  }

  /**
   * Set the Toggle content
   */
  setContent() {
    return `<slot></slot>`;
  }
}
