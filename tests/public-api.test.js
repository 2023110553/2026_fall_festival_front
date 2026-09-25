import assert from 'node:assert/strict'
import { after, before, beforeEach, test } from 'node:test'
import { createServer } from 'vite'
import { AxiosError } from 'axios'

// 실제 API 모듈과 인터셉터를 실행하고, 브라우저 저장소/HTTP 전송 경계만 대체한다.
let savedAuth = null
let storageBlocked = false
let storageReads = 0
const storage = {
  getItem() {
    storageReads += 1
    if (storageBlocked) throw new Error('Storage access denied')
    return savedAuth
  },
  setItem(_key, value) { savedAuth = value },
  removeItem() { savedAuth = null },
}
globalThis.window = new EventTarget()
window.localStorage = storage

let server
let apiClient
let useAuthStore
let home
let performances
let info
let map
let refreshClient
let requests
let responseBody

before(async () => {
  server = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, hmr: false, watch: null },
  })
  ;({ apiClient } = await server.ssrLoadModule('/src/api/client.js'))
  ;({ useAuthStore } = await server.ssrLoadModule('/src/store/useAuthStore.js'))
  home = await server.ssrLoadModule('/src/api/home.js')
  performances = await server.ssrLoadModule('/src/api/performance.js')
  info = await server.ssrLoadModule('/src/api/info.js')
  map = await server.ssrLoadModule('/src/api/map.js')
  ;({ refreshClient } = await server.ssrLoadModule('/src/api/refresh.js'))
})

after(async () => {
  await server?.close()
  delete globalThis.window
})

beforeEach(() => {
  storageBlocked = false
  useAuthStore.getState().logout()
  savedAuth = null
  storageReads = 0
  requests = []
  responseBody = { success: true, data: {} }
  apiClient.defaults.adapter = async (config) => {
    requests.push(config)
    return { data: responseBody, status: 200, statusText: 'OK', headers: {}, config }
  }
  refreshClient.defaults.adapter = () => { throw new Error('Unexpected token refresh') }
})

for (const mode of ['anonymous', 'logged-in', 'malformed-storage', 'blocked-storage']) {
  for (const endpoint of ['ranking', 'now-playing']) {
    test(`${endpoint} reaches the API without credentials with ${mode}`, async () => {
      if (mode === 'logged-in') {
        useAuthStore.getState().login({
          accessToken: 'test-access-token', refreshToken: 'test-refresh-token', user: { id: 1 },
        })
      }
      if (mode === 'malformed-storage') savedAuth = '{invalid-json'
      if (mode === 'blocked-storage') storageBlocked = true
      storageReads = 0
      responseBody = endpoint === 'ranking'
        ? { success: true, data: { total_lantern_count: 17, ranking: [
          { rank: 1, booth_id: 807, name: 'API fixture booth', lantern_count: 17 },
        ] } }
        : { success: true, data: { server_time: '2026-09-29T18:00:00', performances: [] } }

      const result = endpoint === 'ranking'
        ? await home.getBoothRanking()
        : (await performances.getNowPerformances()).data.data

      assert.deepEqual(result, responseBody.data)
      assert.equal(requests.length, 1)
      assert.equal(requests[0].headers.get('Authorization'), undefined)
      assert.equal(storageReads, 0, 'Public requests must not depend on authentication storage')
    })
  }
}

test('all non-personalized read endpoints work when authentication storage is blocked', async () => {
  storageBlocked = true
  responseBody = { success: true, data: { notices: [] } }
  await Promise.all([
    home.getRollingNotices(),
    performances.getPerformances('2026-09-29'),
    performances.getPerformanceDetail(123),
    info.getNoticeList(),
    info.getNoticeDetail(123),
    info.getLostItemList(),
    info.getLostItemDetail(123),
  ])
  assert.equal(requests.length, 7)
  assert.equal(storageReads, 0)
  assert.ok(requests.every((config) => !config.headers.has('Authorization')))
})

test('an explicit anonymous request strips an inherited Authorization header', async () => {
  await apiClient.get('/api/booths/ranking/', {
    skipUserAuth: true,
    headers: { authorization: 'Bearer stale-inherited-token' },
  })
  assert.equal(requests[0].headers.get('Authorization'), undefined)
})

test('a public 401 preserves the original error without touching authentication or retrying', async () => {
  storageBlocked = true
  let rejected
  apiClient.defaults.adapter = async (config) => {
    requests.push(config)
    rejected = unauthorized(config)
    throw rejected
  }
  await assert.rejects(home.getBoothRanking(), (error) => error === rejected)
  assert.equal(requests.length, 1)
  assert.equal(storageReads, 0)
})

test('malformed successful ranking responses still fail validation', async () => {
  responseBody = { success: true, data: { ranking: 'not-an-array' } }
  await assert.rejects(home.getBoothRanking(), /부스 랭킹 응답 형식/)
})

test('cancelled public requests never reach the adapter', async () => {
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(home.getBoothRanking({ signal: controller.signal }), { code: 'ERR_CANCELED' })
  assert.equal(requests.length, 0)
})

function login() {
  useAuthStore.getState().login({
    accessToken: 'old-access', refreshToken: 'old-refresh', user: { id: 1 },
  })
}

function unauthorized(config) {
  return new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, null, {
    status: 401, data: {}, headers: {}, config,
  })
}

test('protected requests still attach JWT and refresh an expired token', async () => {
  login()
  let refreshes = 0
  apiClient.defaults.adapter = async (config) => {
    requests.push(config.headers.get('Authorization'))
    if (requests.length === 1) throw unauthorized(config)
    return { status: 200, data: { success: true }, headers: {}, config }
  }
  refreshClient.defaults.adapter = async (config) => {
    refreshes += 1
    return { status: 200, headers: {}, config, data: {
      success: true, data: { access_token: 'new-access', refresh_token: 'new-refresh' },
    } }
  }
  await apiClient.get('/api/coupons/')
  assert.equal(refreshes, 1)
  assert.deepEqual(requests, ['Bearer old-access', 'Bearer new-access'])
})

for (const optional of [false, true]) {
  test(`failed refresh ${optional ? 'allows optional booth reads' : 'does not bypass protected APIs'}`, async () => {
    login()
    apiClient.defaults.adapter = async (config) => {
      const authorization = config.headers.get('Authorization')
      requests.push(authorization)
      if (authorization) throw unauthorized(config)
      return { status: 200, data: { success: true }, headers: {}, config }
    }
    refreshClient.defaults.adapter = async (config) => { throw unauthorized(config) }
    if (optional) {
      await map.getBooths()
      assert.deepEqual(requests, ['Bearer old-access', undefined])
    } else {
      await assert.rejects(apiClient.get('/api/coupons/'), (error) => error.response?.status === 401)
      assert.deepEqual(requests, ['Bearer old-access'])
    }
  })
}
