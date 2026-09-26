import { BOOTH_STRUCTURE, BOOTH_STRUCTURE_SPECS } from '../../../../constants/boothSizes'

// 푸드트럭 — 2026-09-26 추가, 같은 날 디테일 보강.
//
// 왜 천막이 아닌가: 푸드트럭은 부스지만(카드·상세·등불 전부 있음) 3×6 캐노피나 3×3 파고다로는
// 아무리 해도 트럭처럼 안 보인다. BoothMarker가 placements의 structure === "TRUCK"이면 이걸 그린다.
//
// 1차 버전이 "박스 두 개 + 바퀴"라 재원 반려. 실제 포터/봉고 푸드트럭에서 눈에 띄는 요소를 채웠다 —
// 캡오버 운전석(앞유리가 거의 수직, 헤드라이트가 낮게), 휠하우스, 지붕 배기 후드, 사이드미러,
// 차체 허리 스트라이프, 메뉴판, 접이 스텝. 지도 줌에서는 실루엣(캡 + 박스 + 어닝 + 바퀴)이,
// 가까이서는 이 디테일들이 트럭으로 읽히게 하는 역할이다.
//
// 치수는 재원이 공유한 실측 도면 기준(포터/봉고 개조):
//   서빙 창 2,600 × 965 · 어닝 2,420 × 580 · 개구부 높이 1,500 · 측면 문 980
// 전장 5.0 × 전폭 2.0 × 적재함 윗면 3.05, 열린 어닝 바깥 끝까지 3.3. 규격표는 BOOTH_STRUCTURE_SPECS에 있다.
//
// 방향 약속 — rotation 0일 때 **차체 길이가 x축(운전석이 +x), 서빙 창이 +z를 본다.**
// 천막의 "rotation 0이면 긴 변이 x축"과 같은 규칙이라 좌표 찍을 때 헷갈릴 일이 없다.
// 손님이 서는 쪽(+z)에 통로가 오도록 rotation을 주면 된다.
//
// 색: 재원 결정으로 차체는 흰색 고정, 어닝·허리 스트라이프·간판 테두리만 accentColor를 받는다.
// 사진의 민트·하늘색 트럭처럼 대마다 다르게 하려면 이 prop만 바꾸면 된다.
//
// 지오메트리는 박스가 대부분이라 모듈 레벨 공유를 하지 않았다 — 트럭이 6대뿐이라 공유해서 얻는 게
// 코드 복잡도보다 작다. 대수가 크게 늘면 PagodaTent처럼 모듈 레벨로 빼면 된다.

const SPEC = BOOTH_STRUCTURE_SPECS[BOOTH_STRUCTURE.TRUCK]

const LENGTH = SPEC.width // 5.0 — x축
const WIDTH = SPEC.depth // 2.0 — z축
const HALF_W = WIDTH / 2

const WHEEL_R = 0.34
const CHASSIS_Y = 0.5
const BOX_BOTTOM = 0.85
const BOX_TOP = 3.05 // 적재함 윗면(= 어닝 힌지). 실측 개구부 1,500이 들어가야 해서 이 높이가 나온다
const CAB_LENGTH = 1.45
const CAB_TOP = 2.2
const BOX_FRONT_X = LENGTH / 2 - CAB_LENGTH // 적재함과 운전석 경계
const BOX_REAR_X = -LENGTH / 2
const BOX_LEN = BOX_FRONT_X - BOX_REAR_X
const BOX_MID_X = (BOX_FRONT_X + BOX_REAR_X) / 2

// 서빙 개구부(실측 2,600 × 1,500)
const OPEN_W = 2.6
const OPEN_BOTTOM = 1.3
const OPEN_TOP = OPEN_BOTTOM + 1.5
const OPEN_H = OPEN_TOP - OPEN_BOTTOM
const OPEN_X = -0.35

// 어닝(위로 열리는 문, 실측 2,420 × 580 비율)
const AWNING_W = 2.42
const AWNING_REACH = 1.45
const AWNING_TILT = 0.32

const FRONT_AXLE_X = BOX_FRONT_X + 0.5
const REAR_AXLE_X = BOX_REAR_X + 1.2

const BODY = '#F4F6F9'
const BODY_SHADE = '#D5DBE4'
const TRIM = '#AEB6C2'
const GLASS = '#5B6E88'
const TIRE = '#1B1E24'
const RIM = '#C3C9D2'
const DARK = '#3D3227'

export default function FoodTruck({ accentColor = '#E8734A', lightScale = 1 }) {
  const glow = 1.5 * lightScale

  return (
    <group>
      {/* ── 섀시 ─────────────────────────────────────────────────────── */}
      {[1, -1].map((s) => (
        <mesh key={`rail${s}`} position={[0.1, CHASSIS_Y - 0.06, s * 0.42]}>
          <boxGeometry args={[LENGTH - 0.5, 0.12, 0.12]} />
          <meshStandardMaterial color="#5A616B" metalness={0.5} roughness={0.6} />
        </mesh>
      ))}

      {/* ── 적재함(주방) ─────────────────────────────────────────────── */}
      <mesh position={[BOX_MID_X, (BOX_BOTTOM + BOX_TOP) / 2, 0]} castShadow>
        <boxGeometry args={[BOX_LEN, BOX_TOP - BOX_BOTTOM, WIDTH]} />
        <meshStandardMaterial color={BODY} metalness={0.2} roughness={0.5} />
      </mesh>
      {/* 아래 스커트 — 박스가 공중에 뜬 것처럼 보이지 않게 */}
      <mesh position={[BOX_MID_X, (CHASSIS_Y + BOX_BOTTOM) / 2, 0]}>
        <boxGeometry args={[BOX_LEN - 0.12, BOX_BOTTOM - CHASSIS_Y, WIDTH - 0.14]} />
        <meshStandardMaterial color={BODY_SHADE} metalness={0.2} roughness={0.7} />
      </mesh>
      {/* 허리 스트라이프 — 차체를 위아래로 나눠주는 띠. 대마다 색을 바꾸는 자리 */}
      {[1, -1].map((s) => (
        <mesh key={`stripe${s}`} position={[BOX_MID_X, BOX_BOTTOM + 0.18, s * (HALF_W + 0.005)]}>
          <boxGeometry args={[BOX_LEN - 0.04, 0.14, 0.02]} />
          <meshStandardMaterial color={accentColor} roughness={0.55} />
        </mesh>
      ))}
      {/* 모서리 기둥 — 판금 티를 내는 세로 라인 */}
      {[BOX_REAR_X + 0.03, BOX_FRONT_X - 0.03].map((x) =>
        [1, -1].map((s) => (
          <mesh key={`corner${x}${s}`} position={[x, (BOX_BOTTOM + BOX_TOP) / 2, s * (HALF_W - 0.02)]}>
            <boxGeometry args={[0.07, BOX_TOP - BOX_BOTTOM, 0.09]} />
            <meshStandardMaterial color={TRIM} metalness={0.4} roughness={0.5} />
          </mesh>
        ))
      )}
      {/* 지붕 배기 후드 — 주방 트럭에서 가장 알아보기 쉬운 지붕 요소 */}
      <mesh position={[BOX_MID_X - 0.35, BOX_TOP + 0.17, -0.25]} castShadow>
        <boxGeometry args={[1.1, 0.34, 0.8]} />
        <meshStandardMaterial color={TRIM} metalness={0.55} roughness={0.4} />
      </mesh>
      <mesh position={[BOX_MID_X + 0.55, BOX_TOP + 0.12, -0.3]}>
        <cylinderGeometry args={[0.13, 0.13, 0.24, 10]} />
        <meshStandardMaterial color={TRIM} metalness={0.6} roughness={0.35} />
      </mesh>

      {/* 뒷문 — 적재함 뒤쪽 양여닫이 */}
      {[1, -1].map((s) => (
        <mesh key={`reardoor${s}`} position={[BOX_REAR_X - 0.02, (BOX_BOTTOM + BOX_TOP) / 2, s * (WIDTH / 4)]}>
          <boxGeometry args={[0.03, BOX_TOP - BOX_BOTTOM - 0.24, WIDTH / 2 - 0.12]} />
          <meshStandardMaterial color={BODY_SHADE} metalness={0.25} roughness={0.55} />
        </mesh>
      ))}

      {/* ── 서빙 개구부 ──────────────────────────────────────────────── */}
      {/* 안쪽(주방). 박스가 솔리드라 면보다 앞에 둬야 보인다 */}
      <mesh position={[OPEN_X, (OPEN_BOTTOM + OPEN_TOP) / 2, HALF_W + 0.006]}>
        <boxGeometry args={[OPEN_W, OPEN_H, 0.02]} />
        <meshStandardMaterial color={DARK} roughness={0.9} />
      </mesh>
      {/* 조리대 쪽 불빛 — 개구부 전체를 발광시키면 라이트박스처럼 보여서 위쪽만 */}
      <mesh position={[OPEN_X, OPEN_TOP - OPEN_H * 0.3, HALF_W + 0.045]}>
        <planeGeometry args={[OPEN_W - 0.3, OPEN_H * 0.42]} />
        <meshStandardMaterial color="#FFE2AE" emissive="#FFCE86" emissiveIntensity={glow} toneMapped={false} />
      </mesh>
      {/* 주방 집기 실루엣 — 안이 텅 비면 검은 구멍으로 보인다 */}
      {[
        [-0.95, 0.42, 0.3, 0.38],
        [-0.45, 0.3, 0.26, 0.3],
        [0.5, 0.5, 0.34, 0.34],
      ].map(([dx, h, w, d]) => (
        <mesh key={`gear${dx}`} position={[OPEN_X + dx, OPEN_BOTTOM + h / 2 + 0.06, HALF_W - 0.18]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#8E8578" metalness={0.5} roughness={0.45} />
        </mesh>
      ))}
      {/* 문틀 — 통판으로 두면 안쪽 불빛을 덮어버려서 네 변만 두른다 */}
      {[
        [0, OPEN_H / 2 + 0.05, OPEN_W + 0.16, 0.1],
        [0, -OPEN_H / 2 - 0.05, OPEN_W + 0.16, 0.1],
        [OPEN_W / 2 + 0.05, 0, 0.1, OPEN_H + 0.2],
        [-OPEN_W / 2 - 0.05, 0, 0.1, OPEN_H + 0.2],
      ].map(([dx, dy, w, h]) => (
        <mesh key={`frame${dx}${dy}`} position={[OPEN_X + dx, (OPEN_BOTTOM + OPEN_TOP) / 2 + dy, HALF_W + 0.025]}>
          <boxGeometry args={[w, h, 0.05]} />
          <meshStandardMaterial color={BODY_SHADE} metalness={0.3} roughness={0.5} />
        </mesh>
      ))}
      {/* 서빙 카운터 + 받침대 */}
      <mesh position={[OPEN_X, OPEN_BOTTOM, HALF_W + 0.13]}>
        <boxGeometry args={[OPEN_W + 0.16, 0.08, 0.5]} />
        <meshStandardMaterial color={TRIM} metalness={0.45} roughness={0.35} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={`cbr${s}`} position={[OPEN_X + s * (OPEN_W / 2 - 0.12), OPEN_BOTTOM - 0.16, HALF_W + 0.2]} rotation={[0.5, 0, 0]}>
          <boxGeometry args={[0.05, 0.36, 0.05]} />
          <meshStandardMaterial color={TRIM} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* ── 어닝 + 간판 ──────────────────────────────────────────────── */}
      <group position={[OPEN_X, BOX_TOP, HALF_W]} rotation={[-AWNING_TILT, 0, 0]}>
        <mesh position={[0, 0, AWNING_REACH / 2]} castShadow>
          <boxGeometry args={[AWNING_W, 0.09, AWNING_REACH]} />
          <meshStandardMaterial color={accentColor} metalness={0.1} roughness={0.6} />
        </mesh>
        {/* 안쪽 면 — 통짜 색이면 그늘이 새까맣게 보인다 */}
        <mesh position={[0, -0.05, AWNING_REACH / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[AWNING_W - 0.06, AWNING_REACH - 0.06]} />
          <meshStandardMaterial color="#FFF3E0" roughness={0.8} side={2} />
        </mesh>
        {/* 지지대 — 공중에 뜬 판으로 보이지 않게 양 끝을 받친다 */}
        {[-1, 1].map((s) => (
          <mesh key={`stay${s}`} position={[s * (AWNING_W / 2 - 0.06), -0.17, AWNING_REACH * 0.5]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.05, 0.05, AWNING_REACH * 0.95]} />
            <meshStandardMaterial color={TRIM} metalness={0.5} roughness={0.4} />
          </mesh>
        ))}
        {/* 어닝 밑 전구 줄 */}
        {[-0.85, -0.28, 0.28, 0.85].map((x) => (
          <mesh key={`bulb${x}`} position={[x, -0.11, AWNING_REACH * 0.55]}>
            <sphereGeometry args={[0.055, 8, 6]} />
            <meshStandardMaterial color="#FFE6B8" emissive="#FFD08A" emissiveIntensity={glow * 1.6} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* 간판 띠 — 개구부 위와 지붕 사이 */}
      <mesh position={[OPEN_X, (OPEN_TOP + BOX_TOP) / 2, HALF_W + 0.03]}>
        <boxGeometry args={[OPEN_W + 0.14, BOX_TOP - OPEN_TOP - 0.03, 0.06]} />
        <meshStandardMaterial color="#FFFDF7" roughness={0.7} />
      </mesh>
      <mesh position={[OPEN_X, OPEN_TOP + 0.03, HALF_W + 0.035]}>
        <boxGeometry args={[OPEN_W + 0.16, 0.06, 0.07]} />
        <meshStandardMaterial color={accentColor} roughness={0.6} />
      </mesh>
      {/* 메뉴판 — 개구부 옆 벽에 붙은 작은 판 */}
      <mesh position={[BOX_REAR_X + 0.45, OPEN_BOTTOM + 0.85, HALF_W + 0.02]}>
        <boxGeometry args={[0.56, 0.92, 0.04]} />
        <meshStandardMaterial color="#39414F" roughness={0.8} />
      </mesh>

      {/* ── 운전석(캡오버) ───────────────────────────────────────────── */}
      <mesh position={[BOX_FRONT_X + CAB_LENGTH / 2, (CHASSIS_Y + CAB_TOP) / 2 + 0.05, 0]} castShadow>
        <boxGeometry args={[CAB_LENGTH, CAB_TOP - CHASSIS_Y - 0.1, WIDTH - 0.18]} />
        <meshStandardMaterial color={BODY} metalness={0.25} roughness={0.45} />
      </mesh>
      {/* 앞유리 — 캡오버라 거의 수직, 살짝만 눕는다 */}
      <mesh position={[LENGTH / 2 - 0.06, CAB_TOP - 0.42, 0]} rotation={[0, Math.PI / 2, -0.12]}>
        <planeGeometry args={[WIDTH - 0.34, 0.82]} />
        <meshStandardMaterial color={GLASS} metalness={0.55} roughness={0.2} side={2} />
      </mesh>
      {/* 옆 유리 + 문 이음선 + 손잡이 */}
      {[1, -1].map((s) => (
        <group key={`cab${s}`}>
          <mesh position={[BOX_FRONT_X + CAB_LENGTH / 2 + 0.12, CAB_TOP - 0.46, s * (HALF_W - 0.085)]}>
            <planeGeometry args={[CAB_LENGTH - 0.46, 0.64]} />
            <meshStandardMaterial color={GLASS} metalness={0.55} roughness={0.2} side={2} />
          </mesh>
          <mesh position={[BOX_FRONT_X + 0.1, (CHASSIS_Y + CAB_TOP) / 2, s * (HALF_W - 0.08)]}>
            <boxGeometry args={[0.03, CAB_TOP - CHASSIS_Y - 0.3, 0.02]} />
            <meshStandardMaterial color={TRIM} metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[BOX_FRONT_X + 0.42, 1.28, s * (HALF_W - 0.06)]}>
            <boxGeometry args={[0.2, 0.05, 0.05]} />
            <meshStandardMaterial color={TRIM} metalness={0.6} roughness={0.35} />
          </mesh>
          {/* 사이드미러 */}
          <mesh position={[LENGTH / 2 - 0.2, CAB_TOP - 0.34, s * (HALF_W + 0.13)]}>
            <boxGeometry args={[0.05, 0.28, 0.12]} />
            <meshStandardMaterial color="#4B525C" roughness={0.6} />
          </mesh>
          <mesh position={[LENGTH / 2 - 0.3, CAB_TOP - 0.3, s * (HALF_W + 0.07)]}>
            <boxGeometry args={[0.16, 0.03, 0.03]} />
            <meshStandardMaterial color="#4B525C" roughness={0.6} />
          </mesh>
          {/* 헤드라이트 */}
          <mesh position={[LENGTH / 2 - 0.01, 1.02, s * 0.56]}>
            <boxGeometry args={[0.06, 0.15, 0.26]} />
            <meshStandardMaterial color="#F3F6FA" emissive="#DCE6F2" emissiveIntensity={0.35} roughness={0.25} />
          </mesh>
        </group>
      ))}
      {/* 그릴 + 범퍼 + 번호판 */}
      <mesh position={[LENGTH / 2 - 0.02, 1.02, 0]}>
        <boxGeometry args={[0.05, 0.22, 0.66]} />
        <meshStandardMaterial color={TRIM} metalness={0.5} roughness={0.45} />
      </mesh>
      <mesh position={[LENGTH / 2 - 0.02, 0.72, 0]}>
        <boxGeometry args={[0.12, 0.3, WIDTH - 0.3]} />
        <meshStandardMaterial color={BODY_SHADE} metalness={0.35} roughness={0.55} />
      </mesh>
      <mesh position={[LENGTH / 2 + 0.05, 0.72, 0]}>
        <boxGeometry args={[0.02, 0.16, 0.36]} />
        <meshStandardMaterial color="#E7EAEF" roughness={0.7} />
      </mesh>

      {/* 접이 스텝 — 조리실 출입문 아래 */}
      <mesh position={[BOX_FRONT_X - 0.5, CHASSIS_Y - 0.12, -(HALF_W + 0.1)]}>
        <boxGeometry args={[0.5, 0.06, 0.26]} />
        <meshStandardMaterial color={TRIM} metalness={0.5} roughness={0.5} />
      </mesh>

      {/* ── 바퀴 + 휠하우스 ──────────────────────────────────────────── */}
      {[FRONT_AXLE_X, REAR_AXLE_X].map((x) =>
        [1, -1].map((s) => (
          <group key={`w${x}${s}`}>
            <group position={[x, WHEEL_R, s * (HALF_W - 0.06)]} rotation={[0, 0, Math.PI / 2]}>
              <mesh>
                <cylinderGeometry args={[WHEEL_R, WHEEL_R, 0.22, 16]} />
                <meshStandardMaterial color={TIRE} roughness={0.95} />
              </mesh>
              <mesh position={[0, s * 0.06, 0]}>
                <cylinderGeometry args={[WHEEL_R * 0.52, WHEEL_R * 0.52, 0.12, 12]} />
                <meshStandardMaterial color={RIM} metalness={0.65} roughness={0.3} />
              </mesh>
              <mesh position={[0, s * 0.065, 0]}>
                <cylinderGeometry args={[WHEEL_R * 0.16, WHEEL_R * 0.16, 0.14, 8]} />
                <meshStandardMaterial color="#8C939D" metalness={0.6} roughness={0.4} />
              </mesh>
            </group>
            {/* 휠하우스 — 바퀴 위 반원 아치. 차체가 바퀴에 그냥 얹힌 느낌을 없앤다.
                반원 실린더로 하면 옆에서 볼 때 원판처럼 보여서 토러스(테두리)로 두른다.
                토러스 기본 방향이 이미 XY평면(세로)이라 회전을 주면 안 된다 — 주면 바닥에 눕는다 */}
            <mesh position={[x, WHEEL_R, s * (HALF_W + 0.015)]}>
              <torusGeometry args={[WHEEL_R + 0.09, 0.05, 6, 16, Math.PI]} />
              <meshStandardMaterial color={BODY_SHADE} metalness={0.35} roughness={0.55} />
            </mesh>
          </group>
        ))
      )}
    </group>
  )
}
