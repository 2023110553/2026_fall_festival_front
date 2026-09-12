# 구역별 3D 씬 자산

여기에는 구역별 `.glb` 로더/좌표 매핑 코드만 둔다 (블렌더 원본 `.blend` 파일은 이 레포에 두지 않음 — "목업" 폴더가 source of truth).

확정된 3개 구역 (`campus-map/final-plan-team-share.md` v3):

- `zone1` — 경영관·혜화관 거리
- `zone2` — 팔정도
- `zone3` — 만해광장 + 후문쪽 거리

최종 export된 `.glb` 파일 자체는 `public/models/`에 두고, 이 폴더에는 구역별 로딩 컴포넌트(예: `Zone1Scene.jsx`)와 부스 앵커 좌표 JSON 연동 코드를 둔다.
