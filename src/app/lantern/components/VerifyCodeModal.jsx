// 확인코드 모달

import { memo, useCallback, useEffect, useState } from 'react'
import Modal from '../../../components/common/Modal'
import * as S from './VerifyCodeModal.styles'

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
    if (!code.trim() || isSubmitting) return
    setIsSubmitting(true)
    try {
      await onSubmit(code.trim())
    } catch (err) {
      setError(err?.message || '올바른 코드가 아닙니다.')
    } finally {
      setIsSubmitting(false)
    }
  }, [code, isSubmitting, onSubmit])

  const canSubmit = code.trim().length >= 1 && !isSubmitting

  return (
    <Modal isOpen={isOpen} onClose={onClose} style={S.panelStyle}>
      <form onSubmit={(event) => { event.preventDefault(); handleSubmit() }}>
        <S.Title>
          확인 코드를 입력해주세요.
        </S.Title>
        <S.Description>
          주점에서 직접 서버한테 보여주세요.
        </S.Description>

        <S.CodeInput
          value={code}
          onChange={handleChange}
          aria-label="확인 코드"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'coupon-code-error' : undefined}
          autoFocus
          disabled={isSubmitting}
        />

        <S.FeedbackSlot>
          {error && (
          <S.ErrorMessage id="coupon-code-error" role="alert">
            {error}
          </S.ErrorMessage>
          )}
        </S.FeedbackSlot>

        <S.ButtonGroup>
          <S.CloseButton
            type="button"
            onClick={onClose}
          >
            닫기
          </S.CloseButton>
          <S.SubmitButton
            type="submit"
            disabled={!canSubmit}
          >
            {isSubmitting ? '확인 중...' : '확인'}
          </S.SubmitButton>
        </S.ButtonGroup>
      </form>
    </Modal>
  )
}

export default memo(VerifyCodeModal)
