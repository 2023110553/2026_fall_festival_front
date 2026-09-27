import { useEffect, useRef } from 'react'
import { pageName } from './policy.js'

const SOURCES = new Set(['home', 'map', 'booth_detail', 'ticket', 'performance', 'info', 'notice', 'lantern', 'other'])

export function lanternWriteSource({ pathname, activeBooth, ticketOpen = false }) {
  if (ticketOpen) return 'ticket'
  const page = pageName(pathname)
  if (page === 'map' && activeBooth?.boothId != null) return 'booth_detail'
  return page
}

export function restoreLanternWriteSource(value, fallback) {
  return SOURCES.has(value) ? value : fallback
}

// Keep a coupon view until the next actual write opening, within this page/booth visit.
// Closing the coupon alone must not erase its attribution.
export function useLanternWriteSource({ pathname, locationKey, activeBooth, ticketOpen, writeOpen }) {
  const ticketViewed = useRef(false)
  useEffect(() => {
    ticketViewed.current = false
  }, [locationKey, pathname, activeBooth?.boothId])
  useEffect(() => {
    if (ticketOpen) ticketViewed.current = true
  }, [ticketOpen])
  useEffect(() => {
    if (writeOpen) ticketViewed.current = false
  }, [writeOpen])

  return () => lanternWriteSource({ pathname, activeBooth, ticketOpen: ticketViewed.current })
}
