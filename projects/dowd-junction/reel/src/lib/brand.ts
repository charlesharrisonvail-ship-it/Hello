// Dowd Junction reel tokens. They match the concept site in ../redesign so the
// reel and the page read as one piece.
export const brand = {
  colors: {
    ivory: '#f5f0e6',
    paper: '#ece5d7',
    ink: '#1b211e',
    inkSoft: '#4b524d',
    pine: '#16231f',
    pine2: '#1f332d',
    bronze: '#835c2e',
    bronzeLt: '#d3ad78',
    river: '#9fc3c7',
    rust: '#a34a2c',
  },
  fonts: {
    display: '"Cormorant Garamond", Georgia, serif',
    ui: 'Manrope, system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
  },
  timing: { fps: 30, word: 4, slideUp: 12 },
} as const;

export const W = 1080;
export const H = 1920;

// Instagram/TikTok overlays: keep content left of the right-hand buttons and
// above the bottom caption/username block.
export const safe = { left: 64, right: W - 170, top: 190, bottom: H - 420 };
