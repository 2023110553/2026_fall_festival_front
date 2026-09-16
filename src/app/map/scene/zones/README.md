# 구역별 3D 씬 자산

여기에는 구역별 `.glb` 로더/좌표 매핑 코드만 둔다 (블렌더 원본 `.blend` 파일은 이 레포에 두지 않음 — "목업" 폴더가 source of truth).

확정된 3개 구역 (`campus-map/final-plan-team-share.md` v3) + 추가 구역:

- `zone1` — 경영관·혜화관 거리 → `public/models/zone1.glb` (`Zone1Scene.jsx`, 부스 목데이터 `zone1-booths.sample.json`)
- `zone2` — 팔정도 → `public/models/zone2.glb` (`Zone2Scene.jsx`)
- `zone3` — 만해광장 + 후문쪽 거리 → TODO
- `zone4` — 학림관 (2026-09-16 추가, 별개 독립 구역) → `public/models/hangnimgwan.glb` (`Zone4Scene.jsx`)

최종 export된 `.glb` 파일 자체는 `public/models/`에 두고, 이 폴더에는 구역별 로딩 컴포넌트(예: `Zone1Scene.jsx`)와 부스 앵커 좌표 JSON 연동 코드를 둔다.

## glb 최적화 파이프라인 (2026-09-16, 이슈 #33)

블렌더에서 export한 raw glb를 그대로 쓰지 않고 [gltf-transform](https://gltf-transform.dev/)으로 한 번 줄여서 올린다.
드로우콜과 용량을 같이 줄이는 게 목적이고, 로더 쪽 코드는 바꿀 필요가 없다.

```bash
# 1) 블렌더 export (GLB, 모디파이어 적용, +Y up, 카메라/라이트 제외, 텍스처 1K로 축소)
#    -> C:\workspace\campus-map\blender\export_glb_small.py 를 블렌더 파이썬 콘솔에서 exec

# 2) 최적화: meshopt 압축 + 정점 양자화 + WebP 텍스처(최대 1024px) + 재질별 메시 병합 + GPU 인스턴싱
npx @gltf-transform/cli optimize <raw.glb> <out.glb> \
  --compress meshopt --texture-compress webp --texture-size 1024 \
  --simplify false --palette false --join true --flatten true --instance true

# 3) 노멀/러프니스 맵은 512px로 한 단계 더 축소 (지도 카메라 거리에서 차이 없음)
npx @gltf-transform/cli resize <out.glb> <out.glb> --width 512 --height 512 --pattern "*{_rough_,_nor_gl_}*"
npx @gltf-transform/cli webp   <out.glb> <out.glb> --quality 78 --slots "{normalTexture,metallicRoughnessTexture}"
```

- `--simplify false`: 창턱·연석처럼 얇은 박스가 많아서 지오메트리 단순화는 끈다.
- `--palette false`: 재질 이름을 유지하려고 팔레트 병합은 끈다(시간대 조명/재질 튠 때 이름으로 찾을 수 있게).
- `--join`: 같은 재질의 메시를 병합한다 → **glb 안의 오브젝트 이름이 사라진다.** 부스 좌표는 JSON 기반이라 영향이 없지만,
  나중에 "건물 클릭" 같은 이름 기반 기능이 필요해지면 그때 `--join false`로 다시 export하면 된다.
- 결과(2026-09-16): zone1 12.4 MB → 2.98 MB(메시 1,533 → 91), zone2 10.2 MB → 3.25 MB(224 → 37), 학림관 7.8 MB → 1.75 MB(39 → 28).
- 로더 요구사항: `EXT_meshopt_compression`(drei `useGLTF` 기본 MeshoptDecoder), `EXT_texture_webp`(three r118+), `KHR_mesh_quantization`.
  셋 다 현재 스택(three 0.180 / drei 10.7)에서 추가 설정 없이 동작함을 헤드리스 크롬 렌더로 확인.
