import React from 'react'
import { continueRender, delayRender } from 'remotion'
import { loadBrandFonts } from '../lib/fonts'

/**
 * Holds the render until every brand face is ready, so no frame is ever
 * captured with a fallback font.
 */
export const FontGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = React.useState(() => delayRender('Loading EpiVail brand fonts'))
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    loadBrandFonts()
      .then(() => {
        if (cancelled) return
        setReady(true)
        continueRender(handle)
      })
      .catch(() => {
        if (cancelled) return
        setReady(true)
        continueRender(handle)
      })
    return () => {
      cancelled = true
    }
  }, [handle])

  return <>{ready ? children : null}</>
}
