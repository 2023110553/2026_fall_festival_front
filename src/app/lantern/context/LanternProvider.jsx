import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const LanternContext = createContext(null)

const STORAGE_KEY = 'my_lanterns'

// 등불 리스트를 앱 전역에서 공유하기 위한 컨텍스트.
// AppLayout에 항상 떠 있는 LanternFlowPage(작성/목록 모달)와 MyPage(마이페이지 버튼)가
// 같은 리스트를 보게 하려고 도입 — 각자 로컬 상태로 따로 들고 있으면 서로 다른 등불 목록이 보이는 문제가 생긴다.
export function LanternProvider({ children }) {
  // 마운트 시 1회만 localStorage에서 초기값을 읽어온다 (읽기용 별도 useEffect보다
  // lazy initializer가 더 단순하고, "쓰기 이펙트가 초기값을 덮어쓰는" 순서 문제도 없다)
  const [lanterns, setLanterns] = useState(() => {
    const savedLanterns = localStorage.getItem(STORAGE_KEY)
    return savedLanterns ? JSON.parse(savedLanterns) : []
  })

  // lanterns가 바뀔 때마다(추가/삭제/수정 전부 setLanterns를 거치므로) 자동으로 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lanterns))
  }, [lanterns])

  const addLantern = (lantern) => setLanterns((prev) => [...prev, lantern])

  const deleteLantern = (id) =>
    setLanterns((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isDeleted: true } : item))
    )

  const editLantern = (id, newContent) =>
    setLanterns((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, message: newContent, content: newContent } : item
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
