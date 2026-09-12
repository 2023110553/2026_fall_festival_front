import { useState } from 'react'
import { useAuth } from '../../../../hooks/useAuth'
import EmptyState from '../../../../components/common/EmptyState'

// 등불 보기 탭 — 목록/신고/삭제 "UI만" 이 도메인 담당 (map-section-scope-and-roles.md).
// 실제 등불 API·로그인 인증 로직은 다른 팀 소관이라, useAuth() 훅으로 인증 상태만 받아서 쓴다.
export default function LanternViewTab({ boothId }) {
  const { isLoggedIn } = useAuth()
  const [onlyMine, setOnlyMine] = useState(false)

  // TODO: getBoothLanterns(boothId)로 목록 조회 (api/lantern.js)
  const lanterns = []

  return (
    <div>
      <p>등불을 달아 부스를 밝혀주세요! 욕설, 비방과 같은 내용을 게시할 시 처벌을 받을 수 있습니다.</p>
      <label>
        <input
          type="checkbox"
          checked={onlyMine}
          onChange={(e) => setOnlyMine(e.target.checked)}
          disabled={!isLoggedIn}
        />
        내가 쓴 등불만 보기
      </label>

      {lanterns.length === 0 ? (
        <EmptyState>등불이 아직 없습니다.</EmptyState>
      ) : (
        <ul>
          {lanterns.map((lantern) => (
            <li key={lantern.id}>{lantern.message}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
