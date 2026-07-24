'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ElementType, ReactNode } from 'react'

type EditableRevealProps = {
  children: ReactNode
  /** stagger index — each unit adds 60ms of transition-delay */
  index?: number
  /** override the stagger step (ms) */
  step?: number
  /** as which element to render (default div). Use 'span' for inline. */
  as?: ElementType
  className?: string
  style?: CSSProperties
  /** viewport threshold for firing */
  threshold?: number
  /** how far the element must scroll into view before firing */
  rootMargin?: string
  /** if true, keep animating each time it re-enters the viewport */
  repeat?: boolean
}

export function EditableReveal({
  children,
  index = 0,
  step = 60,
  as,
  className = '',
  style,
  threshold = 0.15,
  rootMargin = '0px 0px -8% 0px',
  repeat = false,
}: EditableRevealProps) {
  // Start unmounted so JS-off visitors always see content (progressive
  // enhancement). Arm the reveal only after mount; the CSS handles the visible
  // → hidden → visible dance under the `is-armed` class.
  const [armed, setArmed] = useState(false)
  const [visible, setVisible] = useState(false)
  const nodeRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const prefersReduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setVisible(true)
      return
    }
    setArmed(true)
    const node = nodeRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (!repeat) observer.unobserve(entry.target)
          } else if (repeat) {
            setVisible(false)
          }
        }
      },
      { threshold, rootMargin }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin, repeat])

  const Component = (as || 'div') as ElementType
  const delay = Math.max(0, index) * step
  const mergedStyle: CSSProperties = {
    ...(armed ? { transitionDelay: `${delay}ms` } : null),
    ...style,
  }
  const classes = [
    'editable-reveal',
    armed ? 'is-armed' : '',
    visible ? 'is-visible' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component ref={nodeRef} className={classes} style={mergedStyle}>
      {children}
    </Component>
  )
}
