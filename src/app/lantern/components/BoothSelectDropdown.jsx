// 등불 달기 모달의 부스 선택 드롭다운 — 등록된 부스 목록에서 선택하면 입력 영역에 부스명 표시
export default function BoothSelectDropdown({ booths = [], value, onChange }) {
  return (
    <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>
        부스 선택
      </option>
      {booths.map((booth) => (
        <option key={booth.id} value={booth.id}>
          {booth.name}
        </option>
      ))}
    </select>
  )
}
