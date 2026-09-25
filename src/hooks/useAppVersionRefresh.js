import { useEffect } from 'react'
import { startAppVersionWatcher } from '../utils/appVersion'

const CURRENT_BUILD = {
  version: import.meta.env.VITE_APP_VERSION,
  builtAt: import.meta.env.VITE_APP_BUILD_TIME,
}

export default function useAppVersionRefresh() {
  useEffect(() => {
    if (import.meta.env.DEV) return undefined
    const watcher = startAppVersionWatcher({ currentBuild: CURRENT_BUILD })
    return () => watcher.stop()
  }, [])
}
