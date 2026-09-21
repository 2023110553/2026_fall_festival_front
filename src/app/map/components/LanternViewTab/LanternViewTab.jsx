import { useState } from 'react'
import { useAuth } from '../../../../hooks/useAuth'
import EmptyState from '../../../../components/common/EmptyState'
import LanternCard from '../../../lantern/components/LanternCard'

// 등불 보기 탭 — 목록/신고/삭제 "UI만" 이 도메인 담당 (map-section-scope-and-roles.md).
// 실제 등불 API·로그인 인증 로직은 다른 팀 소관이라, useAuth() 훅으로 인증 상태만 받아서 쓴다.
export default function LanternViewTab() {
  const { isLoggedIn } = useAuth()
  const [onlyMine, setOnlyMine] = useState(false)

  // TODO: getBoothLanterns(boothId)로 목록 조회 (api/lantern.js)
  // 임시데이터
  const lanterns = [
    {
      id: 1,
      nickname: '익명의 코끼리',
      message: '아니 여기 부스 직원 너무 잘생겼구요 음식 진짜 맛있어요 ㅠㅠ',
      createdAt: '2026-09-29T20:44:00+09:00',
      isMine: false,
    },
    {
      id: 2,
      nickname: '닉네임',
      message: '여기서 파는 삼겹살 너무 맛있어여 친절하심',
      createdAt: '2026-09-29T20:44:00+09:00',
      isMine: true,
    },
  ]
  const visibleLanterns = lanterns.filter((lantern) =>
    !onlyMine || !isLoggedIn || lantern.isMine
  )

  return (
    <div>
      <p>등불을 달아 부스를 밝혀주세요! 욕설, 비방과 같은 내용을 게시할 시 처벌을 받을 수 있습니다.</p>
      <label>
        <input
          type="checkbox"
          checked={isLoggedIn && onlyMine}
          onChange={(e) => setOnlyMine(e.target.checked)}
          disabled={!isLoggedIn}
        />
        내가 쓴 등불만 보기
      </label>

      {visibleLanterns.length === 0 ? (
        <EmptyState>등불이 아직 없습니다.</EmptyState>
      ) : (
        <ul>
          {visibleLanterns.map((lantern) => (
            <li key={lantern.id}>
              <LanternCard lantern={lantern} isMine={isLoggedIn && lantern.isMine} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
