import { useState } from 'react'
import CollabList from './collab/CollabList'
import NoticeList from './notice/NoticeList'
import LostFoundList from './lostfound/LostFoundList'
import DevTeamList from './team/DevTeamList'

const TABS = [
  { key: 'collab', label: '협업' },
  { key: 'notice', label: '공지' },
  { key: 'lostfound', label: '분실물' },
  { key: 'team', label: '개발진' },
]

// 안내(ABOUT) — 협업/공지/분실물/개발진 4개 하위 탭. 각 탭은 info/{tab}/ 폴더 안에 목록+상세로 나뉜다.
export default function InfoPage() {
  const [tab, setTab] = useState('collab')

  return (
    <div>
      <nav>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} disabled={tab === t.key}>
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'collab' && <CollabList collabs={[]} onSelect={() => {}} />}
      {tab === 'notice' && <NoticeList notices={[]} onSelect={() => {}} />}
      {tab === 'lostfound' && <LostFoundList items={[]} onSelect={() => {}} />}
      {tab === 'team' && <DevTeamList teams={[]} />}
    </div>
  )
}
