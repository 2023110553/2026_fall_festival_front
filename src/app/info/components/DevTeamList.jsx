import * as S from './DevTeamList.styles'

export default function DevTeamList({ teams = [] }) {
  return <S.List>{teams.map((team) => <S.Card key={team.role}>
    <S.Role>{team.role}</S.Role>
    {team.lead && <S.Lead>{team.lead}</S.Lead>}
    <S.Members>{team.members?.join(' · ')}</S.Members>
  </S.Card>)}</S.List>
}
