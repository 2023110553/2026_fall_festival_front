import * as S from './DevTeamCard.styles'

export default function DevTeamCard({ member, active }) {
  return (
    <S.Card $active={active} aria-hidden={!active}>
      <S.Track $compact={member.id === 'jaewon'}>{member.track}</S.Track>
      <S.Glow aria-hidden="true" />

      {member.imageUrl && (
        <S.ProfileSlot>
          <S.Profile src={member.imageUrl} alt="" />
        </S.ProfileSlot>
      )}

      <S.Info>
        <S.Department>{member.department}</S.Department>
        <S.Name>{member.name}</S.Name>
      </S.Info>

      {!active && <S.Dim aria-hidden="true" />}
    </S.Card>
  )
}
