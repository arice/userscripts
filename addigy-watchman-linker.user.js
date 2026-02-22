// ==UserScript==
// @name         Addigy GoLive - Watchman ID Linker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a Watchman Monitoring link to the top action bar and linkifies the Watchman ID in the facts table on Addigy GoLive device pages
// @match        https://app.addigy.com/devices/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @author       Adam Rice (https://askadam.io)
// ==/UserScript==

// ============================================================
// ABOUT
// ============================================================
// On Addigy GoLive device pages, the Watchman Monitoring computer
// ID is displayed as plain text deep in the Device Facts table.
// This script:
//
// 1. Adds a Watchman Monitoring button to the action bar at the
//    top of the device page (next to Start Chat, LiveDesktop,
//    etc.) so you can jump to Watchman without scrolling.
//
// 2. Turns the Watchman ID in the Device Facts table into a
//    clickable link.
//
// INSTALLATION
// ============================================================
// 1. Install Tampermonkey for Chrome:
//    https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
// 2. Click the Tampermonkey icon > "Create a new script"
// 3. Paste this entire file and save (Ctrl+S / Cmd+S)
// 4. Set your WATCHMAN_SUBDOMAIN below
//
//
// CONFIGURATION
// ============================================================
// Your Watchman Monitoring URL looks like:
//   https://<SUBDOMAIN>.monitoringclient.com
//
// Replace 'YOUR_SUBDOMAIN' below with your actual subdomain.
// For example, if your console is at https://acmecorp.monitoringclient.com,
// set it to 'acmecorp'.
//
// TROUBLESHOOTING
// ============================================================
// - Nothing happens? Open DevTools (Cmd+Shift+J / Ctrl+Shift+J)
//   and check the console for a warning about YOUR_SUBDOMAIN.
// - Script doesn't run? Make sure Tampermonkey is enabled and
//   the script is toggled on in the Tampermonkey dashboard.
// - Link goes to the wrong place? Verify your subdomain by
//   visiting https://yoursubdomain.monitoringclient.com directly.
// - Top bar button doesn't appear? The script needs to find the
//   Watchman ID in the facts table first. Make sure the device
//   has Watchman Monitoring installed.
//
// LICENSE: MIT
// ============================================================

(function () {
  'use strict';

  // ============================================================
  // CONFIGURATION — Set your Watchman Monitoring subdomain below
  // ============================================================
  const WATCHMAN_SUBDOMAIN = 'YOUR_SUBDOMAIN';
  // ============================================================

  if (WATCHMAN_SUBDOMAIN === 'YOUR_SUBDOMAIN') {
    console.warn(
      '[Watchman ID Linker] You need to set your WATCHMAN_SUBDOMAIN in the script settings. Edit the userscript and replace YOUR_SUBDOMAIN with your Watchman Monitoring subdomain.'
    );
    return;
  }

  const WATCHMAN_BASE_URL = `https://${WATCHMAN_SUBDOMAIN}.monitoringclient.com/computers/`;
  const WATCHMAN_ID_PATTERN = /^\d{8}-[A-Z0-9]{4}-[A-Z0-9]+$/;
  const TOP_BUTTON_ID = 'watchman-top-link';

  // Lighthouse/watchtower icon as inline SVG
  const WATCHMAN_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" class="m-r-half" style="vertical-align: middle;">
    <path fill="currentColor" d="M12 2L8.5 7H7v2h1.06L6 22h5v-4c0-.55.45-1 1-1s1 .45 1 1v4h5L15.94 9H17V7h-1.5L12 2zm-1.5 7h3l.6 3h-4.2l.6-3z"/>
  </svg>`;

  function getWatchmanID() {
    const cells = document.querySelectorAll('td, th, span, div');
    for (const cell of cells) {
      if (cell.textContent.trim() === 'Watchman ID') {
        const valueCell =
          cell.nextElementSibling ||
          cell.closest('tr')?.querySelector('td:last-child');
        if (valueCell) {
          const text = valueCell.textContent.trim();
          if (WATCHMAN_ID_PATTERN.test(text)) return text;
        }
      }
    }
    return null;
  }

  function linkifyTable() {
    const cells = document.querySelectorAll('td, th, span, div');
    cells.forEach((cell) => {
      if (cell.textContent.trim() === 'Watchman ID') {
        const valueCell =
          cell.nextElementSibling ||
          cell.closest('tr')?.querySelector('td:last-child');
        if (!valueCell || valueCell.querySelector('a')) return;
        const idText = valueCell.textContent.trim();
        if (WATCHMAN_ID_PATTERN.test(idText)) {
          const link = document.createElement('a');
          link.href = WATCHMAN_BASE_URL + idText;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = idText;
          link.style.color = '#1a73e8';
          link.style.textDecoration = 'underline';
          valueCell.textContent = '';
          valueCell.appendChild(link);
        }
      }
    });
  }

  function injectTopButton(watchmanID) {
    if (document.getElementById(TOP_BUTTON_ID)) return;

    // Find the action bar: the section containing the "Start Chat" button
    const startChatBtn = Array.from(document.querySelectorAll('button.button.is-link'))
      .find(btn => btn.textContent.trim().includes('Start Chat'));

    if (!startChatBtn) return;

    const actionBar = startChatBtn.parentElement;
    if (!actionBar) return;

    // Create a link styled as a button to match the existing action buttons
    const btn = document.createElement('a');
    btn.id = TOP_BUTTON_ID;
    btn.href = WATCHMAN_BASE_URL + watchmanID;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.className = 'button is-link m-l-half';
    btn.innerHTML = WATCHMAN_ICON_SVG + ' Watchman';
    btn.style.textDecoration = 'none';

    // Insert before the Refresh Data dropdown (last child), or just append
    const refreshDropdown = actionBar.querySelector('.dropdown');
    if (refreshDropdown) {
      actionBar.insertBefore(btn, refreshDropdown);
    } else {
      actionBar.appendChild(btn);
    }
  }

  function run() {
    const watchmanID = getWatchmanID();
    if (watchmanID) {
      linkifyTable();
      injectTopButton(watchmanID);
    }
  }

  run();

  const observer = new MutationObserver(() => {
    run();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
