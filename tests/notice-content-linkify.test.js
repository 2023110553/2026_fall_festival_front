import test from 'node:test'
import assert from 'node:assert/strict'

import { parseTextWithUrls } from '../src/app/info/utils/parseTextWithUrls.js'

test('공지 본문에서 http와 https URL을 분리한다', () => {
  assert.deepEqual(
    parseTextWithUrls('안내 https://example.com\n문의 http://example.org/help'),
    [
      { type: 'text', value: '안내 ' },
      { type: 'url', value: 'https://example.com' },
      { type: 'text', value: '\n문의 ' },
      { type: 'url', value: 'http://example.org/help' },
    ],
  )
})

test('URL이 없는 공지 본문은 기존 텍스트를 그대로 유지한다', () => {
  const content = '첫 번째 줄\n두 번째 줄'

  assert.deepEqual(parseTextWithUrls(content), [{ type: 'text', value: content }])
})

test('URL 뒤의 문장부호는 링크에서 제외하고 일반 텍스트로 유지한다', () => {
  assert.deepEqual(parseTextWithUrls('신청: https://example.com/path?q=notice.'), [
    { type: 'text', value: '신청: ' },
    { type: 'url', value: 'https://example.com/path?q=notice' },
    { type: 'text', value: '.' },
  ])

  assert.deepEqual(parseTextWithUrls('(https://example.org/help), 확인해주세요.'), [
    { type: 'text', value: '(' },
    { type: 'url', value: 'https://example.org/help' },
    { type: 'text', value: '),' },
    { type: 'text', value: ' 확인해주세요.' },
  ])
})
