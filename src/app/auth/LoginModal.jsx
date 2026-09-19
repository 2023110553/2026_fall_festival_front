import Modal from '../../components/common/Modal'
import { useAuth } from '../../hooks/useAuth'
import * as S from './LoginModal.styles'

// 카카오 1초 로그인 모달 — 등불 달기(+) 진입 시 비로그인 상태면 이 모달을 먼저 띄운다.
export default function LoginModal({ open, onClose }) {
  const { login } = useAuth()

  const handleKakaoLogin = () => {
    // TODO: 백엔드 카카오 SDK/OAuth 연동
    // Kakao.Auth.login({
    //   success: (authObj) => login({ accessToken: authObj.access_token }),
    // })

    // TEMP: 카카오 SDK 연동 전까지 개발 중에만 로그인 상태를 흉내내는 목업 — 실 연동 시 제거
    if (import.meta.env.DEV) {
      login({ accessToken: 'dev-mock-token', user: { id: 'dev', nickname: '테스트유저' } })
    }

    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <S.Container>
        <S.CloseButton onClick={onClose} aria-label="닫기">
          ✕
        </S.CloseButton>
        <S.Header>
          <S.Title>로그인</S.Title>
          <S.SubTitle>1초만에 로그인하고 등불 달기!</S.SubTitle>
        </S.Header>

        {/* TODO: 백엔드 카카오 인가코드/토큰 전달 핸들러 연결 */}
        <S.KakaoButton onClick={handleKakaoLogin}>
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