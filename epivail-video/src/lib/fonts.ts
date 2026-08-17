import { loadFont } from '@remotion/fonts'
import { staticFile } from 'remotion'
import { brand } from './brand'

/** Fonts are self-hosted in public/fonts — no network fetch at render time. */
export const loadBrandFonts = () =>
  Promise.all([
    loadFont({
      family: brand.fonts.display,
      url: staticFile('fonts/cormorant-600.woff2'),
      weight: '600',
    }),
    loadFont({
      family: brand.fonts.display,
      url: staticFile('fonts/cormorant-600-italic.woff2'),
      weight: '600',
      style: 'italic',
    }),
    loadFont({
      family: brand.fonts.ui,
      url: staticFile('fonts/dmsans-400.woff2'),
      weight: '400',
    }),
    loadFont({
      family: brand.fonts.ui,
      url: staticFile('fonts/dmsans-600.woff2'),
      weight: '600',
    }),
    loadFont({
      family: brand.fonts.stamp,
      url: staticFile('fonts/bebas-400.woff2'),
      weight: '400',
    }),
  ])
