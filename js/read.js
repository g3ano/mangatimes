import { DirectionToggle } from './components/direction-toggle.js';
import { TapNavigationToggle } from './components/tap-navigation-toggle.js';
import { PagesGapToggle } from './components/pages-gap-toggle.js';
import { Scroller } from './scroller.js';
import { EventStore } from './helpers.js';

(function () {
  let state = {};

  /**
   * @param {Record<string, unknown>} newState
   */
  function updateState(newState) {
    state = {
      ...state,
      ...newState,
    };
  }

  window.addEventListener('pages-gap-toggle-click', function (e) {
    updateChapterPagesGap(e);
  });

  window.addEventListener('direction-toggle-click', function (e) {
    updateChapterPagesDirection(e);
  });

  window.addEventListener('tap-navigation-click', function (e) {
    toggleTapNavigation(e);
  });

  /**
   * @param {CustomEvent} e
   */
  function updateChapterPagesGap(e) {
    /**
     * @type {HTMLElement}
     */
    const chapterPages = document.querySelector('#chapter-pages');
    const { status, gapSize } = e.detail;

    updateState({ gapSize });

    chapterPages.style.display = 'flex';
    chapterPages.style.flexDirection = state.direction ||= 'column';
    chapterPages.style.gap = `${status ? state.gapSize : 0}px`;
  }

  /**
   * @param {CustomEvent} e
   */
  function updateChapterPagesDirection(e) {
    /**
     * @type {HTMLElement}
     */
    const chapterPages = document.querySelector('#chapter-pages');
    const { direction } = e.detail;

    updateState({ direction });

    chapterPages.style.flexDirection = direction;
    [...chapterPages.children].forEach((child) => {
      child.style.maxHeight = '98vh';
      child.style.maxWidth = '98vw';
    });

    const scroller = new Scroller(chapterPages);

    if (state.direction === 'row-reverse') {
      scroller.init();
    } else {
      scroller.destroy();
    }
  }

  /**
   * @param {CustomEvent} e
   */
  function toggleTapNavigation(e) {
    /**
     * @type {HTMLElement}
     */
    const chapterPages = document.querySelector('#chapter-pages');
    const { status } = e.detail;

    if (!state.stores) {
      state.stores = [];
    }

    [...chapterPages.children].forEach((child, index) => {
      child.style.userSelect = 'none';

      if (status && state.stores?.[index]?.hasAny()) {
        return;
      }

      if (!status) {
        state.stores?.[index]?.clear();
        return;
      }

      state.stores[index] = new EventStore(child);
      state.stores[index].add('click', () =>
        advanceByPage(chapterPages, child)
      );
    });

    /**
     * @param {HTMLElement} parent
     * @param {HTMLElement} element
     */
    function advanceByPage(parent, element) {
      const height = element.getBoundingClientRect().height;
      const width = element.getBoundingClientRect().width;

      if (!state.direction || state.direction === 'column') {
        return window.scrollBy({ top: height, behavior: 'smooth' });
      }

      parent.scrollBy({ left: -width, behavior: 'smooth' });
    }
  }

  customElements.define('pages-gap-toggle', PagesGapToggle);
  customElements.define('direction-toggle', DirectionToggle);
  customElements.define('tap-navigation-toggle', TapNavigationToggle);
})();
