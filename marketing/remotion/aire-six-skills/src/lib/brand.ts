// AiRE Estate reel tokens, matching marketing/remotion/aire-vs-bootcamps on the
// live-site branch (near-black ground, sky/violet/pink gradient, Archivo + Manrope).
// Key names mirror the shared reel components so they can be reused as-is.
export const brand = {
  colors: {
    ivory: '#eef3f8',
    paper: '#0d1524',
    ink: '#04070d',
    inkSoft: '#8496b2',
    pine: '#04070d',
    pine2: '#0d1524',
    bronze: '#38bdf8',
    bronzeLt: '#38bdf8',
    river: '#a78bfa',
    rust: '#f472b6',
    amber: '#fbbf24',
  },
  grad: 'linear-gradient(90deg, #38bdf8, #a78bfa, #f472b6)',
  fonts: {
    display: '"Cormorant Garamond", Georgia, serif',
    ui: 'Archivo, Manrope, system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
  },
  timing: { fps: 30, word: 4, slideUp: 12 },
} as const;

export const W = 1080;
export const H = 1920;
export const safe = { left: 64, right: W - 170, top: 190, bottom: H - 420 };
