/**
 * @typedef {Object} Shortcut
 * @property {string} key
 * @property {boolean} ctrl
 * @property {() => void} command
 */

export function initKeyboardShortcuts() {
  /**
   * @type {Shortcut[]}
   */
  const keyboardShortcuts = [
    {
      key: 'ArrowLeft',
      ctrl: false,
      command: () => {
        const dropdown = document.getElementById('chapter-dropdown');
        const prevOption = dropdown.options[dropdown.selectedIndex - 1];

        if (!prevOption) {
          return;
        }

        navigateChapter(prevOption.value);
      },
    },
    {
      key: 'ArrowRight',
      ctrl: false,
      command: () => {
        const dropdown = document.getElementById('chapter-dropdown');
        const nextOption = dropdown.options[dropdown.selectedIndex + 1];

        if (!nextOption) {
          return;
        }

        navigateChapter(nextOption.value);
      },
    },
  ];

  window.addEventListener('keydown', (e) => {
    keyboardShortcuts.forEach((shortcut) => {
      if (shortcut.key !== e.key || shortcut.ctrl !== e.ctrlKey) {
        return;
      }

      shortcut.command();
    });
  });

  /**
   * @param {string} chapterId
   */
  function navigateChapter(chapterId) {
    const url = `https://mangatime.org/read/${window.mangaMeta.mangaId}/${window.mangaMeta.teamId}/${chapterId}`;

    window.location.href = url;
  }
}
