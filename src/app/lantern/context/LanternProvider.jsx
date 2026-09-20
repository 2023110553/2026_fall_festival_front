import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useAuthStore } from '../../../store/useAuthStore'

const LanternContext = createContext(null)

const storageKey = (userId) => `festival-lanterns:${userId}`
const couponKey = (userId) => `festival-coupon:${userId}`

function readStored(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key))
    return value ?? fallback
  } catch {
    return fallback
  }
}

// 등불 리스트를 앱 전역에서 공유하기 위한 컨텍스트.
// AppLayout에 항상 떠 있는 LanternFlowPage(작성/목록 모달)와 MyPage(마이페이지 버튼)가
// 같은 리스트를 보게 하려고 도입 — 각자 로컬 상태로 따로 들고 있으면 서로 다른 등불 목록이 보이는 문제가 생긴다.
export function LanternProvider({ children }) {
  const userId = useAuthStore((state) => state.user?.id)
  const sessionId = useAuthStore((state) => state.sessionId)
  return <AccountLanternProvider key={`${userId ?? 'guest'}:${sessionId ?? ''}`} userId={userId}>{children}</AccountLanternProvider>
}

function AccountLanternProvider({ children, userId }) {
  // 마운트 시 1회만 localStorage에서 초기값을 읽어온다 (읽기용 별도 useEffect보다
  // lazy initializer가 더 단순하고, "쓰기 이펙트가 초기값을 덮어쓰는" 순서 문제도 없다)
  const [lanterns, setLanterns] = useState(() => {
    const saved = readStored(storageKey(userId), [])
    return Array.isArray(saved) ? saved : []
  })
  const [coupon, setCoupon] = useState(() => readStored(couponKey(userId), null))

  // lanterns가 바뀔 때마다(추가/삭제/수정 전부 setLanterns를 거치므로) 자동으로 저장
  useEffect(() => {
    if (userId != null) localStorage.setItem(storageKey(userId), JSON.stringify(lanterns))
  }, [lanterns, userId])

  useEffect(() => {
    if (userId != null) localStorage.setItem(couponKey(userId), JSON.stringify(coupon))
  }, [coupon, userId])

  const addLantern = (lantern) => setLanterns((prev) => [...prev, lantern])

  const deleteLantern = (id) =>
    setLanterns((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isDeleted: true } : item))
    )

  const editLantern = (id, newContent) =>
    setLanterns((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, message: newContent, content: newContent, updatedAt: new Date().toISOString() }
          : item
      )
    )

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
