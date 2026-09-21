import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useAuthStore } from '../../../store/useAuthStore'
import { FESTIVAL_DATES } from '../../../constants/festivalDates'
import {
  createLantern as createLanternRequest,
  deleteLantern as deleteLanternRequest,
  getLanterns as getLanternsRequest,
  updateLantern as updateLanternRequest,
} from '../../../api/lantern'

const LanternContext = createContext(null)

const couponKey = (userId) => `festival-coupon:${userId}`

function readStored(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key))
    return value ?? fallback
  } catch {
    return fallback
  }
}

// 목록 조회 응답엔 festival_date가 없으므로, 축제 3일치를 날짜별로 따로 조회해서
// 조회에 쓴 날짜를 그대로 festivalDate로 태깅한다 (MyLanternList의 DAY 1/2/3 탭 필터 기준).
const fetchAllFestivalDaysLanterns = async () => {
  const responses = await Promise.all(
    FESTIVAL_DATES.map((date) => getLanternsRequest({ mine: true, date }))
  )
  return responses.flatMap((res, index) =>
    (res.data.data.items ?? []).map((item) => ({
      id: item.lantern_id,
      boothId: item.booth_id,
      nickname: item.nickname,
      message: item.message,
      content: item.message,
      status: item.status ?? 'active',
      festivalDate: FESTIVAL_DATES[index],
      createdAt: item.created_at,
    }))
  )
}

// 등불 리스트를 앱 전역에서 공유하기 위한 컨텍스트.
// AppLayout에 항상 떠 있는 LanternFlowPage(작성/목록 모달)와 MyPage(마이페이지 버튼)가
// 같은 리스트를 보게 하려고 도입 — 각자 로컬 상태로 따로 들고 있으면 서로 다른 등불 목록이 보이는 문제가 생긴다.
export function LanternProvider({ children }) {
  const userId = useAuthStore((state) => state.user?.id)
  const sessionId = useAuthStore((state) => state.sessionId)
  return (
    <AccountLanternProvider key={`${userId ?? 'guest'}:${sessionId ?? ''}`} userId={userId}>
      {children}
    </AccountLanternProvider>
  )
}

function AccountLanternProvider({ children, userId }) {
  // 부스 상세에서 현재 보고 있는 부스 — map 도메인이 상세 진입/이탈 시 세팅해준다.
  // { boothId, festivalDate } | null — 등불 달기 모달이 그 부스를 미리 선택해두고,
  // festivalDate가 오늘이 아니면 등불 달기 자체를 막는 데 쓰인다.
  const [activeBooth, setActiveBooth] = useState(null)
  const [lanterns, setLanterns] = useState([])
  const [coupon, setCoupon] = useState(() => readStored(couponKey(userId), null))

  // 로그인 상태일 때만 본인 등불을 서버에서 조회 — 로그아웃/게스트면 목록을 비운다
  useEffect(() => {
    if (userId == null) {
      setLanterns([])
      return
    }

    let cancelled = false
    fetchAllFestivalDaysLanterns()
      .then((items) => {
        if (!cancelled) setLanterns(items)
      })
      .catch(() => {
        // 조회 실패 시엔 빈 목록 유지 — 등록 시점에 서버가 다시 검증해준다
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  useEffect(() => {
    if (userId != null) localStorage.setItem(couponKey(userId), JSON.stringify(coupon))
  }, [coupon, userId])

  // 실패 시(금칙어/부스 없음/일일 한도 등) 그대로 reject해서 호출부가 에러 코드로 분기하게 둔다
  const addLantern = async ({ boothId, nickname, message }) => {
    const res = await createLanternRequest({ boothId, nickname, message })
    const data = res.data.data
    const created = {
      id: data.lantern_id,
      boothId: data.booth_id,
      nickname: data.nickname,
      message: data.message,
      content: data.message,
      status: 'active',
      festivalDate: data.festival_date,
      createdAt: data.created_at,
    }
    setLanterns((prev) => [...prev, created])
    return created
  }

  // soft delete라 목록에서 지우지 않고 status만 바꾼다 (마이페이지 회색 처리용)
  const deleteLantern = async (id) => {
    try {
      await deleteLanternRequest(id)
      setLanterns((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'deleted_by_user' } : item))
      )
    } catch {
      // 실패(이미 삭제됨 등) 시엔 다음 새로고침에서 서버 기준으로 다시 맞춰진다
    }
  }

  const editLantern = async (id, { nickname, message }) => {
    try {
      const res = await updateLanternRequest(id, { nickname, message })
      const data = res.data.data
      setLanterns((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, nickname: data.nickname, message: data.message, content: data.message, updatedAt: data.updated_at }
            : item
        )
      )
    } catch {
      // 실패 시 기존 값 유지
    }
  }

  // BottomNav(+버튼)/TopHeader(나의 등불) 등은 LanternFlowPage와 형제 컴포넌트라 그 로컬 상태를
  // 직접 못 건드린다. 대신 LanternFlowPage가 마운트 시 자신의 오픈 함수를 여기에 등록해두고,
  // 형제 컴포넌트는 registerTriggers로 등록된 함수를 통해서만 호출한다 (window 커스텀 이벤트 대체).
  const triggersRef = useRef({ openCreateModal: null, openLanternList: null, openCoupon: null })

  const registerTriggers = useCallback((triggers) => {
    triggersRef.current = triggers
  }, [])

  const requestCreateModal = useCallback(() => {
    triggersRef.current.openCreateModal?.()
  }, [])

  const requestLanternList = useCallback(() => {
    triggersRef.current.openLanternList?.()
  }, [])

  const requestCoupon = useCallback(() => {
    triggersRef.current.openCoupon?.()
  }, [])

  return (
    <LanternContext.Provider
      value={{
        activeBooth,
        setActiveBooth,
        lanterns,
        coupon,
        setCoupon,
        addLantern,
        deleteLantern,
        editLantern,
        registerTriggers,
        requestCreateModal,
        requestLanternList,
        requestCoupon,
      }}
    >
      {children}
    </LanternContext.Provider>
  )
}

export function useLanterns() {
  const context = useContext(LanternContext)
  if (!context) {
    throw new Error('useLanterns는 LanternProvider 안에서만 사용할 수 있습니다.')
  }
  return context
}
