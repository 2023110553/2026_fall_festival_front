import { useMapContext } from '../../context/MapProvider'
import BoothListPanel from './BoothListPanel'
import { useEffect, useRef, useState } from 'react'
import BoothDetailPanel from './BoothDetailPanel'
import * as S from './BottomSheet.styles'

export default function BottomSheet() {
  const { isSheetOpen, selectedBoothId, setSelectedBoothId, setSheetTab, setSearchTerm } = useMapContext()
  const [isSearching, setIsSearching] = useState(false)
  const previousSnap = useRef('middle')
  const [sheetHeight, setSheetHeight] = useState(null)
  const [snapPosition, setSnapPosition] = useState('middle')
  const [isDragging, setIsDragging] = useState(false)
  const sheetRef = useRef(null)
  const dragRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (selectedBoothId != null) {
      setSheetHeight(null)
      setSnapPosition('high')
    }
    if (contentRef.current) contentRef.current.scrollTop = 0
  }, [selectedBoothId])

  useEffect(() => {
    if (!isSheetOpen || isSearching) return

    const handleOutsidePointerDown = (event) => {
      if (!event.isPrimary || event.button !== 0 || dragRef.current) return
      if (event.target instanceof Element && event.target.closest('[data-sheet-collapse-ignore]')) return
      const sheet = sheetRef.current
      if (!sheet || sheet.contains(event.target)) return

      if (event.clientY < sheet.getBoundingClientRect().top) {
        setSheetHeight(null)
        setSnapPosition('low')
      }
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown, true)
    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown, true)
    }
  }, [isSheetOpen, isSearching])

  const handleDragStart = (event) => {
    if (isSearching) return
    if (!event.isPrimary || event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    const styles = getComputedStyle(sheetRef.current)
    const startHeight = sheetRef.current.getBoundingClientRect().height
    setSheetHeight(startHeight)
    setIsDragging(true)
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startHeight,
      currentHeight: startHeight,
      minHeight: parseFloat(styles.minHeight),
      maxHeight: parseFloat(styles.maxHeight),
      topGap: parseFloat(styles.getPropertyValue('--sheet-top-gap')),
    }
  }

  const handleDragMove = (event) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const nextHeight = drag.startHeight + drag.startY - event.clientY
    drag.currentHeight = Math.min(drag.maxHeight, Math.max(drag.minHeight, nextHeight))
    setSheetHeight(drag.currentHeight)
  }

  const handleDragEnd = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    const drag = dragRef.current
    const points = [
      { position: 'low', height: drag.minHeight },
      { position: 'middle', height: Math.min(drag.maxHeight, Math.max(drag.minHeight, (drag.maxHeight + drag.topGap) * 0.75)) },
      { position: 'high', height: drag.maxHeight },
    ]
    const nearest = points.reduce((closest, point) =>
      Math.abs(point.height - drag.currentHeight) < Math.abs(closest.height - drag.currentHeight)
        ? point : closest
    )
    setSnapPosition(nearest.position)
    setSheetHeight(null)
    setIsDragging(false)
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  if (!isSheetOpen) return null

  const handleSelectBooth = (id) => {
    setIsSearching(false)
    setSearchTerm('')
    setSelectedBoothId(id)
    setSheetTab('info')
  }

  return (
    <S.Sheet
      ref={sheetRef}
      $snapPosition={snapPosition}
      $isDragging={isDragging}
      style={{ height: sheetHeight == null ? undefined : `${sheetHeight}px` }}
    >
      <S.DragHandle
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
        onLostPointerCapture={handleDragEnd}
      >
        <S.HandleBar />
      </S.DragHandle>
      <S.Content ref={contentRef}>
        {selectedBoothId == null ? (
        <BoothListPanel
          onSelectBooth={handleSelectBooth}
          isSearching={isSearching}
          onOpenSearch={() => {
            previousSnap.current = snapPosition
            setSearchTerm('')
            setSheetHeight(null)
            setSnapPosition('high')
            setIsSearching(true)
          }}
          onCancelSearch={() => {
            setSearchTerm('')
            setIsSearching(false)
            setSnapPosition(previousSnap.current)
          }}
        />
      ) : (
        <BoothDetailPanel boothId={selectedBoothId} onBack={() => setSelectedBoothId(null)} />
        )}
      </S.Content>
    </S.Sheet>
  )
}
