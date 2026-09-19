// 확인코드 모달

import { memo, useCallback, useEffect, useState } from 'react'
import Modal from '../../../components/common/Modal'

// onSubmit(code): 상위에서 useCoupon(couponId, code) 호출 — 실패 시 reject(에러) 해주면
// 이 모달이 알아서 에러 문구를 띄우고 재입력을 받는다.
function VerifyCodeModal({ isOpen, onClose, onSubmit }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 닫혔다 다시 열릴 때 이전 입력/에러가 남아있지 않도록 초기화
  useEffect(() => {
    if (!isOpen) return
    setCode('')
    setError('')
    setIsSubmitting(false)
  }, [isOpen])

  const handleChange = useCallback((e) => {
    setCode(e.target.value)
    setError('')
  }, [])

  const handleSubmit = useCallback(async () => {
    if (code.length < 1 || isSubmitting) return
    setIsSubmitting(true)
    try {
      await onSubmit(code)
    } catch (err) {
      setError(err?.message || '올바른 코드가 아닙니다.')
    } finally {
      setIsSubmitting(false)
    }
  }, [code, isSubmitting, onSubmit])

  const canSubmit = code.length >= 1 && !isSubmitting

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ textAlign: 'left', padding: '4px 0' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#111' }}>
          확인 코드를 입력해주세요
        </h2>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '6px', margin: '6px 0 0 0' }}>
          주점에서 직접 서버한테 보여주세요
        </p>

        <input
          value={code}
          onChange={handleChange}
          placeholder="확인 코드 입력"
          disabled={isSubmitting}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #ddd',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />

        {error && (
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#DC7054', margin: '5px 0 5px 4px' }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: '8px', marginTop: error ? '0' : '20px' }}>
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
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              backgroundColor: canSubmit ? '#111' : '#ddd',
              color: canSubmit ? '#fff' : '#888',
            }}
          >
            {isSubmitting ? '확인 중...' : '확인'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default memo(VerifyCodeModal)
