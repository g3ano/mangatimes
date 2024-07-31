import { DirectionToggle } from './components/direction-toggle.js';
import { TapNavigationToggle } from './components/tap-navigation-toggle.js';
import { PagesGapToggle } from './components/pages-gap-toggle.js';
import { Scroller } from './scroller.js';
import { EventStore } from './helpers.js';
import { initKeyboardShortcuts } from './keyboard-shortcuts.js';

(function () {
  /**
   * @typedef {Object} State
   * @property {'column'|'row-reverse'} direction
   * @property {Map} stores
   * @property {MutationObserver} observer
   */
  /**
   * @type {State}
   */
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

  /**
   * @param {CustomEvent} e
   */
  function handlePageGapToggleClick(e) {
    updateChapterPagesGap(e);
  }

  /**
   * @param {CustomEvent} e
   */
  function handleDirectionToggleClick(e) {
    updateChapterPagesDirection(e);
  }

  /**
   * @param {CustomEvent} e
   */
  function handleTapNavigationClick(e) {
    toggleTapNavigation(e);
  }

  window.addEventListener('pages-gap-toggle-click', handlePageGapToggleClick);
  window.addEventListener('direction-toggle-click', handleDirectionToggleClick);
  window.addEventListener('tap-navigation-click', handleTapNavigationClick);

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
      child.style.minHeight = 'max(98vh, 100%)';
      child.style.maxWidth = 'min(98vw, 600px)';
      child.style.marginBlockStart = '0';
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
      state.stores = new Map();
    }

    if (!status && state.observer) {
      state.observer.disconnect();
    }

    [...chapterPages.children].forEach((child) => {
      attachEventToImage(child);
    });

    /**
     * Attach click event to page image
     *
     * @param {HTMLImageElement} image
     */
    function attachEventToImage(image) {
      image.style.userSelect = 'none';

      const key = image.dataset.src;

      if (status && state.stores?.get(key)?.hasAny()) {
        return;
      }

      if (!status) {
        state.stores?.get(key)?.clear();
        return;
      }

      state.stores.set(key, new EventStore(image));
      state.stores.get(key).add('click', () => advanceByPage(chapterPages));
    }

    /**
     * Advance page by window width and height size
     *
     * @param {HTMLElement} parent
     */
    function advanceByPage(parent) {
      const { width, height } = window.screen;

      if (!state.direction || state.direction === 'column') {
        return window.scrollBy({ top: height - 100, behavior: 'smooth' });
      }

      parent.scrollBy({ left: -width + 120, behavior: 'smooth' });
    }

    (function () {
      if (state.observer) {
        return;
      }

      const observer = new MutationObserver(function (records) {
        for (const record of records) {
          if (record.type !== 'childList') {
            return;
          }

          [...record.addedNodes].forEach((node) => {
            if (node.nodeName !== 'IMG') {
              return;
            }

            attachEventToImage(node);
          });
        }
      });

      /**
       * @type {HTMLElement}
       */
      const chapterPages = document.querySelector('#chapter-pages');

      observer.observe(chapterPages, {
        childList: true,
        subtree: true,
      });

      state.observer = observer;
    })();
  }

  customElements.define('pages-gap-toggle', PagesGapToggle);
  customElements.define('direction-toggle', DirectionToggle);
  customElements.define('tap-navigation-toggle', TapNavigationToggle);

  initKeyboardShortcuts();
})();
