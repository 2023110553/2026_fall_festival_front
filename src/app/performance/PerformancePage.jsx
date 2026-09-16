import { useState } from 'react'
import TimelineList from './components/TimelineList'
import SetlistModal from './components/Setlist'

// 공연 안내(STAGE) — 날짜 탭 + 지금 공연중 하이라이트 + 시간대별 타임라인 + 상세(셋리스트) 모달
export default function PerformancePage() {
  const [selectedId, setSelectedId] = useState(null)

  return (
    <div>
      <TimelineList performances={[]} onSelect={setSelectedId} />
      <SetlistModal open={!!selectedId} onClose={() => setSelectedId(null)} setlist={[]} />
    </div>
  )
}
