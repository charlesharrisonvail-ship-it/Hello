# Lucide icons: setup notes

[lucide-icons/lucide](https://github.com/lucide-icons/lucide) (ISC licence, free,
v1.77.0, repo commit `c1a02a0`) is a set of 2,098 clean line icons, such as house,
key, map-pin, phone, calendar and mail. It's the default icon set in shadcn, Kokonut UI
and most of the component kits in `tools/claude-web-kit/`.

**It's a website ingredient, not a Claude skill.** You add it to a site or app
project, not to Claude Code. Source is not vendored here; the full repo is
large and only the published packages are needed.

**Lucide MCP** would let Claude search icons directly, but it's **waitlist only**
as of 2026-11-21. Revisit when it ships.

## Use it

### Plain HTML sites (`docs/`, `harrison-development/`)

The simplest option, with no build step. Paste one icon's SVG inline:

1. Find the icon at <https://lucide.dev/icons>.
2. Click **Copy SVG** and paste it into the page. It inherits the text colour.

Or load the script once and use tags (pin the version):

```html
<i data-lucide="house"></i>
<script src="https://unpkg.com/lucide@1.77.0/dist/umd/lucide.min.js"></script>
<script>lucide.createIcons();</script>
```

Inline SVG is the better choice for the live sites, because it adds no third-party
request.

### React / Next.js projects

```powershell
npm install lucide-react
```

```tsx
import { House, KeyRound } from "lucide-react";
<House size={20} strokeWidth={1.5} />
```

Other frameworks: `lucide-vue`, `@lucide/svelte`, `@lucide/angular`, `lucide-solid`,
`lucide-react-native`. All are listed at <https://lucide.dev/guide/>.

## Rules

- **No brand logos.** Lucide doesn't include them (no Instagram, Facebook or
  Zillow marks). Use official brand assets, or Simple Icons, for those.
- The ISC licence is free for commercial use. Keep the licence comment in the SVG.
- Icons are brand-neutral. EpiVail, AiRE Estate and Harrison Development colours
  and rules still apply, so set colour and stroke to match each brand.
- Changing the live `docs/` site follows the usual rule: draft, and Charles approves.
