import { useMemo, useState } from 'react'
import TopHeader from '../../components/common/TopHeader'
import SegmentedTabs from '../../components/common/SegmentedTabs'
import CollabList from './components/CollabList'
import CollabDetail from './components/CollabDetail'
import NoticeList from './components/NoticeList'
import NoticeDetail from './components/NoticeDetail'
import LostFoundList from './components/LostFoundList'
import LostFoundDetail from './components/LostFoundDetail'
import DevTeamList from './components/DevTeamList'
import { COLLAB_MOCKS, LOST_FOUND_MOCKS, NOTICE_MOCKS } from './info.mock'
import * as S from './InfoPage.styles'

const INFO_TABS = [
  { value: 'collab', label: '협업' },
  { value: 'notice', label: '공지' },
  { value: 'lostfound', label: '분실물' },
  { value: 'developer', label: '개발진' },
]

export default function InfoPage() {
  const [tab, setTab] = useState('collab')
  const [lostDate, setLostDate] = useState('9/29')
  const [keyword, setKeyword] = useState('')
  const [selection, setSelection] = useState(null)

  const lostItems = useMemo(() => {
    const query = keyword.trim().toLowerCase()
    return LOST_FOUND_MOCKS.filter((item) => {
      const matchesDate = item.date === lostDate
      const searchableText = `${item.title} ${item.location} ${item.hashtags.join(' ')}`.toLowerCase()
      return matchesDate && (!query || searchableText.includes(query))
    })
  }, [keyword, lostDate])

  const selectedItem = useMemo(() => {
    if (!selection) return null
    const collections = {
      collab: COLLAB_MOCKS,
      notice: NOTICE_MOCKS,
      lostfound: LOST_FOUND_MOCKS,
    }
    return collections[selection.type]?.find((item) => item.id === selection.id) ?? null
  }, [selection])

  const changeTab = (nextTab) => {
    setTab(nextTab)
    setSelection(null)
  }

  const openDetail = (type, id) => setSelection({ type, id })
  const closeDetail = () => setSelection(null)

  const detail = (() => {
    if (!selection || !selectedItem) return null
    if (selection.type === 'collab') return <CollabDetail collab={selectedItem} onBack={closeDetail} />
    if (selection.type === 'notice') return <NoticeDetail notice={selectedItem} onBack={closeDetail} />
    if (selection.type === 'lostfound') return <LostFoundDetail item={selectedItem} onBack={closeDetail} />
    return null
  })()

  return (
    <S.Page>
      {!detail && <TopHeader title="안내" appearance="light" />}
      <S.Content>
        {!detail && (
          <SegmentedTabs items={INFO_TABS} value={tab} onChange={changeTab} ariaLabel="안내 메뉴" />
        )}
        <S.Section role={detail ? undefined : 'tabpanel'} $isDetail={Boolean(detail)}>
          {detail ?? (
            <>
              {tab === 'collab' && (
                <CollabList collabs={COLLAB_MOCKS} onSelect={(id) => openDetail('collab', id)} />
              )}
              {tab === 'notice' && (
                <NoticeList notices={NOTICE_MOCKS} onSelect={(id) => openDetail('notice', id)} />
              )}
              {tab === 'lostfound' && (
                <LostFoundList
                  items={lostItems}
                  date={lostDate}
                  keyword={keyword}
                  onDateChange={setLostDate}
                  onKeywordChange={setKeyword}
                  onSelect={(id) => openDetail('lostfound', id)}
                />
              )}
              {tab === 'developer' && <DevTeamList teams={[]} />}
            </>
          )}
        </S.Section>
      </S.Content>
    </S.Page>
  )
}
