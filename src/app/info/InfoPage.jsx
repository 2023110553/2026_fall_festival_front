import { useEffect, useState } from 'react'
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import TopHeader from '../../components/common/TopHeader'
import SegmentedTabs from '../../components/common/SegmentedTabs'
import Button from '../../components/common/Button'
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
import { useTranslation } from '../../i18n/useTranslation'
import * as S from './InfoPage.styles'

const INFO_TABS = [
  { value: 'collab', labelKey: 'info.collab' },
  { value: 'notice', labelKey: 'info.notice' },
  { value: 'lostfound', labelKey: 'info.lostFound' },
  { value: 'developer', labelKey: 'info.developer' },
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
  const { t } = useTranslation()
  const infoTabs = INFO_TABS.map((item) => ({ ...item, label: t(item.labelKey) }))
  const [lostDate, setLostDate] = useState('2026-09-23') // TEMP: 로컬 테스트용 (원래 9/29)
  const [keyword, setKeyword] = useState('')
  const [noticeList, setNoticeList] = useState({
    ...INITIAL_LIST_STATE,
    isLoading: true,
    page: 0,
    hasNext: false,
    isLoadingMore: false,
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
          page: 0,
          hasNext: Boolean(response.data.meta?.has_next),
          isLoadingMore: false,
        })
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        setNoticeList({
          items: [],
          isLoading: false,
          error: getErrorMessage(error, '공지사항을 불러오지 못했습니다.'),
          page: 0,
          hasNext: false,
          isLoadingMore: false,
        })
      })

    return () => controller.abort()
  }, [noticeId, tab])

  // 공지 "더보기" — 목록 응답의 meta.has_next를 그대로 따른다 (size=20, 다음 페이지를 이어붙임)
  const handleLoadMoreNotices = () => {
    if (noticeList.isLoadingMore || !noticeList.hasNext) return

    const nextPage = noticeList.page + 1
    setNoticeList((prev) => ({ ...prev, isLoadingMore: true }))

    getNoticeList({ page: nextPage, size: 20 })
      .then(({ data: response }) => {
        if (response?.success !== true || !Array.isArray(response.data?.items)) {
          throw new Error('Invalid notice list response')
        }
        setNoticeList((prev) => ({
          ...prev,
          items: [...prev.items, ...response.data.items],
          page: nextPage,
          hasNext: Boolean(response.data.meta?.has_next),
          isLoadingMore: false,
        }))
      })
      .catch(() => {
        // 더보기 실패는 이미 보이는 목록을 지우지 않고 로딩 상태만 되돌린다 — 버튼을 다시 누르면 재시도됨
        setNoticeList((prev) => ({ ...prev, isLoadingMore: false }))
      })
  }

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
      {!detail && <TopHeader title={t('info.title')} appearance="light" />}
      <S.Content>
        {!detail && (
          <SegmentedTabs
            items={infoTabs}
            value={tab}
            onChange={changeTab}
            ariaLabel={t('info.menu')}
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
                    <>
                      <NoticeList
                        notices={noticeList.items}
                        onSelect={(id) => navigate(`/info/notices/${id}`)}
                      />
                      {noticeList.hasNext && (
                        <S.LoadMoreArea>
                          <Button
                            variant="secondary"
                            fullWidth
                            onClick={handleLoadMoreNotices}
                            disabled={noticeList.isLoadingMore}
                          >
                            {noticeList.isLoadingMore ? t('notice.loadingMore') : t('notice.loadMore')}
                          </Button>
                        </S.LoadMoreArea>
                      )}
                    </>
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
