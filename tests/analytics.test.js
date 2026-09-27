import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'
import * as policy from '../src/analytics/policy.js'

// Execute the actual module with an inert DOM and injected build flags; no Google requests.
function loadModule(path, dependencies, exports) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8')
    .replace(/^import .* from .*\r?\n/gm, '')
    .replace(/import\.meta\.env/g, 'env')
    .replace(/export (const|function|async function)/g, '$1')
  return vm.runInNewContext(`${source}\n;({ ${exports.join(',')} })`, { ...dependencies, URL, URLSearchParams, Intl, console })
}
function harness(url = 'https://dgufesta.com/', env = { DEV: false, MODE: 'production' }) {
  const dom = new JSDOM('<html lang="ko"><head></head><body></body></html>', { url })
  const auth = { isAdminAuthed: false, adminToken: null }
  let listener
  const dependencies = { ...policy, env, window: dom.window, document: dom.window.document,
    useAdminAuthStore: { getState: () => auth, subscribe: (fn) => { listener = fn } } }
  const analytics = loadModule('../src/analytics/analytics.js', dependencies, ['trackEvent', 'installAnalyticsGuard', 'languageApplied'])
  analytics.installAnalyticsGuard()
  return { ...analytics, dom, auth, notify: () => listener(),
    load: () => dom.window.document.querySelector('script')?.onload(),
    events: () => (dom.window.dataLayer ?? []).filter((a) => a[0] === 'event').map((a) => ({ name: a[1], params: a[2] })) }
}

test('production user queues once and sends only manual page_view; no raw search/auth/body', () => {
  const h = harness('https://dgufesta.com/map?q=secret&code=oauth&utm_source=poster&utm_campaign=fall')
  h.trackEvent('page_view', { message: 'private', nickname: 'private', verify_code: 'private' })
  assert.equal(h.events().length, 0)
  assert.equal(h.dom.window.document.querySelectorAll('script').length, 1)
  h.load()
  const config = h.dom.window.dataLayer.find((a) => a[0] === 'config')
  assert.equal(config[2].send_page_view, false)
  assert.equal(h.events().length, 1)
  assert.equal(h.events()[0].params.page_location, 'https://dgufesta.com/map?utm_source=poster&utm_campaign=fall')
  assert.doesNotMatch(JSON.stringify(h.events()), /secret|oauth|private/)
  h.trackEvent('booth_selected', { booth_id: 3, selection_source: 'map_pin' })
  assert.equal(h.events().length, 2)
  h.dom.window.close()
})

test('DEV, loopback, LAN, unknown hosts, admin host/build/routes never load Google', () => {
  for (const [url, env] of [
    ['https://dgufesta.com/', { DEV: true, MODE: 'development' }],
    ['http://localhost/'], ['http://127.0.0.1/'], ['http://[::1]/'], ['http://192.168.1.10/'],
    ['https://preview.example/'], ['https://admin.dgufesta.com/login'],
    ['https://dgufesta.com/admin/login'], ['https://dgufesta.com/login'], ['https://dgufesta.com/notices/1'],
    ['https://dgufesta.com/', { DEV: false, MODE: 'admin' }],
  ]) {
    const h = harness(url, env)
    h.trackEvent('page_view'); h.trackEvent('map_opened')
    assert.equal(h.dom.window.document.querySelector('script'), null, url)
    assert.equal(h.events().length, 0, url)
    assert.equal(h.dom.window[`ga-disable-${policy.MEASUREMENT_ID}`], true)
    h.dom.window.close()
  }
})

test('admin navigation disables before history changes, purges queued events, and stays disabled', () => {
  for (const loaded of [false, true]) {
    const h = harness()
    h.trackEvent('page_view')
    if (loaded) h.load()
    const before = h.events().length
    h.dom.window.history.pushState({}, '', '/admin/login')
    assert.equal(h.dom.window[`ga-disable-${policy.MEASUREMENT_ID}`], true)
    h.load()
    h.trackEvent('page_view')
    h.dom.window.history.replaceState({}, '', '/')
    h.trackEvent('page_view')
    assert.equal(h.events().length, before)
    h.dom.window.close()
  }
})

test('known administrator authentication blocks initial and already-loaded tracking', () => {
  for (const loaded of [false, true]) {
    const h = harness()
    if (loaded) { h.trackEvent('page_view'); h.load() }
    const before = h.events().length
    h.auth.adminToken = 'never_transmitted'
    h.auth.isAdminAuthed = true
    h.notify()
    h.trackEvent('ticket_issued')
    assert.equal(h.events().length, before)
    assert.equal(h.dom.window[`ga-disable-${policy.MEASUREMENT_ID}`], true)
    if (!loaded) assert.equal(h.dom.window.document.querySelector('script'), null)
    h.dom.window.close()
  }
})

test('language changes use applied language and duplicate/no-op updates do not count', () => {
  const h = harness(); h.languageApplied('ko')
  for (const language of ['en', 'en', 'zh', 'ja', 'ko']) {
    h.dom.window.document.documentElement.lang = language === 'zh' ? 'zh-CN' : language
    h.languageApplied(language)
  }
  h.load()
  assert.deepEqual(Array.from(h.events(), (e) => e.params.language), ['en', 'zh', 'ja', 'ko'])
  assert.deepEqual(Array.from(h.events(), (e) => e.params.from_language), ['ko', 'en', 'zh', 'ja'])
  h.dom.window.close()
})

test('festival day has explicit before/after values and uses the shared festival dates', () => {
  assert.deepEqual(['2026-09-28','2026-09-29','2026-09-30','2026-10-01','2026-10-02'].map(policy.festivalDay), ['before','1','2','3','after'])
})

test('landing UTM stays on the entry link but is not copied into internal navigation', () => {
  const entry = 'https://dgufesta.com/performance?utm_source=qr&utm_medium=offline&utm_campaign=fall'
  const h = harness(entry)
  assert.equal(h.dom.window.location.href, entry)
  h.trackEvent('page_view')
  // Navigate before the Google script finishes: the queued landing event keeps attribution.
  h.dom.window.history.replaceState({}, '', '/performance?date=2026-09-30')
  assert.equal(h.dom.window.location.href, 'https://dgufesta.com/performance?date=2026-09-30')
  h.dom.window.history.pushState({}, '', '/info?tab=notice')
  assert.equal(h.dom.window.location.href, 'https://dgufesta.com/info?tab=notice')
  h.trackEvent('page_view')
  h.load()
  assert.equal(h.events()[0].params.page_location, entry)
  assert.equal(h.events()[1].params.page_location, 'https://dgufesta.com/info')
  const config = h.dom.window.dataLayer.find((a) => a[0] === 'config')
  assert.doesNotMatch(config[2].page_location, /utm_/)
  h.dom.window.close()
})

test('remaining landing query and history revisits never repeat campaign values on subsequent events', () => {
  const entry = 'https://dgufesta.com/map?utm_source=qr&utm_medium=offline'
  const h = harness(entry)
  h.trackEvent('map_opened') // A child effect may precede the page view.
  h.trackEvent('page_view')
  h.trackEvent('booth_selected', { booth_id: 1 })
  h.load()
  h.dom.window.history.pushState({}, '', '/info')
  h.trackEvent('page_view')
  h.dom.window.history.replaceState({}, '', entry)
  h.trackEvent('page_view')
  assert.equal(h.dom.window.location.href, entry, 'analytics must not rewrite the inbound URL')
  assert.equal(h.events().filter((e) => e.params.page_location.includes('utm_')).length, 1)
  assert.equal(h.events()[1].params.page_location, entry)
  assert.doesNotMatch(h.dom.window.dataLayer.find((a) => a[0] === 'config')[2].page_location, /utm_/)
  h.dom.window.close()
})

test('lantern success only follows confirmed response; classified failure contains no user content', async () => {
  const events = []
  let result
  const apiClient = { post: async () => { if (result instanceof Error) throw result; return result } }
  const api = loadModule('../src/api/lantern.js', { apiClient, ...policy, trackEvent: (name, params) => events.push({ name, params }) }, ['createLantern'])
  const form = { boothId: 3, nickname: 'private_name', message: 'private_message' }
  result = Object.assign(new Error('private_server_error'), { response: { status: 400, data: { code: 'FORBIDDEN_WORD_DETECTED' } } })
  await assert.rejects(api.createLantern(form))
  assert.equal(events[0].name, 'lantern_submit_failed')
  assert.equal(events[0].params.error_type, 'forbidden_word_detected')
  result = { data: { success: false, data: { lantern_id: 1 } } }
  await assert.rejects(api.createLantern(form))
  assert.equal(events.filter((e) => e.name === 'lantern_submitted').length, 0)
  result = { data: { success: true, data: { lantern_id: 1, festival_date: '2026-09-30' } } }
  await api.createLantern(form)
  assert.equal(events.filter((e) => e.name === 'lantern_submitted').length, 1)
  assert.equal(events.at(-1).params.festival_day, '2')
  assert.doesNotMatch(JSON.stringify(events), /private_/)
})

test('ticket issue and redemption only follow confirmed API outcome, never scratch or failure', async () => {
  const events = []
  let result
  const apiClient = { post: async () => { if (result instanceof Error) throw result; return { data: result } } }
  const api = loadModule('../src/api/coupon.js', { apiClient, ...policy, trackEvent: (name, params) => events.push({ name, params }) }, ['issueCoupon','useCoupon','scratchCoupon'])
  result = new Error('failed')
  await assert.rejects(api.issueCoupon())
  await assert.rejects(api.useCoupon('sensitive_id', 'secret_code'))
  result = { success: false }
  await assert.rejects(api.issueCoupon())
  result = { data: { status: 'WIN' } }
  await assert.rejects(api.useCoupon('sensitive_id','secret_code'))
  assert.equal(events.length, 0)
  result = { coupon_id: 'sensitive_id', issued_date: '2026-09-29', status: 'UNSCRATCHED' }
  await api.issueCoupon(); await api.scratchCoupon('sensitive_id')
  assert.deepEqual(events.map((e) => e.name), ['ticket_issued'])
  result = { success: true, data: { status: 'USED', used_at: '2026-09-29T12:00:00+09:00' } }
  await api.useCoupon('sensitive_id','secret_code')
  assert.deepEqual(events.map((e) => e.name), ['ticket_issued','ticket_redeemed'])
  assert.doesNotMatch(JSON.stringify(events), /sensitive_id|secret_code/)
})

// React's real effect lifecycle, including StrictMode replay, without a GA library.
test('view episodes survive StrictMode/rerender and count real reopen and A-B-A navigation', async () => {
  const React = await import('react')
  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/' })
  globalThis.window = dom.window
  globalThis.document = dom.window.document
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  const { createRoot } = await import('react-dom/client')
  const events = []
  let language = 'ko'
  const { useAnalyticsView } = loadModule('../src/analytics/useAnalyticsView.js', {
    useEffect: React.useEffect, useRef: React.useRef, useTranslation: () => ({ language }),
    trackEvent: (name, params) => events.push({ name, params }),
  }, ['useAnalyticsView'])
  function Probe({ visible = true, viewKey = 'a', reset = true }) {
    useAnalyticsView('booth_detail_viewed', visible, viewKey, { booth_id: viewKey }, reset)
    return null
  }
  const root = createRoot(document.getElementById('root'))
  const render = async (props = {}) => React.act(async () => root.render(React.createElement(React.StrictMode, null, React.createElement(Probe, props))))
  try {
    await render(); await render()
    assert.equal(events.length, 1)
    language = 'ja'; await render()
    assert.equal(events.length, 1)
    await render({ visible: false }); await render()
    assert.equal(events.length, 2)
    assert.equal(events.at(-1).params.language, 'ja')
    await render({ viewKey: 'b' }); await render({ viewKey: 'a' })
    assert.equal(events.length, 4)
    await render({ visible: false, reset: false }); await render({ reset: false })
    assert.equal(events.length, 4, 'background detail refresh must not re-count the same opening')
  } finally {
    await React.act(async () => root.unmount())
    dom.window.close()
    delete globalThis.window; delete globalThis.document; delete globalThis.IS_REACT_ACT_ENVIRONMENT
  }
})

test('lantern write event sends source along with the existing page name', () => {
  const h = harness()
  for (const source of ['home', 'map', 'booth_detail', 'ticket']) {
    h.trackEvent('lantern_write_started', { page_name: 'lantern', source })
  }
  h.load()
  assert.deepEqual(Array.from(h.events(), (event) => event.params.source), ['home', 'map', 'booth_detail', 'ticket'])
  assert.ok(h.events().every((event) => event.params.page_name === 'lantern'))
  h.dom.window.close()
})
