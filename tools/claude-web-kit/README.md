# Claude web kit — free setup notes

Setup notes for the open-source tools in Ben Kimball's reel "5 Websites You
Need When Building with Claude": **anime.js**, **Bklit UI** and **Kokonut UI**.
All three are MIT and free. This directory holds **notes only**; the source is
not vendored here.

They are brand-neutral. EpiVail, AiRE Estate and Harrison Development rules
still govern anything built with them.

## What was set up and what was not

| Site | What it is | Licence | Here? |
|---|---|---|---|
| [animejs.com](https://animejs.com) | JavaScript animation engine (`juliangarnier/anime`) | MIT | Yes |
| [ui.bklit.com](https://ui.bklit.com) | Charts and data-viz components, shadcn registry (`bklit/bklit-ui`) | MIT (charts). **Bklit Studio** is all-rights-reserved: use it on their site, never copy its code | Yes |
| [kokonutui.com](https://kokonutui.com) | 100+ React components, many for AI apps, shadcn registry (`kokonut-labs/kokonutui`) | MIT | Yes |
| [manus.im](https://manus.im) | Hosted AI agent (paid plans; daily free credits) | Closed source | **No** — nothing to clone, and Charles pays for no AI tools |
| Fifth site | Cut off at the left edge of the screenshot | — | **No** — name unknown |

Bklit and Kokonut are not apps you run. They are component libraries: the
shadcn CLI copies a component's source into **your** Next.js/React project.
anime.js is an npm package you import.

## Install (Windows)

1. Install **Node.js 22 LTS** from <https://nodejs.org>. Check in PowerShell:
   `node --version` prints `v22…` or higher.
2. Install **Git** from <https://git-scm.com> if `git --version` fails.

### A project to put them in

Skip if you already have a Next.js project.

```powershell
cd $env:USERPROFILE
npx create-next-app@15 my-site --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes
cd my-site
npx shadcn@latest init -y -d
```

### anime.js

```powershell
npm i animejs
```

```js
import { animate } from 'animejs';
animate('.box', { x: 250, rotate: '1turn', duration: 800 });
```

### Kokonut UI — one component at a time

```powershell
npx shadcn@latest add kokonut-labs/kokonutui/ai-tool-approval
```

The file lands in `components/kokonutui/`. Browse names at
<https://kokonutui.com/docs>.

### Bklit UI — charts

```powershell
npx shadcn@latest add https://ui.bklit.com/r/line-chart.json
npm i -D @types/d3-scale @types/d3-shape @types/d3-array @types/d3-time
```

- If it asks to overwrite `lib/utils.ts`, answer **N**.
- The second line adds type files the chart needs but does not install;
  without them `npx tsc --noEmit` fails. Free.

### Let Claude Code install them for you (optional)

Both registries work through the free shadcn MCP server
(<https://ui.shadcn.com/docs/mcp>). Kokonut's setup for Claude Code is at
<https://kokonutui.com/docs/agents>; its docs for agents are at
<https://kokonutui.com/llms.txt>.

## Verified

Cloned and installed in a cloud session on 2026-11-18, Node 22.23:

- `juliangarnier/anime` at `01b81be`, `kokonut-labs/kokonutui` at `655ec61`,
  `bklit/bklit-ui` at `76299da` — each cloned, licence read.
- `npm i animejs` — 0 vulnerabilities; `animate` imports.
- Fresh Next.js 15 + shadcn project: Kokonut `ai-tool-approval` and Bklit
  `line-chart` added; `npx tsc --noEmit` passes once the four `@types/d3-*`
  packages are added.
- Not tested: running the components in a browser, or on Windows itself.
