// 개발진 — 팀별 역할 태그, 팀장(👑), 팀원 명단 카드
export default function DevTeamList({ teams = [] }) {
  return (
    <ul>
      {teams.map((team) => (
        <li key={team.role}>
          <strong>{team.role}</strong> — {team.lead} 👑, {team.members?.join(', ')}
        </li>
      ))}
    </ul>
  )
}
