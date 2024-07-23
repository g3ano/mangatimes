import { BaseToggle } from './base-toggle.js';

export class TapNavigationToggle extends BaseToggle {
  constructor() {
    super();
    this.name = 'tap-navigation';
  }

  setDefaultSlot() {
    if (this.getStatus()) {
      return `ايقاف النقر للتنقل`;
    } else {
      return `تفعيل النقر للتنقل`;
    }
  }
}
