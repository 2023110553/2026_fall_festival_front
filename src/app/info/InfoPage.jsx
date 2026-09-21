import { useEffect, useState } from 'react'
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
import { DEV_TEAM_MOCKS } from './devTeam.mock'
import {
  getLostItemDetail,
  getLostItemList,
  getNoticeDetail,
  getNoticeList,
} from '../../api/info'
import * as S from './InfoPage.styles'

const INFO_TABS = [
  { value: 'collab', label: '협업' },
  { value: 'notice', label: '공지' },
  { value: 'lostfound', label: '분실물' },
  { value: 'developer', label: '개발진' },
]

const INITIAL_LIST_STATE = {
  items: [],
  isLoading: false,
  error: '',
}

const INITIAL_DETAIL_STATE = {
  data: null,
  isLoading: false,
  error: '',
  notFound: false,
}

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback

const normalizeLostItemDetail = (item) => ({
  ...item,
  image_urls: (item?.images ?? item?.image_urls ?? [])
    .map((image) => (typeof image === 'string' ? image : image?.image_url))
    .filter(Boolean),
  tags: (item?.tags ?? [])
    .map((tag) => (typeof tag === 'string' ? tag : tag?.keyword))
    .filter(Boolean),
})

export default function InfoPage() {
  const [lostDate, setLostDate] = useState('2026-09-29')
  const [keyword, setKeyword] = useState('')
  const [noticeList, setNoticeList] = useState({
    ...INITIAL_LIST_STATE,
    isLoading: true,
  })
  const [lostItemList, setLostItemList] = useState({
    ...INITIAL_LIST_STATE,
    isLoading: true,
  })
  const [noticeDetail, setNoticeDetail] = useState(INITIAL_DETAIL_STATE)
  const [lostItemDetail, setLostItemDetail] = useState(INITIAL_DETAIL_STATE)
  const navigate = useNavigate()
  const { collabSlug, noticeId, lostItemId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab')
  const tab = INFO_TABS.some((item) => item.value === requestedTab)
    ? requestedTab
    : 'collab'

  const selectedCollab = COLLAB_MOCKS.find((item) => item.id === collabSlug)

  useEffect(() => {
    if (tab !== 'notice' || noticeId) return undefined

    const controller = new AbortController()
    setNoticeList((prev) => ({ ...prev, isLoading: true, error: '' }))

    getNoticeList({ page: 0, size: 20 }, { signal: controller.signal })
      .then(({ data: response }) => {
        if (response?.success !== true || !Array.isArray(response.data?.items)) {
          throw new Error('Invalid notice list response')
        }
        setNoticeList({
          items: response.data.items,
          isLoading: false,
          error: '',
        })
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        setNoticeList({
          items: [],
          isLoading: false,
          error: getErrorMessage(error, '공지사항을 불러오지 못했습니다.'),
        })
      })

    return () => controller.abort()
  }, [noticeId, tab])

  useEffect(() => {
    if (tab !== 'lostfound' || lostItemId) return undefined

    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => {
      setLostItemList((prev) => ({ ...prev, isLoading: true, error: '' }))

      getLostItemList(
        {
          foundDate: lostDate,
          keyword,
          page: 0,
          size: 100,
        },
        { signal: controller.signal },
      )
        .then(({ data: response }) => {
          if (response?.success !== true || !Array.isArray(response.data?.items)) {
            throw new Error('Invalid lost item list response')
          }
          setLostItemList({
            items: response.data.items,
            isLoading: false,
            error: '',
          })
        })
        .catch((error) => {
          if (controller.signal.aborted) return
          setLostItemList({
            items: [],
            isLoading: false,
            error: getErrorMessage(error, '분실물 목록을 불러오지 못했습니다.'),
          })
        })
    }, 300)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [keyword, lostDate, lostItemId, tab])

  useEffect(() => {
    if (!noticeId) return undefined

    const controller = new AbortController()
    setNoticeDetail({ ...INITIAL_DETAIL_STATE, isLoading: true })

    getNoticeDetail(noticeId, { signal: controller.signal })
      .then(({ data: response }) => {
        if (response?.success !== true || !response.data) {
          throw new Error('Invalid notice detail response')
        }
        setNoticeDetail({
          data: response.data,
          isLoading: false,
          error: '',
          notFound: false,
        })
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        setNoticeDetail({
          data: null,
          isLoading: false,
          error: getErrorMessage(error, '공지사항을 불러오지 못했습니다.'),
          notFound: error?.response?.status === 404,
        })
      })

    return () => controller.abort()
  }, [noticeId])

  useEffect(() => {
    if (!lostItemId) return undefined

    const controller = new AbortController()
    setLostItemDetail({ ...INITIAL_DETAIL_STATE, isLoading: true })

    getLostItemDetail(lostItemId, { signal: controller.signal })
      .then(({ data: response }) => {
        if (response?.success !== true || !response.data) {
          throw new Error('Invalid lost item detail response')
        }
        setLostItemDetail({
          data: normalizeLostItemDetail(response.data),
          isLoading: false,
          error: '',
          notFound: false,
        })
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        setLostItemDetail({
          data: null,
          isLoading: false,
          error: getErrorMessage(error, '분실물 정보를 불러오지 못했습니다.'),
          notFound: error?.response?.status === 404,
        })
      })

    return () => controller.abort()
  }, [lostItemId])

  const changeTab = (nextTab) => {
    setSearchParams(nextTab === 'collab' ? {} : { tab: nextTab })
  }

  if (collabSlug && !selectedCollab) {
    return <Navigate to="/info" replace />
  }

  if (noticeId && noticeDetail.notFound) {
    return <Navigate to="/info?tab=notice" replace />
  }

  if (lostItemId && lostItemDetail.notFound) {
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
    if (noticeId) {
      if (noticeDetail.isLoading || (!noticeDetail.data && !noticeDetail.error)) {
        return <S.StatusMessage>공지사항을 불러오는 중...</S.StatusMessage>
      }
      if (noticeDetail.error) {
        return <S.StatusMessage role="alert">{noticeDetail.error}</S.StatusMessage>
      }
      return (
        <NoticeDetail
          notice={noticeDetail.data}
          onBack={() => navigate('/info?tab=notice')}
        />
      )
    }
    if (lostItemId) {
      if (lostItemDetail.isLoading || (!lostItemDetail.data && !lostItemDetail.error)) {
        return <S.StatusMessage>분실물 정보를 불러오는 중...</S.StatusMessage>
      }
      if (lostItemDetail.error) {
        return <S.StatusMessage role="alert">{lostItemDetail.error}</S.StatusMessage>
      }
      return (
        <LostFoundDetail
          item={lostItemDetail.data}
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
                <>
                  {noticeList.isLoading && (
                    <S.StatusMessage>공지사항을 불러오는 중...</S.StatusMessage>
                  )}
                  {!noticeList.isLoading && noticeList.error && (
                    <S.StatusMessage role="alert">{noticeList.error}</S.StatusMessage>
                  )}
                  {!noticeList.isLoading && !noticeList.error && (
                    <NoticeList
                      notices={noticeList.items}
                      onSelect={(id) => navigate(`/info/notices/${id}`)}
                    />
                  )}
                </>
              )}
              {tab === 'lostfound' && (
                <LostFoundList
                  items={lostItemList.items}
                  date={lostDate}
                  keyword={keyword}
                  isLoading={lostItemList.isLoading}
                  error={lostItemList.error}
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
