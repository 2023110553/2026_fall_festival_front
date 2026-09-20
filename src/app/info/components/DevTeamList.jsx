import { useMemo, useRef, useState } from 'react'
import DevTeamCard from './DevTeamCard'
import * as S from './DevTeamList.styles'

const getCardPosition = (index, activeIndex) => index - activeIndex

export default function DevTeamList({ teams }) {
  const [activeRole, setActiveRole] = useState(teams[1]?.id ?? teams[0]?.id ?? '')
  const [activeIndex, setActiveIndex] = useState(0)
  const pointerRef = useRef(null)
  const suppressClickRef = useRef(false)

  const activeTeam = useMemo(
    () => teams.find((team) => team.id === activeRole) ?? teams[0],
    [activeRole, teams],
  )
  const members = activeTeam?.members ?? []

  const selectRole = (roleId) => {
    setActiveRole(roleId)
    setActiveIndex(0)
  }

  const showCard = (index) => {
    if (members.length === 0) return
    setActiveIndex(Math.max(0, Math.min(index, members.length - 1)))
  }

  const getSwipeTarget = (distance, startIndex) => {
    const absoluteDistance = Math.abs(distance)
    if (absoluteDistance < 32) return startIndex

    const steps = 1 + Math.floor((absoluteDistance - 32) / 64)
    return startIndex + (distance < 0 ? steps : -steps)
  }

  const handlePointerDown = (event) => {
    suppressClickRef.current = false
    pointerRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startIndex: activeIndex,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!pointerRef.current || pointerRef.current.id !== event.pointerId) return

    const distance = event.clientX - pointerRef.current.startX
    if (Math.abs(distance) >= 32) suppressClickRef.current = true
    showCard(getSwipeTarget(distance, pointerRef.current.startIndex))
  }

  const handlePointerUp = (event) => {
    if (!pointerRef.current || pointerRef.current.id !== event.pointerId) return

    const { startX, startIndex } = pointerRef.current
    const distance = event.clientX - startX
    pointerRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (Math.abs(distance) >= 32) suppressClickRef.current = true
    showCard(getSwipeTarget(distance, startIndex))
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      showCard(activeIndex - 1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      showCard(activeIndex + 1)
    }
  }

  if (!activeTeam) return null

  return (
    <S.Wrapper>
      <S.RoleTabs aria-label="개발진 역할">
        {teams.map((team) => (
          <S.RoleTab
            key={team.id}
            type="button"
            $active={team.id === activeRole}
            aria-pressed={team.id === activeRole}
            onClick={() => selectRole(team.id)}
          >
            {team.label}
          </S.RoleTab>
        ))}
      </S.RoleTabs>

      <S.Hint>카드를 양 옆으로 스와이프해보세요!</S.Hint>

      <S.CardStage
        role="region"
        aria-label={`${activeTeam.label} 개발진 카드`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { pointerRef.current = null }}
      >
        {members.map((member, index) => {
          const position = getCardPosition(index, activeIndex)
          const active = position === 0

          if (members.length > 5 && (position < -2 || position > 2)) {
            return null
          }

          return (
            <S.CardSlot
              key={member.id}
              type="button"
              $position={position}
              aria-label={`${member.name} 카드 보기`}
              aria-current={active ? 'true' : undefined}
              onClick={() => {
                if (suppressClickRef.current) {
                  suppressClickRef.current = false
                  return
                }
                showCard(index)
              }}
            >
              <DevTeamCard member={member} active={active} />
            </S.CardSlot>
          )
        })}
      </S.CardStage>

      {members.length > 1 && (
        <S.Indicators aria-label="개발진 카드 위치">
          {members.map((member, index) => (
            <S.Indicator
              key={member.id}
              type="button"
              $active={index === activeIndex}
              aria-label={`${index + 1}번째 카드 보기`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => showCard(index)}
            />
          ))}
        </S.Indicators>
      )}
    </S.Wrapper>
  )
}
