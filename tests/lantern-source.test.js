import assert from 'node:assert/strict'
import { test } from 'node:test'
import { lanternWriteSource, restoreLanternWriteSource } from '../src/analytics/lanternSource.js'

test('lantern source distinguishes the visible entry context', () => {
  assert.equal(lanternWriteSource({ pathname: '/' }), 'home')
  assert.equal(lanternWriteSource({ pathname: '/map' }), 'map')
  assert.equal(lanternWriteSource({ pathname: '/map', activeBooth: { boothId: 12 } }), 'booth_detail')
  assert.equal(lanternWriteSource({ pathname: '/', activeBooth: { boothId: 12 } }), 'home')
  assert.equal(lanternWriteSource({ pathname: '/map', activeBooth: { boothId: 12 }, ticketOpen: true }), 'ticket')
  assert.equal(lanternWriteSource({ pathname: '/performance/3' }), 'performance')
  assert.equal(lanternWriteSource({ pathname: '/info' }), 'info')
})

test('login return preserves the original source and rejects arbitrary query values', () => {
  for (const source of ['home', 'map', 'booth_detail', 'ticket']) {
    const params = new URLSearchParams({ openLantern: '1', lanternSource: source })
    assert.equal(restoreLanternWriteSource(params.get('lanternSource'), 'map'), source)
  }
  assert.equal(restoreLanternWriteSource(null, 'home'), 'home')
  assert.equal(restoreLanternWriteSource('arbitrary input', 'map'), 'map')
})

// Exercise actual React effects: attribution survives closing, but not consumption/navigation.
test('coupon attribution survives close and is consumed only by a real write opening', async () => {
  const React = await import('react')
  const { JSDOM } = await import('jsdom')
  const { useLanternWriteSource } = await import('../src/analytics/lanternSource.js')
  const dom = new JSDOM('<div id="root"></div>')
  globalThis.window = dom.window
  globalThis.document = dom.window.document
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  const { createRoot } = await import('react-dom/client')
  const root = createRoot(document.getElementById('root'))
  let getSource
  let props = { pathname: '/', locationKey: 'home-1', activeBooth: null, ticketOpen: false, writeOpen: false }
  function Probe() {
    getSource = useLanternWriteSource(props)
    return null
  }
  const render = async (next = {}) => {
    props = { ...props, ...next }
    await React.act(async () => root.render(React.createElement(React.StrictMode, null, React.createElement(Probe))))
  }
  try {
    await render()
    assert.equal(getSource(), 'home', 'no coupon shown, including failed loads')
    await render({ ticketOpen: true })
    await render({ ticketOpen: false })
    assert.equal(getSource(), 'ticket', 'closing a coupon retains the source')
    await render()
    assert.equal(getSource(), 'ticket', 'rerenders or blocked write attempts do not consume it')
    await render({ writeOpen: true })
    await render({ writeOpen: false })
    assert.equal(getSource(), 'home', 'next write after cancellation uses the current page')

    await render({ ticketOpen: true })
    await render({ ticketOpen: false })
    await render({ pathname: '/map', locationKey: 'map-1' })
    assert.equal(getSource(), 'map', 'navigation resets coupon attribution')
    await render({ pathname: '/', locationKey: 'home-1' })
    assert.equal(getSource(), 'home', 'back navigation does not resurrect the coupon source')

    await render({ pathname: '/map', locationKey: 'map-2', activeBooth: { boothId: 12 } })
    await render({ ticketOpen: true })
    await render({ ticketOpen: false })
    assert.equal(getSource(), 'ticket', 'coupon takes priority over the underlying booth')
    await render({ activeBooth: { boothId: 13 } })
    assert.equal(getSource(), 'booth_detail', 'viewing a different booth resets the coupon source')
    await render({ ticketOpen: true })
    await render({ ticketOpen: false })
    assert.equal(getSource(), 'ticket', 'a new coupon visit can attribute again')
  } finally {
    await React.act(async () => root.unmount())
    dom.window.close()
    delete globalThis.window
    delete globalThis.document
    delete globalThis.IS_REACT_ACT_ENVIRONMENT
  }
})
