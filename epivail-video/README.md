# epivail-video

Programmatic video for EpiVail, built with [Remotion](https://remotion.dev).
Renders locally — no per-render cost.

## Compositions

| ID | Size | Duration | Use |
|---|---|---|---|
| `DogSnowRun` | 1080×1920 | 10s | Reels / TikTok / Shorts |
| `DogSnowRunWide` | 1920×1080 | 10s | Web hero / LinkedIn |

`DogSnowRun` composites a background-removed cutout of the dog into a
procedurally drawn alpine snow scene: parallax ridgelines, scrolling drifts,
two depth layers of falling snow, a bounding bob with contact shadow and
paw spray, and the EpiVail navy/gold lockup.

## Commands

```bash
npm install
npm run studio                 # interactive preview + scrubbing

# render (this environment needs Chrome's headless shell passed explicitly)
npx remotion render src/index.ts DogSnowRun out/dog-snow-run-1080x1920.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

## Notes

- `public/dog.png` is the alpha cutout, produced with `rembg` from the source photo.
- Webfonts (Cormorant Garamond, Bebas Neue, DM Sans) are latin-subset and
  base64-inlined in `src/lib/fonts.ts`, so renders need no network and are
  unaffected by proxy TLS interception.
- Brand tokens live in `src/lib/brand.ts` — import from there, never hardcode.
