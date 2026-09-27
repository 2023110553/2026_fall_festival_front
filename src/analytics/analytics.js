import { useAdminAuthStore } from '../store/useAdminAuthStore'
import { MEASUREMENT_ID, isExcluded, normalizeLanguage, festivalDay, pageName, safeLocation } from './policy'

let started = false
let ready = false
let blocked = false
let pending = []
let language
let pageViewSent = false
const allowedParams = new Set('language festival_day page_name source from_language to_language booth_id booth_type selection_source result_count filter_type filter_value performance_id notice_id notice_type banner_id destination_type rank link_type error_type share_method ticket_type page_location page_title page_referrer'.split(' '))
function command() { window.dataLayer.push(arguments) }

export function syncAnalyticsPolicy(target = window.location) {
  const auth = useAdminAuthStore.getState()
  const excluded = isExcluded(target, { dev: import.meta.env.DEV, adminApp: import.meta.env.MODE === 'admin', adminAuthed: Boolean(auth.isAdminAuthed || auth.adminToken) })
  // Once entering admin, stay disabled until a full reload (including queued hits).
  if (excluded) { blocked = true; pending = [] }
  window[`ga-disable-${MEASUREMENT_ID}`] = blocked || excluded
  return !blocked && !excluded
}

export function installAnalyticsGuard() {
  syncAnalyticsPolicy()
  for (const method of ['pushState', 'replaceState']) {
    const original = window.history[method]
    window.history[method] = function (state, unused, url) {
      if (url != null) {
        syncAnalyticsPolicy(new URL(url, window.location.href))
      }
      return original.call(this, state, unused, url)
    }
  }
  window.addEventListener('popstate', () => syncAnalyticsPolicy())
  useAdminAuthStore.subscribe(() => syncAnalyticsPolicy())
}

function safeReferrer() {
  try { const url = new URL(document.referrer); return url.origin + url.pathname } catch { return '' }
}

function start() {
  if (started) return
  started = true
  window.dataLayer = window.dataLayer || []
  window.gtag = command
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  script.onload = () => {
    if (!syncAnalyticsPolicy()) return
    command('js', new Date())
    command('config', MEASUREMENT_ID, { send_page_view: false, allow_google_signals: false,
      page_location: safeLocation(window.location.href), page_referrer: safeReferrer(), page_title: pageName(window.location.pathname) })
    ready = true
    pending.splice(0).forEach(([name, params]) => command('event', name, params))
  }
  script.onerror = () => { pending = []; started = false; script.remove() }
  document.head.appendChild(script)
}

export function trackEvent(name, params = {}) {
  // Analytics failures must never turn a successful API mutation into an app error.
  try { return sendEvent(name, params) } catch { return undefined }
}

function sendEvent(name, params) {
  const isLandingPageView = name === 'page_view' && !pageViewSent
  const payload = { language: normalizeLanguage(document.documentElement.lang), festival_day: festivalDay(),
    page_name: pageName(window.location.pathname), ...Object.fromEntries(Object.entries(params).filter(([key, value]) => allowedParams.has(key) && ['string', 'number'].includes(typeof value))),
    page_location: safeLocation(window.location.href, isLandingPageView), page_title: pageName(window.location.pathname), page_referrer: safeReferrer() }
  if (!/^[a-z][a-z_]*$/.test(name)) return
  if (!syncAnalyticsPolicy()) {
    // Explicit, local-only opt-in; no network and no production console output.
    if (import.meta.env.DEV && window.__GA4_DEBUG__ === true) console.debug('[GA4 local]', name, payload)
    return
  }
  if (name === 'page_view') pageViewSent = true
  start()
  if (ready) command('event', name, payload)
  else if (pending.length < 100) pending.push([name, payload])
}

export function languageApplied(next) {
  const previous = language
  language = next
  if (previous && previous !== next) trackEvent('language_changed', { from_language: previous, to_language: next, language: next })
}
