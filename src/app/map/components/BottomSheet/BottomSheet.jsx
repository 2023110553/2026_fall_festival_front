import { useMapContext } from '../../context/MapProvider'
import BoothListPanel from './BoothListPanel'
import { useEffect, useRef, useState } from 'react'
import BoothDetailPanel from './BoothDetailPanel'
import * as S from './BottomSheet.styles'

export default function BottomSheet() {
  const {
    isSheetOpen, selectedBoothId, setSelectedBoothId, sheetTab, setSheetTab, selectedDate,
    setSearchTerm, listTimeOfDay, searchQuery, openSearch, goBack,
  } = useMapContext()
  // 검색 화면인지는 URL이 정한다(MapProvider). 부스를 고르면 q가 남아 있어도 상세를 보여줘야 하므로
  // booth가 없을 때만 검색 화면이다 — 이 값이 true면 아래에서 드래그 핸들도 숨긴다.
  const isSearching = searchQuery != null && selectedBoothId == null
  const [sheetHeight, setSheetHeight] = useState(null)
  const [snapPosition, setSnapPosition] = useState('middle')
  const [isDragging, setIsDragging] = useState(false)
  const sheetRef = useRef(null)
  const dragRef = useRef(null)
  const contentRef = useRef(null)

  // 2026-09-26: 진입 경로에 따라 시트 높이를 다르게 연다(기획 요구).
  //   홈 인기부스 클릭(= URL에 ?booth=를 달고 지도에 들어온 경우) → 'high', 상세를 바로 읽게
  //   지도 안에서 고른 경우(3D 핀 / 목록 카드 / 검색 결과) → 'low', 카메라가 옮겨간 부스가 보이게
  //
  // 'high'는 화면 위 40px만 남기고 전부 덮어서 카메라 연출이 사용자 눈에 안 보인다. 그래서 지도 안에서
  // 고를 때는 쓰지 않는다(지도 앱에서 핀을 누르면 카드가 살짝 올라오는 것과 같은 흐름).
  //
  // ref에 "진입할 때 URL에 있던 부스 id"를 담아 두고 그 부스일 때만 'high'로 연다. 단순히 첫 실행에서
  // 소비해버리면 안 되는데, MapProvider의 히스토리 시딩이 booth를 한 번 뺐다가 다시 넣기 때문에
  // 이 이펙트가 진입 직후 세 번 돌기 때문이다. 대신 사용자가 지도 안에서 한 번이라도 직접 고르면
  // (handleSelectBooth / 검색 진입) 그때 플래그를 버린다.
  const entryBoothIdRef = useRef(selectedBoothId)

  useEffect(() => {
    if (selectedBoothId != null) {
      setSheetHeight(null)
      setSnapPosition(selectedBoothId === entryBoothIdRef.current ? 'high' : 'low')
    }
    if (contentRef.current) contentRef.current.scrollTop = 0
  }, [selectedBoothId])

  // 목록으로 돌아오면(뒤로가기 / 「취소」) 시트를 목록 기본 높이로 되돌린다.
  // 상세를 보려고 끌어올린 높이가 그대로 남으면 목록이 화면을 덮은 채로 돌아와서,
  // "축소된 지도로 돌아왔다"는 느낌이 나지 않는다.
  useEffect(() => {
    if (selectedBoothId != null || isSearching) return
    setSheetHeight(null)
    setSnapPosition('middle')
  }, [selectedBoothId, isSearching])

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
    if (!event.isPrimary || event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    const sheet = sheetRef.current
    const startHeight = sheet.getBoundingClientRect().height
    // min()/max()/calc() 값은 parseFloat로 읽을 수 없으므로 브라우저가 계산한 높이를 사용한다.
    const originalHeight = sheet.style.height
    const originalTransition = sheet.style.transition
    sheet.style.transition = 'none'
    const points = [
      { position: 'low', cssHeight: 'var(--collapsed-height)' },
      { position: 'middle', cssHeight: 'var(--middle-height)' },
      { position: 'high', cssHeight: 'calc(100dvh - var(--sheet-top-gap))' },
    ].map(({ position, cssHeight }) => {
      sheet.style.height = cssHeight
      return { position, height: sheet.getBoundingClientRect().height }
    })
    sheet.style.height = originalHeight
    sheet.style.transition = originalTransition
    setSheetHeight(startHeight)
    setIsDragging(true)
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startHeight,
      currentHeight: startHeight,
      minHeight: points[0].height,
      maxHeight: points[2].height,
      points,
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
    const nearest = drag.points.reduce((closest, point) =>
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

  // 지도 안에서 부스를 직접 골랐다 — 진입 부스 플래그를 버려서 이후로는 전부 'low'로 열린다.
  // 검색 화면을 닫지 않는 것은 의도다(setIsSearching 같은 게 사라진 이유): 검색 결과에서 고른
  // 부스는 URL에 q를 남겨 둬야 뒤로가기했을 때 그 검색어 상태로 돌아온다.
  const handleSelectBooth = (id) => {
    entryBoothIdRef.current = null
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
      {!isSearching && (
        <S.DragHandle
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
          onLostPointerCapture={handleDragEnd}
        >
          <S.HandleBar />
        </S.DragHandle>
      )}
      <S.Content ref={contentRef}>
        {selectedBoothId == null ? (
        <BoothListPanel
          onSelectBooth={handleSelectBooth}
          isSearching={isSearching}
          onOpenSearch={() => {
            entryBoothIdRef.current = null
            setSearchTerm('')
            setSheetHeight(null)
            setSnapPosition('high')
            openSearch()
          }}
          // 「취소」도 뒤로가기와 같은 동작이어야 버튼과 제스처가 서로 다른 데로 가지 않는다.
          // 돌아간 뒤 높이는 아래 이펙트가 목록 기준('middle')으로 맞춘다.
          onCancelSearch={() => {
            setSearchTerm('')
            goBack()
          }}
        />
      ) : (
        <BoothDetailPanel
          boothId={selectedBoothId}
          onBack={goBack}
          sheetTab={sheetTab}
          setSheetTab={setSheetTab}
          selectedDate={selectedDate}
          isNight={listTimeOfDay === 'night'}
        />
        )}
      </S.Content>
    </S.Sheet>
  )
}
