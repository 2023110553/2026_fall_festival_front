import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import BoothSelectDropdown from './components/BoothSelectDropdown'
import MessageForm from './components/MessageForm'

// 등불 "달기"(+ 버튼) 플로우 — 지도 섹션과는 별개 담당 영역 (map-section-scope-and-roles.md 명시).
// 로그인 → 부스선택 → 닉네임/한마디 → 등록 → 스크래치 쿠폰 → (필요시) 확인코드 인증 순서.
// 비로그인 상태로 진입하면 로그인 모달(app/auth)을 먼저 띄워야 한다 — 기능명세서 "등불 달기 진입" 항목.
export default function LanternFlowPage() {
  const { isLoggedIn } = useAuth()
  const [boothId, setBoothId] = useState(null)
  const [nickname, setNickname] = useState('')
  const [message, setMessage] = useState('')

  if (!isLoggedIn) {
    return <p>로그인이 필요해요 — 로그인 모달 연동 예정 (app/auth)</p>
  }

  return (
    <div>
      <p>등불 달기 (1/3)</p>
      <BoothSelectDropdown booths={[]} value={boothId} onChange={setBoothId} />
      <MessageForm
        nickname={nickname}
        message={message}
        onChangeNickname={setNickname}
        onChangeMessage={setMessage}
      />
      <button disabled={!boothId || !message}>등불 달기</button>
    </div>
  )
}
