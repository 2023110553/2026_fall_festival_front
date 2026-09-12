import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import { useAuth } from '../../hooks/useAuth'

// 카카오 1초 로그인 모달 — 등불 달기(+) 진입 시 비로그인 상태면 이 모달을 먼저 띄운다.
export default function LoginModal({ open, onClose }) {
  const { login } = useAuth()

  const handleKakaoLogin = () => {
    // TODO: 카카오 SDK 연동 — 성공 콜백에서 login({ accessToken, user })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <p>1초만에 로그인하고 등불 달기!</p>
      <Button onClick={handleKakaoLogin}>카카오 1초 로그인</Button>
    </Modal>
  )
}
