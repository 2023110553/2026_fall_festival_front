import { useLayoutEffect, useRef, useState } from 'react'
import * as S from './OverflowMarquee.styles'

export default function OverflowMarquee({ children, as = 'strong', variant = 'list' }) {
  const viewportRef = useRef(null)
  const textRef = useRef(null)
  const [distance, setDistance] = useState(0)

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const text = textRef.current
    if (!viewport || !text) return undefined

    const measure = () => {
      setDistance(Math.max(0, Math.ceil(text.scrollWidth - viewport.clientWidth)))
    }

    measure()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }

    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(text)
    return () => observer.disconnect()
  }, [children])

  return (
    <S.Viewport ref={viewportRef}>
      <S.Text ref={textRef} as={as} $distance={distance} $variant={variant}>
        {children}
      </S.Text>
    </S.Viewport>
  )
}
