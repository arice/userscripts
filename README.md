# Addigy GoLive → Watchman ID Linker

A Tampermonkey userscript that turns plain-text **Watchman Monitoring computer IDs** on Addigy GoLive device pages into clickable links that open the corresponding computer page in your Watchman Monitoring console.

## Before & After

| Before | After |
|--------|-------|
| `20260222-ABCD-NCC1701` (plain text) | [20260222-ABCD-NCC1701](https://yoursubdomain.monitoringclient.com/computers/20260222-ABCD-NCC1701) (clickable link) |

## Prerequisites

- [Addigy](https://www.addigy.com/) account with GoLive device pages
- [Watchman Monitoring](https://www.watchmanmonitoring.com/) account
- Google Chrome (or any Chromium-based browser) with the [Tampermonkey](https://www.tampermonkey.net/) extension installed (should work, or be able to be made to work, in other userscript implementations too, but hasn't been tested)

## Installation

1. **Install Tampermonkey** from the [Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).

2. **Install the userscript** — choose one method:

   - **From GitHub:** Click on [`addigy-watchman-linker.user.js`](addigy-watchman-linker.user.js) and click the **Raw** button. Tampermonkey will prompt you to install it.
   - **Manually:** Click the Tampermonkey icon → **Create a new script** → paste the contents of `addigy-watchman-linker.user.js` → save with **Ctrl+S** / **Cmd+S**.

3. **Set your Watchman subdomain:**

   Open the script in the Tampermonkey editor and find this line near the top:

   ```javascript
   const WATCHMAN_SUBDOMAIN = 'YOUR_SUBDOMAIN';
   ```

   Replace `YOUR_SUBDOMAIN` with your actual Watchman Monitoring subdomain. For example, if your Watchman console URL is `https://acmecorp.monitoringclient.com`, set it to:

   ```javascript
   const WATCHMAN_SUBDOMAIN = 'acmecorp';
   ```

   Save the script.

4. **Navigate to any device page** in Addigy (e.g., `https://app.addigy.com/devices/...`) and the Watchman ID will now be a clickable link.

## How It Works

The script watches the Addigy device detail page for a table row labeled **"Watchman ID"** and replaces the plain-text value with a hyperlink pointing to:

```
https://<YOUR_SUBDOMAIN>.monitoringclient.com/computers/<WATCHMAN_ID>
```

The script uses a `MutationObserver` to detect when the Watchman ID appears in the DOM, so it works even if the page content loads dynamically after the initial page render.

## Troubleshooting

- **Nothing happens:** Open DevTools (Cmd+Shift+J / Ctrl+Shift+J) and check the console. If you see a warning about `YOUR_SUBDOMAIN`, you still need to configure your subdomain.
- **Script doesn't run:** Make sure the Tampermonkey extension is enabled and the script is toggled on in the Tampermonkey dashboard.
- **Link goes to the wrong place:** Double-check that your subdomain is correct — visit `https://yoursubdomain.monitoringclient.com` directly to confirm.

## License

MIT
