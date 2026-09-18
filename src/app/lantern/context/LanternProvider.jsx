import { createContext, useContext, useEffect, useState } from 'react'

const LanternContext = createContext(null)

const STORAGE_KEY = 'my_lanterns'

// 등불 리스트를 앱 전역에서 공유하기 위한 컨텍스트.
// AppLayout에 항상 떠 있는 LanternFlowPage(작성/목록 모달)와 MyPage(마이페이지 버튼)가
// 같은 리스트를 보게 하려고 도입 — 각자 로컬 상태로 따로 들고 있으면 서로 다른 등불 목록이 보이는 문제가 생긴다.
export function LanternProvider({ children }) {
  const [lanterns, setLanterns] = useState([])

  useEffect(() => {
    const savedLanterns = localStorage.getItem(STORAGE_KEY)
    if (savedLanterns) {
      setLanterns(JSON.parse(savedLanterns))
    }
  }, [])

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

  return (
    <LanternContext.Provider value={{ lanterns, addLantern, deleteLantern, editLantern }}>
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
