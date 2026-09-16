// 아직 쿠폰을 긁지 않았어요 and 스크래치 인터랙션 모달

import { useEffect, useRef } from 'react'
import Modal from '../../../../components/common/Modal'

const CANVAS_WIDTH = 264
const CANVAS_HEIGHT = 58
const BRUSH_RADIUS = 10
const REVEAL_THRESHOLD = 0.55 // 55% 이상 긁으면 결과 공개
const SAMPLE_STEP = 4 // getImageData 전체 순회 대신 4픽셀마다 1개만 샘플링해서 부하 절감

// onReveal: 스크래치가 기준치 이상 진행되면 호출 → 상위에서 CouponResultModal로 전환
// coupon: 발급 시점에 이미 확정된 결과(isWin/reward) — 스크래치 레이어 밑에 미리 그려서 긁는 도중에 보이게 함
export default function ScratchCouponModal({ isOpen, onClose, onReveal, coupon }) {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const isScratchingRef = useRef(false)
  const revealedRef = useRef(false)
  const checkScheduledRef = useRef(false)
  const lastPointRef = useRef(null)

  // 모달이 열릴 때마다 캔버스를 은색 스크래치 면으로 초기화
  useEffect(() => {
    if (!isOpen) return

    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1
    canvas.width = CANVAS_WIDTH * dpr
    canvas.height = CANVAS_HEIGHT * dpr
    canvas.style.width = `${CANVAS_WIDTH}px`
    canvas.style.height = `${CANVAS_HEIGHT}px`

    // getScratchedRatio에서 getImageData를 반복 호출하므로 브라우저에 미리 알려서 최적화 경로를 타게 함
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    // canvas는 회색 스크래치 레이어만 담당 — 실제 결과 텍스트는 canvas 뒤에 별도 div로 깔아두고
    // destination-out으로 이 레이어를 지우면 그 뒤의 div가 비쳐 보이는 구조
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = '#737373'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ctxRef.current = ctx
    isScratchingRef.current = false
    revealedRef.current = false
    lastPointRef.current = null
  }, [isOpen])

  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
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
    if (checkScheduledRef.current || revealedRef.current) return
    checkScheduledRef.current = true

    requestAnimationFrame(() => {
      checkScheduledRef.current = false
      if (revealedRef.current) return

      const ratio = getScratchedRatio()
      if (ratio >= REVEAL_THRESHOLD) {
        revealedRef.current = true
        onReveal?.()
      }
    })
  }

  const getScratchedRatio = () => {
    const ctx = ctxRef.current
    const dpr = window.devicePixelRatio || 1
    const { data } = ctx.getImageData(0, 0, CANVAS_WIDTH * dpr, CANVAS_HEIGHT * dpr)

    let transparent = 0
    let sampled = 0
    for (let i = 3; i < data.length; i += 4 * SAMPLE_STEP) {
      sampled++
      if (data[i] === 0) transparent++
    }
    return sampled === 0 ? 0 : transparent / sampled
  }

  const handlePointerDown = (e) => {
    if (revealedRef.current) return
    canvasRef.current.setPointerCapture(e.pointerId)
    isScratchingRef.current = true
    lastPointRef.current = null
    const { x, y } = getPoint(e)
    scratchTo(x, y)
    scheduleScratchedCheck()
  }

  const handlePointerMove = (e) => {
    if (!isScratchingRef.current || revealedRef.current) return
    const { x, y } = getPoint(e)
    scratchTo(x, y)
    scheduleScratchedCheck()
  }

  const handlePointerUp = () => {
    isScratchingRef.current = false
    lastPointRef.current = null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#111' }}>
          아직 쿠폰을 긁지 않았어요
        </h2>
        <p style={{ fontSize: '12px', color: '#666', margin: '6px 0 16px' }}>
          손으로 문질러서 당첨 결과를 확인해보세요
        </p>

        <div
          style={{
            position: 'relative',
            width: `${CANVAS_WIDTH}px`,
            height: `${CANVAS_HEIGHT}px`,
            margin: '0 auto',
          }}
        >
          {/* canvas 밑에 깔린 실제 결과 — 스크래치 레이어가 지워지면 이 텍스트가 비쳐 보임 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              backgroundColor: '#9F9C99',
              color: '#100B0B',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            {coupon?.isWin ? coupon.reward : '꽝'}
          </div>

          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{
              position: 'absolute',
              inset: 0,
              touchAction: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          />
        </div>

        <div style={{ marginTop: '16px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#ededed',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#666',
              cursor: 'pointer',
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </Modal>
  )
}
