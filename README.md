# Hello World

This is my first GitHub repository!

## About Me

I'm learning how to use GitHub and excited to collaborate on projects!

## End-to-end tests

This repo ships a [Playwright](https://playwright.dev) suite plus a tiny demo site for it to drive.

```bash
npm install          # once
npm test             # run every spec headlessly
npm run test:ui      # interactive UI mode (watch, time-travel, pick locators)
npm run test:headed  # watch a real browser do it
npm run test:debug   # step through with the Playwright inspector
npm run test:smoke   # just the @smoke-tagged specs
npm run report       # open the last HTML report
npm run typecheck    # tsc --noEmit over the suite
```

### Layout

| Path | What it is |
| --- | --- |
| `playwright.config.ts` | Projects, reporters, retries, trace/video policy, dev-server wiring |
| `tests/*.spec.ts` | The specs — home, navigation, responsive, accessibility |
| `tests/pages/` | Page objects; selectors live here, not in the specs |
| `tests/fixtures/test.ts` | Extended `test` that injects page objects and fails on console errors |
| `site/` | Zero-dependency demo site under test |
| `scripts/serve.mjs` | Static server Playwright starts automatically |
| `.github/workflows/playwright.yml` | CI: typecheck, install Chromium, run suite, upload report |

### Running against a deployed environment

The suite has no hard-coded origin — it uses `baseURL`, so point it anywhere:

```bash
BASE_URL=https://staging.example.com npm test
```

When `BASE_URL` is remote, the bundled demo server is skipped automatically.

### Conventions

- **Locators by role/label**, not CSS — the tests break when the UX breaks, not when a class is renamed.
- **Tag fast checks `@smoke`** so `npm run test:smoke` stays a sub-5s signal.
- **Console errors fail the test.** A spec that provokes one on purpose opts out explicitly:
  `test.use({ allowConsoleErrors: [/Failed to load resource.*404/] })`.
- **Artifacts on failure only** — screenshots and video are retained for failures, traces on first retry.

### Browsers

`chromium` and `mobile-chrome` (Pixel 7) are enabled. Firefox and WebKit projects are in
`playwright.config.ts`, commented out — uncomment them after `npx playwright install firefox webkit`.
