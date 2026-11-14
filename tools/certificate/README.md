# AiRE Agent certificate (design)

Print-ready 11 x 8.5 in certificate for AiRE Estate Academy course graduates.
Charles asked for it 2026-11-14 and does **not** want it shown on the website.

- `certificate.html` - the design. Edit the name, course title, date and number in the HTML.
- `render.js` - `node render.js` writes `certificate-sample.png` and `certificate-sample.pdf` (Playwright).
- `fonts/` - Cormorant Garamond and Pinyon Script (SIL OFL, via Fontsource), Archivo and Manrope.

Signed "AiRE Estate Academy" / "AiRE Estate, LLC" - never Charles's name. Keep the fine-print
disclaimer: it is a private course certificate, not a license, CE credit or recognized designation.
