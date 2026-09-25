export const VERSION_CHECK_INTERVAL_MS = 5 * 60 * 1000

const RELOAD_TARGET_KEY = 'fall-festival-reload-target'

function isValidBuild(build) {
  return typeof build?.version === 'string' && build.version.trim() &&
    typeof build?.builtAt === 'string' && Number.isFinite(Date.parse(build.builtAt))
}

export function isNewerBuild(currentBuild, deployedBuild) {
  if (!isValidBuild(currentBuild) || !isValidBuild(deployedBuild)) return false
  if (currentBuild.version === deployedBuild.version) return false
  return Date.parse(deployedBuild.builtAt) > Date.parse(currentBuild.builtAt)
}

export async function fetchDeployedBuild(fetchImpl = globalThis.fetch) {
  const response = await fetchImpl('/version.json', {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) return null
  const build = await response.json()
  return isValidBuild(build) ? build : null
}

export function startAppVersionWatcher({
  currentBuild,
  getDeployedBuild = fetchDeployedBuild,
  reload = () => globalThis.location.reload(),
  windowObject = globalThis.window,
  documentObject = globalThis.document,
  sessionStorageObject = globalThis.sessionStorage,
  setIntervalImpl = globalThis.setInterval,
  clearIntervalImpl = globalThis.clearInterval,
  intervalMs = VERSION_CHECK_INTERVAL_MS,
} = {}) {
  let stopped = false
  let checking = false

  const check = async () => {
    if (stopped || checking || documentObject?.visibilityState === 'hidden') return false
    checking = true
    try {
      const deployedBuild = await getDeployedBuild()
      if (stopped || !isNewerBuild(currentBuild, deployedBuild)) return false

      // 같은 탭에서 같은 버전으로 반복 새로고침하는 상황을 막는다.
      if (sessionStorageObject?.getItem(RELOAD_TARGET_KEY) === deployedBuild.version) return false
      sessionStorageObject?.setItem(RELOAD_TARGET_KEY, deployedBuild.version)
      reload()
      return true
    } catch {
      // 버전 확인 실패는 현재 화면 사용을 막지 않고 다음 이벤트/주기에 다시 확인한다.
      return false
    } finally {
      checking = false
    }
  }

  const onFocus = () => { void check() }
  const onVisibilityChange = () => {
    if (documentObject.visibilityState === 'visible') void check()
  }
  const onPageShow = (event) => {
    if (event.persisted) void check()
  }

  windowObject.addEventListener('focus', onFocus)
  windowObject.addEventListener('pageshow', onPageShow)
  documentObject.addEventListener('visibilitychange', onVisibilityChange)
  const intervalId = setIntervalImpl(() => { void check() }, intervalMs)
  void check()

  return {
    check,
    stop() {
      stopped = true
      windowObject.removeEventListener('focus', onFocus)
      windowObject.removeEventListener('pageshow', onPageShow)
      documentObject.removeEventListener('visibilitychange', onVisibilityChange)
      clearIntervalImpl(intervalId)
    },
  }
}
