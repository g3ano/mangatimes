import { Toggle } from './ui/toggle.js';

export class PageGapToggle extends Toggle {
  constructor() {
    super();

    this.name = 'page-gap-toggle';
  }

  setContent() {
    return `Click me`;
  }

  /*a
   * @param {MouseEvent} e
   */
  onClick(e) {
    console.log('I am clicked!', this.getStatus());
  }
}
