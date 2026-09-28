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

test('URL 뒤에 붙은 한국어 조사는 링크에서 제외한다', () => {
  assert.deepEqual(parseTextWithUrls('자세한 내용은 https://dgufesta.com을 참고하세요'), [
    { type: 'text', value: '자세한 내용은 ' },
    { type: 'url', value: 'https://dgufesta.com' },
    { type: 'text', value: '을' },
    { type: 'text', value: ' 참고하세요' },
  ])

  assert.deepEqual(parseTextWithUrls('신청은 https://forms.gle/abc123에서 해주세요'), [
    { type: 'text', value: '신청은 ' },
    { type: 'url', value: 'https://forms.gle/abc123' },
    { type: 'text', value: '에서' },
    { type: 'text', value: ' 해주세요' },
  ])

  assert.deepEqual(parseTextWithUrls('https://dgufesta.com/map으로 들어오세요'), [
    { type: 'url', value: 'https://dgufesta.com/map' },
    { type: 'text', value: '으로' },
    { type: 'text', value: ' 들어오세요' },
  ])
})

test('URL 내부의 짝이 맞는 닫는 괄호는 링크에 유지한다', () => {
  assert.deepEqual(
    parseTextWithUrls('위치: https://ko.wikipedia.org/wiki/동국대학교_(서울)'),
    [
      { type: 'text', value: '위치: ' },
      { type: 'url', value: 'https://ko.wikipedia.org/wiki/동국대학교_(서울)' },
    ],
  )
})

test('null 본문은 빈 내용으로 처리한다', () => {
  assert.deepEqual(parseTextWithUrls(null), [])
})

test('URL을 감싼 따옴표와 꺾쇠 및 유니코드 문장부호를 링크에서 제외한다', () => {
  assert.deepEqual(parseTextWithUrls('<https://dgufesta.com>'), [
    { type: 'text', value: '<' },
    { type: 'url', value: 'https://dgufesta.com' },
    { type: 'text', value: '>' },
  ])

  assert.deepEqual(parseTextWithUrls('“https://dgufesta.com”…'), [
    { type: 'text', value: '“' },
    { type: 'url', value: 'https://dgufesta.com' },
    { type: 'text', value: '”…' },
  ])
})
