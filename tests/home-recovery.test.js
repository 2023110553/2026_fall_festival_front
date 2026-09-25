import assert from 'node:assert/strict'
import { after, afterEach, before, beforeEach, test } from 'node:test'
import { act, createElement } from 'react'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'

let dom
let server
let createRoot
let root
let useHomeData
let useAuthStore
let request
let state
let requests
const freshData = { source: 'successful API response' }

before(async () => {
  dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/' })
  globalThis.window = dom.window
  globalThis.document = dom.window.document
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  ;({ createRoot } = await import('react-dom/client'))
  server = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, hmr: false, watch: null },
  })
  ;({ default: useHomeData } = await server.ssrLoadModule('/src/hooks/useHomeData.js'))
  ;({ useAuthStore } = await server.ssrLoadModule('/src/store/useAuthStore.js'))
})

beforeEach(() => {
  useAuthStore.getState().logout()
  requests = []
  request = async ({ signal }) => {
    requests.push(signal)
    if (requests.length === 1) throw new Error('First request failed')
    return freshData
  }
  root = createRoot(document.getElementById('root'))
})

afterEach(async () => {
  await act(async () => root.unmount())
})

after(async () => {
  await server?.close()
  dom?.window.close()
  delete globalThis.window
  delete globalThis.document
  delete globalThis.IS_REACT_ACT_ENVIRONMENT
})

function Probe() {
  state = useHomeData(request)
  return createElement('output', {}, JSON.stringify(state))
}

for (const eventName of ['focus', 'online', 'pageshow']) {
  test(`failed home data is fetched again on ${eventName}`, async (t) => {
    t.mock.method(console, 'error', () => {})
    await act(async () => root.render(createElement(Probe)))
    assert.equal(state.isError, true)
    assert.equal(requests.length, 1)

    const event = eventName === 'pageshow'
      ? new window.PageTransitionEvent('pageshow', { persisted: true })
      : new window.Event(eventName)
    await act(async () => window.dispatchEvent(event))

    assert.equal(requests.length, 2)
    assert.equal(requests[0].aborted, true)
    assert.deepEqual(state, { data: freshData, isLoading: false, isError: false })
  })
}

test('login replaces a failed home request with fresh API data', async (t) => {
  t.mock.method(console, 'error', () => {})
  await act(async () => root.render(createElement(Probe)))
  assert.equal(state.isError, true)

  await act(async () => useAuthStore.getState().login({
    accessToken: 'fixture-access', refreshToken: 'fixture-refresh', user: { id: 1 },
  }))

  assert.equal(requests.length, 2)
  assert.deepEqual(state, { data: freshData, isLoading: false, isError: false })
})

test('a late aborted response cannot overwrite a successful retry', async () => {
  let completeFirst
  request = ({ signal }) => {
    requests.push(signal)
    if (requests.length === 1) return new Promise((resolve) => { completeFirst = resolve })
    return Promise.resolve(freshData)
  }
  await act(async () => root.render(createElement(Probe)))
  await act(async () => window.dispatchEvent(new window.Event('focus')))
  assert.equal(requests[0].aborted, true)

  await act(async () => completeFirst({ source: 'old response' }))
  assert.deepEqual(state, { data: freshData, isLoading: false, isError: false })
})

test('leaving home aborts the request and removes recovery listeners', async () => {
  request = ({ signal }) => {
    requests.push(signal)
    return new Promise(() => {})
  }
  await act(async () => root.render(createElement(Probe)))
  await act(async () => root.render(null))
  assert.equal(requests[0].aborted, true)

  await act(async () => window.dispatchEvent(new window.Event('online')))
  assert.equal(requests.length, 1)
})
