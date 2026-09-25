import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  fetchDeployedBuild,
  isNewerBuild,
  startAppVersionWatcher,
} from '../src/utils/appVersion.js'

const currentBuild = { version: 'build-a', builtAt: '2026-09-26T00:00:00.000Z' }
const newerBuild = { version: 'build-b', builtAt: '2026-09-26T00:05:00.000Z' }

test('version.json is fetched without using the browser cache', async () => {
  let request
  const result = await fetchDeployedBuild(async (url, options) => {
    request = { url, options }
    return { ok: true, json: async () => newerBuild }
  })

  assert.deepEqual(result, newerBuild)
  assert.equal(request.url, '/version.json')
  assert.equal(request.options.cache, 'no-store')
})

test('only a different and newer deployment requires a reload', () => {
  assert.equal(isNewerBuild(currentBuild, newerBuild), true)
  assert.equal(isNewerBuild(currentBuild, currentBuild), false)
  assert.equal(isNewerBuild(newerBuild, currentBuild), false)
  assert.equal(isNewerBuild(currentBuild, { version: 'broken' }), false)
})

test('a newer deployment reloads once per tab and removes every listener on stop', async () => {
  const windowObject = new EventTarget()
  const documentObject = new EventTarget()
  documentObject.visibilityState = 'visible'
  const values = new Map()
  const sessionStorageObject = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
  let reloads = 0
  let intervalCallback
  let intervalCleared = false
  let checks = 0

  const watcher = startAppVersionWatcher({
    currentBuild,
    getDeployedBuild: async () => { checks += 1; return newerBuild },
    reload: () => { reloads += 1 },
    windowObject,
    documentObject,
    sessionStorageObject,
    setIntervalImpl: (callback) => { intervalCallback = callback; return 41 },
    clearIntervalImpl: (id) => { assert.equal(id, 41); intervalCleared = true },
  })

  await watcher.check()
  assert.equal(reloads, 1)
  await watcher.check()
  assert.equal(reloads, 1)

  windowObject.dispatchEvent(new Event('focus'))
  documentObject.dispatchEvent(new Event('visibilitychange'))
  intervalCallback()
  await new Promise((resolve) => setTimeout(resolve, 0))
  assert.ok(checks >= 2)

  watcher.stop()
  const checksBeforeStopEvents = checks
  windowObject.dispatchEvent(new Event('focus'))
  documentObject.dispatchEvent(new Event('visibilitychange'))
  assert.equal(checks, checksBeforeStopEvents)
  assert.equal(intervalCleared, true)
})
