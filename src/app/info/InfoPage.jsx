import { useMemo, useState } from 'react'
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
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
  const [lostDate, setLostDate] = useState('2026-09-29')
  const [keyword, setKeyword] = useState('')
  const notices = NOTICE_LIST_MOCK_RESPONSE.data.items
  const navigate = useNavigate()
  const { collabSlug, noticeId, lostItemId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab')
  const tab = INFO_TABS.some((item) => item.value === requestedTab)
    ? requestedTab
    : 'collab'

  const selectedCollab = COLLAB_MOCKS.find((item) => item.id === collabSlug)
  const selectedNotice = noticeId
    ? (getNoticeDetailMock(noticeId).data ?? null)
    : null
  const selectedLostItem = lostItemId
    ? (getLostItemDetailMock(lostItemId).data ?? null)
    : null
  const lostItems = useMemo(() => {
    return getLostItemListMock({
      found_date: lostDate,
      keyword,
    }).data.items
  }, [keyword, lostDate])

  const changeTab = (nextTab) => {
    setSearchParams(nextTab === 'collab' ? {} : { tab: nextTab })
  }

  if (collabSlug && !selectedCollab) {
    return <Navigate to="/info" replace />
  }

  if (noticeId && !selectedNotice) {
    return <Navigate to="/info?tab=notice" replace />
  }

  if (lostItemId && !selectedLostItem) {
    return <Navigate to="/info?tab=lostfound" replace />
  }

  const detail = (() => {
    if (collabSlug && selectedCollab) {
      return (
        <CollabDetail
          collab={selectedCollab}
          onBack={() => navigate('/info')}
        />
      )
    }
    if (noticeId && selectedNotice) {
      return (
        <NoticeDetail
          notice={selectedNotice}
          onBack={() => navigate('/info?tab=notice')}
        />
      )
    }
    if (lostItemId && selectedLostItem) {
      return (
        <LostFoundDetail
          item={selectedLostItem}
          onBack={() => navigate('/info?tab=lostfound')}
        />
      )
    }

    return null
  })()

  return (
    <S.Page>
      {!detail && <TopHeader title="안내" appearance="light" />}
      <S.Content>
        {!detail && (
          <SegmentedTabs
            items={INFO_TABS}
            value={tab}
            onChange={changeTab}
            ariaLabel="안내 메뉴"
          />
        )}
        <S.Section
          role={detail ? undefined : 'tabpanel'}
          $isDetail={Boolean(detail)}
        >
          {detail ?? (
            <>
              {tab === 'collab' && (
                <CollabList
                  collabs={COLLAB_MOCKS}
                  onSelect={(id) => navigate(`/info/collab/${id}`)}
                />
              )}
              {tab === 'notice' && (
                <NoticeList
                  notices={notices}
                  onSelect={(id) => navigate(`/info/notices/${id}`)}
                />
              )}
              {tab === 'lostfound' && (
                <LostFoundList
                  items={lostItems}
                  date={lostDate}
                  keyword={keyword}
                  onDateChange={setLostDate}
                  onKeywordChange={setKeyword}
                  onSelect={(id) => navigate(`/info/lost-items/${id}`)}
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
