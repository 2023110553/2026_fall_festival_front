// 아직 쿠폰을 긁지 않았어요 and 스크래치 인터랙션 모달

import { useEffect, useRef } from 'react'
import Modal from '../../../components/common/Modal'
import { SCRATCH_THRESHOLD } from '../utils/couponRules'
import * as S from './ScratchCouponModal.styles'

const CANVAS_WIDTH = 264
const CANVAS_HEIGHT = 58
const BRUSH_RADIUS = 10
const SAMPLE_STEP = 4 // getImageData 전체 순회 대신 4픽셀마다 1개만 샘플링해서 부하 절감
const COVER_SRC = `${import.meta.env.BASE_URL}images/scratch-cover.png`

// onReveal: 스크래치가 기준치 이상 진행되면 호출 → 상위에서 CouponResultModal로 전환
// coupon: 발급 시점에 이미 확정된 결과(isWin/reward) — 스크래치 레이어 밑에 미리 그려서 긁는 도중에 보이게 함
export default function ScratchCouponModal({ isOpen, onClose, onScratchStart, onReveal, coupon, isNewCoupon = false }) {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const isScratchingRef = useRef(false)
  const revealedRef = useRef(false)
  const checkFrameRef = useRef(null)
  const coverReadyRef = useRef(false)
  const lastPointRef = useRef(null)
  const scratchRequestRef = useRef(null)
  const scratchReadyRef = useRef(false)
  const pendingPointRef = useRef(null)

  // 모달이 열릴 때마다 캔버스를 은색 스크래치 면으로 초기화
  useEffect(() => {
    if (!isOpen) return

    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1
    canvas.width = CANVAS_WIDTH * dpr
    canvas.height = CANVAS_HEIGHT * dpr

    // getScratchedRatio에서 getImageData를 반복 호출하므로 브라우저에 미리 알려서 최적화 경로를 타게 함
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    // canvas는 이미지 커버만 담당 — 실제 결과 텍스트는 canvas 뒤에 별도 div로 깔아두고
    // destination-out으로 이 레이어를 지우면 그 뒤의 div가 비쳐 보이는 구조
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = '#737373'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ctxRef.current = ctx
    coverReadyRef.current = false
    isScratchingRef.current = false
    revealedRef.current = false
    lastPointRef.current = null
    scratchRequestRef.current = null
    scratchReadyRef.current = false
    pendingPointRef.current = null

    const image = new Image()
    let cancelled = false
    image.onload = () => {
      if (cancelled) return
      // 중앙을 기준으로 cover 처리하여 이미지 비율을 유지한다.
      const scale = Math.max(CANVAS_WIDTH / image.naturalWidth, CANVAS_HEIGHT / image.naturalHeight)
      const width = image.naturalWidth * scale
      const height = image.naturalHeight * scale
      ctx.drawImage(image, (CANVAS_WIDTH - width) / 2, (CANVAS_HEIGHT - height) / 2, width, height)
      coverReadyRef.current = true
    }
    image.onerror = () => {
      if (!cancelled) coverReadyRef.current = true
    }
    image.src = COVER_SRC

    return () => {
      cancelled = true
      image.onload = null
      image.onerror = null
      if (checkFrameRef.current !== null) cancelAnimationFrame(checkFrameRef.current)
      checkFrameRef.current = null
      coverReadyRef.current = false
      isScratchingRef.current = false
      ctxRef.current = null
    }
  }, [isOpen])

  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * CANVAS_WIDTH / rect.width,
      y: (e.clientY - rect.top) * CANVAS_HEIGHT / rect.height,
    }
  }

  // 점 하나만 찍으면(탭) 원으로, 움직이면 이전 점~현재 점을 선으로 이어 지워서
  // 포인터 이벤트 사이 간격이 벌어져도(빠르게 움직여도) 끊기지 않게 함
  const scratchTo = (x, y) => {
    const ctx = ctxRef.current
    const last = lastPointRef.current
    ctx.globalCompositeOperation = 'destination-out'

    if (last) {
      ctx.lineWidth = BRUSH_RADIUS * 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(x, y)
      ctx.stroke()
    } else {
      ctx.beginPath()
      ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2)
      ctx.fill()
    }

    lastPointRef.current = { x, y }
  }

  // getImageData는 비용이 크니 프레임당 한 번만 계산되도록 requestAnimationFrame으로 스로틀링
  const scheduleScratchedCheck = () => {
    if (checkFrameRef.current !== null || revealedRef.current) return

    checkFrameRef.current = requestAnimationFrame(() => {
      checkFrameRef.current = null
      if (revealedRef.current) return

      const ratio = getScratchedRatio()
      if (ratio >= SCRATCH_THRESHOLD) {
        revealedRef.current = true
        onReveal?.()
      }
    })
  }

  const getScratchedRatio = () => {
    const ctx = ctxRef.current
    const { data } = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)

    let transparent = 0
    let sampled = 0
    for (let i = 3; i < data.length; i += 4 * SAMPLE_STEP) {
      sampled++
      if (data[i] === 0) transparent++
    }
    return sampled === 0 ? 0 : transparent / sampled
  }

  const handlePointerDown = (e) => {
    if (!coverReadyRef.current || revealedRef.current || e.button !== 0) return
    canvasRef.current.setPointerCapture(e.pointerId)
    isScratchingRef.current = true
    lastPointRef.current = null
    pendingPointRef.current = getPoint(e)

    if (!scratchRequestRef.current) {
      scratchRequestRef.current = Promise.resolve(onScratchStart?.())
        .then(() => {
          scratchReadyRef.current = true
          if (!isScratchingRef.current || !pendingPointRef.current) return
          scratchTo(pendingPointRef.current.x, pendingPointRef.current.y)
          scheduleScratchedCheck()
        })
        .catch(() => {
          scratchRequestRef.current = null
          scratchReadyRef.current = false
        })
    }

    if (scratchReadyRef.current) {
      scratchTo(pendingPointRef.current.x, pendingPointRef.current.y)
      scheduleScratchedCheck()
    }
  }

  const handlePointerMove = (e) => {
    if (!isScratchingRef.current || revealedRef.current) return
    const { x, y } = getPoint(e)
    pendingPointRef.current = { x, y }
    if (!scratchReadyRef.current) return
    scratchTo(x, y)
    scheduleScratchedCheck()
  }

  const handlePointerUp = () => {
    isScratchingRef.current = false
    lastPointRef.current = null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} style={S.panelStyle}>
      <S.Container>
        <S.Title>
          {isNewCoupon ? '등불을 성공적으로 남겼어요!' : '아직 쿠폰을 긁지 않았어요.'}
        </S.Title>
        <S.Description>
          손으로 문질러서 당첨 결과를 확인해보세요.
        </S.Description>

        <S.ScratchArea $height={CANVAS_HEIGHT}>
          {/* canvas 밑에 깔린 실제 결과 — 스크래치 레이어가 지워지면 이 텍스트가 비쳐 보임 */}
          <S.Result>
            <S.RewardTitle>{coupon?.isWin ? coupon.reward : '꽝'}</S.RewardTitle>
            {coupon?.isWin && coupon.usageDescription && <S.UsageDescription>{coupon.usageDescription}</S.UsageDescription>}
          </S.Result>

          <S.Canvas
            $height={CANVAS_HEIGHT}
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onLostPointerCapture={handlePointerUp}
            onPointerLeave={handlePointerUp}
            aria-label="문질러서 쿠폰 당첨 결과 확인"
          />
        </S.ScratchArea>

        <S.Footer>
          <S.CloseButton
            type="button"
            onClick={onClose}
          >
            닫기
          </S.CloseButton>
        </S.Footer>
      </S.Container>
    </Modal>
  )
}
