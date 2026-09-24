// 부스 소속 표(constants/boothAffiliations.js)와 실제 DB를 대조한다.
//
// 왜 필요한가 —
// 등불 마커의 색은 부스 소속(단과대·동아리)으로 정해지는데, 백엔드 Booth에는 소속 필드가 없어서
// 프론트가 booth_id → 소속 표를 들고 있다(사정은 boothAffiliations.js 머리말 참고).
// id로 묶는 방식이라 DB의 부스 번호가 표와 어긋나면 색이 조용히 틀린다 —
// 화면이 깨지지 않고 "색이 좀 이상한데?" 정도로만 보여서 가장 늦게 발견되는 종류의 버그다.
// boothMarkerColors.js에 개발 모드 콘솔 경고가 있지만 그 부스가 화면에 렌더될 때만 뜨기 때문에,
// 네 구역을 전부 야간으로 열어보지 않으면 놓친다. 그래서 배포 전에 한 번 돌려서 전수 확인한다.
//
// 언제 돌리나: 부스를 새로 등록했을 때, fixture를 다시 loaddata 했을 때, 그리고 배포 직전.
//
// 실행:
//   node scripts/check-booth-affiliations.mjs                      # 운영(dgufesta.com)
//   node scripts/check-booth-affiliations.mjs http://localhost:8000 # 로컬 백엔드
//
// 종료 코드: 어긋난 게 하나라도 있으면 1 (나중에 CI에 붙일 수 있게).
import { FOOD_TRUCK_BOOTH_IDS, NIGHT_BOOTH_AFFILIATION } from '../src/constants/boothAffiliations.js'

const BASE = (process.argv[2] ?? 'https://dgufesta.com').replace(/\/$/, '')

// 부스 목록 API는 한 번에 한 날짜·한 시간대만 내려준다. 날짜마다 여는 부스가 달라서
// (9/29 15곳, 9/30 14곳, 10/1 9곳) 세 날짜를 모두 합쳐야 전체 야간 부스가 나온다.
const DATES = ['2026-09-29', '2026-09-30', '2026-10-01']

async function fetchBooths(date, timeSlot) {
  const url = `${BASE}/api/booths/?date=${date}&time_slot=${timeSlot}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url} → HTTP ${response.status}`)
  const body = await response.json()
  if (!body?.success || !Array.isArray(body.data?.booths)) throw new Error(`${url} → 예상과 다른 응답`)
  return body.data.booths
}

// 색 분류 대상 판정은 boothMarkerColors.getBoothMarkerGroup과 같은 기준을 쓴다 —
// 에코코는 단독 색이고 시설(place_type ≠ 'BOOTH')은 '그 외'라 둘 다 소속 표가 필요 없다.
const needsAffiliation = (booth) =>
  (booth.place_type ?? 'BOOTH') === 'BOOTH' && booth.category !== 'ECO'

const nightBooths = new Map()
const dayBooths = new Map()
for (const date of DATES) {
  for (const booth of await fetchBooths(date, 'NIGHT')) nightBooths.set(booth.booth_id, booth)
  for (const booth of await fetchBooths(date, 'DAY')) dayBooths.set(booth.booth_id, booth)
}

const targets = [...nightBooths.values()].filter(needsAffiliation).sort((a, b) => a.booth_id - b.booth_id)
const tableIds = Object.keys(NIGHT_BOOTH_AFFILIATION).map(Number)

// ① 표에 없어서 '그 외'(모래색)로 나올 야간 부스 — 새 부스를 등록하고 표를 안 고친 경우
const missing = targets.filter((booth) => !NIGHT_BOOTH_AFFILIATION[booth.booth_id])
// ② 표에만 있고 DB에는 없는 id — pk가 바뀌었거나 부스가 빠진 경우. 표가 엉뚱한 부스를 칠하고 있을 수 있다
const stale = tableIds.filter((id) => !nightBooths.has(id))
// ③ 푸드트럭 목록에 있는데 주간 목록에 없는 id
const staleFoodTrucks = FOOD_TRUCK_BOOTH_IDS.filter((id) => !dayBooths.has(id))

console.log(`서버: ${BASE}`)
console.log(`야간 부스 ${targets.length}곳 / 소속 표 ${tableIds.length}줄 / 푸드트럭 표 ${FOOD_TRUCK_BOOTH_IDS.length}줄\n`)

console.log('① 소속 표에 없어서 "그 외" 색으로 나오는 야간 부스')
console.log(missing.length
  ? missing.map((booth) => `   ${String(booth.booth_id).padStart(3)}  ${booth.name}  (${booth.zone})`).join('\n')
  : '   없음')

console.log('\n② 소속 표에만 있고 운영 DB에는 없는 id (pk가 바뀌었을 수 있음)')
console.log(stale.length ? `   ${stale.join(', ')}` : '   없음')

console.log('\n③ 푸드트럭 표에만 있고 주간 목록에는 없는 id')
console.log(staleFoodTrucks.length ? `   ${staleFoodTrucks.join(', ')}` : '   없음')

// 한글은 터미널에서 두 칸을 차지해서 padEnd로는 열이 안 맞는다. 표를 PR에 붙여넣을 때 읽기 편하도록 보정한다.
const displayWidth = (text) => [...text].reduce((sum, ch) => sum + (ch.codePointAt(0) > 0x1100 ? 2 : 1), 0)
const padName = (text, width) => text + ' '.repeat(Math.max(0, width - displayWidth(text)))
const nameWidth = Math.max(0, ...targets.map((booth) => displayWidth(booth.name)))

// id가 밀렸는지는 개수만으로 알 수 없다 — 이름과 소속이 말이 되는지 사람이 봐야 한다.
console.log('\n④ id ↔ 이름 ↔ 소속 대조 (눈으로 확인)')
for (const booth of targets) {
  const affiliation = NIGHT_BOOTH_AFFILIATION[booth.booth_id] ?? '(없음)'
  console.log(`   ${String(booth.booth_id).padStart(3)}  ${padName(booth.name, nameWidth)}  →  ${affiliation}`)
}

if (FOOD_TRUCK_BOOTH_IDS.length === 0) {
  console.log('\n※ 푸드트럭 목록(FOOD_TRUCK_BOOTH_IDS)이 비어 있습니다.')
  console.log('   푸드트럭이 등록되면 전부 "주간 부스" 색으로 나옵니다 — API에는 푸드트럭을 구분하는 필드가 없어')
  console.log('   이 스크립트로도 잡을 수 없으니 총학 명단으로 직접 채워야 합니다.')
}

const problems = missing.length + stale.length + staleFoodTrucks.length
console.log(problems ? `\n${problems}건 확인 필요` : '\n표와 DB가 일치합니다')
process.exitCode = problems ? 1 : 0
