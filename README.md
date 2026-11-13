# Wishora v3 — free digital wish designer

## Run it
Open `index.html` in a modern browser, or use VS Code Live Server. No npm or build step.
Shared wish links only work for other people once the site is hosted (Netlify, Vercel, GitHub Pages, any static host).

## Before you go live
1. In `index.html`, replace `https://YOUR-DOMAIN.com` (2 places) with your real domain so the social preview image shows up.
2. In `privacy.html` and `terms.html`, replace `hello@YOUR-DOMAIN.com` with your contact email. These pages are plain-language starting points, not legal advice — have them reviewed if you add accounts or cloud storage.

## What's new in v3
- **Surprise reveals that work:** gift box, love-letter envelope and tap-to-reveal, with a confetti burst on opening.
- **Live countdown** to the event date (days / hours / minutes / seconds).
- **Video, voice note and music on the card.** YouTube links play inside the wish; four original melodies are generated in the browser (no copyrighted music).
- **Download as image** (PNG). Uses the bundled `vendor/html2canvas.min.js` (MIT licence included).
- **Shareable wish links without a backend.** The wish is encoded after `#w=` in the URL, and opening it shows a full-screen recipient view with a “Create your own” button. Photos aren't included in links yet; they need cloud storage.
- **Instagram button** shares the card image via the phone's share sheet, or saves it and copies the link.
- **Ready-made designs** for every occasion, a **gallery** of examples, and an **✨ Inspire me** message button.
- **New occasions:** Eid Mubarak, Ramadan, Diwali, Holi, Christmas, New Year. **New themes:** Emerald, Marigold, Holi.
- **Urdu / Arabic support:** Noto Nastaliq Urdu font, automatic right-to-left detection, direction setting.
- **Readability and accessibility:** larger text, keyboard focus outlines, a skip link, ARIA on the tabs and menu, and reduced-motion support.
- **FAQ, Privacy and Terms pages**, Open Graph / Twitter preview image, favicon and Apple touch icon.
- **Autosaved draft** (localStorage). “Start over” resets without reloading the page. Photos can be removed one at a time.
- “View as recipient” replaces the old static “Mobile view” label. Fixed the stray space in the Scrapbook layout value.

## Editing content
All occasions, messages, templates, themes and stickers are in `data.js`.

## Still needs a backend
Photos in shared links, short links, accounts and saved projects, scheduled delivery, moderation and deletion controls.

## Birthday surprise page (`birthday.html`)
A standalone, playful birthday page: floating hearts, bunting, a bunny and a cat with a cake, a Yes/No prompt (the No button runs away), a blow-out-the-candles step, then the message card.
- Open `birthday.html` with no wish in the URL to get the **maker**: name, sender, message and colour give you a shareable link, QR code (saved as PNG) and a share button.
- A wish lives in the URL after `#b=` (base64url JSON), so nothing is uploaded or stored. Text is inserted with `textContent` and length-limited.
- Files: `birthday.html`, `birthday.css`, `birthday.js`, and `qrcode.js` (qrcode-generator by Kazuhiko Arase, MIT).
