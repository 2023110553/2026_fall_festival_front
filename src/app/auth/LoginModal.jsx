import Modal from '../../components/common/Modal'
import { useEffect, useState } from 'react'
import { startKakaoLogin, loginErrorMessage } from './kakaoOAuth'
import * as S from './LoginModal.styles'

// 카카오 1초 로그인 모달 — 등불 달기(+) 진입 시 비로그인 상태면 이 모달을 먼저 띄운다.
export default function LoginModal({ open, onClose, message }) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const errorMessage = error || message

  useEffect(() => {
    // 카카오 화면에서 뒤로가면 bfcache가 pending=true까지 복원할 수 있다.
    const resetPending = () => setPending(false)
    window.addEventListener('pageshow', resetPending)
    return () => window.removeEventListener('pageshow', resetPending)
  }, [])

  const handleClose = () => {
    setError('')
    setPending(false)
    onClose()
  }

  const handleKakaoLogin = () => {
    if (pending) return
    setError('')
    setPending(true)
    try {
      startKakaoLogin()
    } catch (loginError) {
      setPending(false)
      setError(loginErrorMessage(loginError))
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <S.Container>
        <S.CloseButton onClick={handleClose} aria-label="닫기">
          ✕
        </S.CloseButton>
        <S.Header>
          <S.Title>로그인</S.Title>
          <S.SubTitle role={errorMessage ? 'alert' : undefined}>
            {errorMessage || '1초만에 로그인하고 등불 달기!'}
          </S.SubTitle>
        </S.Header>

        <S.KakaoButton onClick={handleKakaoLogin} disabled={pending}>
          <S.KakaoIcon
            width="18"
            height="17"
            viewBox="0 0 18 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9 0C4.029 0 0 3.13 0 6.992c0 2.5 1.66 4.698 4.156 5.925l-.854 3.125c-.075.276.24.49.467.34l3.714-2.46c.498.05 1.004.077 1.517.077 4.971 0 9-3.13 9-6.992C18 3.13 13.971 0 9 0z"
              fill="#000000"
            />
          </S.KakaoIcon>
          카카오 1초 로그인
        </S.KakaoButton>
      </S.Container>
    </Modal>
  )
}
