// 꽝 or 당첨 모달

import { memo, useMemo } from 'react'
import Modal from '../../../components/common/Modal'

const STATUS_TEXT = {
  lose: {
    title: '등불을 성공적으로 남겼어요!',
    description: '아쉽지만 내일 다시 도전하세요.',
  },
  win: {
    title: '등불을 성공적으로 남겼어요!',
    description: '주점에서 직접 서버한테 보여주세요.',
  },
  used: {
    title: '등불을 성공적으로 남겼어요!',
    description: '주점에서 직접 서버한테 보여주세요.',
  },
}

function CouponResultModal({ isOpen, onClose, coupon, onUseClick }) {
  // coupon.status: 'win' | 'lose' | 'used' — coupon이 바뀔 때만 재계산
  const view = useMemo(() => {
    if (!coupon) return null
    const text = STATUS_TEXT[coupon.status]
    if (!text) return null

    return {
      ...text,
      isLose: coupon.status === 'lose',
      isUsed: coupon.status === 'used',
    }
  }, [coupon])

  if (!view) {
    return <Modal isOpen={isOpen} onClose={onClose} />
  }

  const { title, description, isLose, isUsed } = view

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ textAlign: 'left', padding: '4px 0' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#111' }}>{title}</h2>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '6px', margin: '6px 0 0 0' }}>
          {description}
        </p>
      </div>

      <div
        style={{
          marginTop: '16px',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '16px',
          backgroundColor: '#9F9C99',
          color: '#100B0B',
        }}
      >
        {isLose ? '꽝' : coupon.reward}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            flex: 1,
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

        {!isLose && (
          <button
            type="button"
            disabled={isUsed}
            onClick={onUseClick}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: isUsed ? 'not-allowed' : 'pointer',
              backgroundColor: isUsed ? '#ddd' : '#111',
              color: isUsed ? '#888' : '#fff',
            }}
          >
            {isUsed ? '사용완료' : '사용하기'}
          </button>
        )}
      </div>
    </Modal>
  )
}

export default memo(CouponResultModal)
