// ==UserScript==
// @name         Addigy GoLive - Watchman ID Linker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Turns Watchman ID values on Addigy GoLive device pages into clickable links to your Watchman Monitoring console
// @match        https://app.addigy.com/devices/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @author       Adam Rice (https://askadam.io)
// ==/UserScript==

// ============================================================
// ABOUT
// ============================================================
// On Addigy GoLive device pages, the Watchman Monitoring computer ID
// is displayed as plain text. This script turns it into a clickable
// link that opens the corresponding computer page in your Watchman
// Monitoring console.
//
// INSTALLATION
// ============================================================
// 1. Install Tampermonkey for Chrome:
//    https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
// 2. Click the Tampermonkey icon > "Create a new script"
// 3. Paste this entire file and save (Ctrl+S / Cmd+S)
// 4. Set your WATCHMAN_SUBDOMAIN below
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

  function linkifyWatchmanIDs() {
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

  linkifyWatchmanIDs();

  const observer = new MutationObserver(() => {
    linkifyWatchmanIDs();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
