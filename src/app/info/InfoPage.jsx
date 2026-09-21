import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import TopHeader from '../../components/common/TopHeader'
import SegmentedTabs from '../../components/common/SegmentedTabs'
import CollabList from './components/CollabList'
import CollabDetail from './components/CollabDetail'
import NoticeList from './components/NoticeList'
import NoticeDetail from './components/NoticeDetail'
import LostFoundList from './components/LostFoundList'
import LostFoundDetail from './components/LostFoundDetail'
import DevTeamList from './components/DevTeamList'
import { COLLAB_MOCKS } from './info.mock'
import { getLostItemDetailMock, getLostItemListMock } from './lostFound.mock'
import { getNoticeDetailMock, NOTICE_LIST_MOCK_RESPONSE } from './notice.mock'
import { DEV_TEAM_MOCKS } from './devTeam.mock'
import * as S from './InfoPage.styles'

const INFO_TABS = [
  { value: 'collab', label: '협업' },
  { value: 'notice', label: '공지' },
  { value: 'lostfound', label: '분실물' },
  { value: 'developer', label: '개발진' },
]

export default function InfoPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab')
  const tab = INFO_TABS.some((item) => item.value === requestedTab) ? requestedTab : 'collab'
  const [lostDate, setLostDate] = useState('2026-09-29')
  const [keyword, setKeyword] = useState('')
  const [selection, setSelection] = useState(null)
  const notices = NOTICE_LIST_MOCK_RESPONSE.data.items

  const lostItems = useMemo(() => {
    return getLostItemListMock({
      found_date: lostDate,
      keyword,
    }).data.items
  }, [keyword, lostDate])

  const selectedItem = useMemo(() => {
    if (!selection) return null
    if (selection.type === 'notice') {
      return getNoticeDetailMock(selection.id).data ?? null
    }
    if (selection.type === 'lostfound') {
      return getLostItemDetailMock(selection.id).data ?? null
    }

    const collections = {
      collab: COLLAB_MOCKS,
    }
    return collections[selection.type]?.find((item) => item.id === selection.id) ?? null
  }, [selection])

  const changeTab = (nextTab) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      next.set('tab', nextTab)
      return next
    }, { replace: true })
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
                <NoticeList notices={notices} onSelect={(id) => openDetail('notice', id)} />
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
              {tab === 'developer' && <DevTeamList teams={DEV_TEAM_MOCKS} />}
            </>
          )}
        </S.Section>
      </S.Content>
    </S.Page>
  )
}
