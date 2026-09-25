import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'

export default function useHomeData(request) {
  const [state, setState] = useState({ data: null, isLoading: true, isError: false })
  const sessionId = useAuthStore((auth) => auth.sessionId)

  useEffect(() => {
    let controller

    const load = async () => {
      controller?.abort()
      const current = new AbortController()
      controller = current
      setState((previous) => ({ ...previous, isLoading: previous.data === null, isError: false }))
      try {
        const data = await request({ signal: current.signal })
        if (!current.signal.aborted) setState({ data, isLoading: false, isError: false })
      } catch (error) {
        if (current.signal.aborted) return
        // Axios 오류 객체 전체에는 인증 헤더가 포함될 수 있어 기록하지 않는다.
        console.error(`[HomePage] ${request.name} failed`, {
          status: error.response?.status,
          code: error.code,
          message: error.message,
        })
        setState({ data: null, isLoading: false, isError: true })
      }
    }

    const onPageShow = (event) => { if (event.persisted) void load() }
    void load()
    // 첫 실패가 영구적으로 남지 않도록 로그인 변경·탭 복귀·네트워크 복구 시 다시 조회한다.
    window.addEventListener('focus', load)
    window.addEventListener('online', load)
    window.addEventListener('pageshow', onPageShow)
    return () => {
      controller?.abort()
      window.removeEventListener('focus', load)
      window.removeEventListener('online', load)
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [request, sessionId])

  return state
}
