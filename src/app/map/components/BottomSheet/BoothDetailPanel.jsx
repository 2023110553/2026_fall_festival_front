import { useMapContext } from '../../context/MapProvider'
import LanternViewTab from '../LanternViewTab/LanternViewTab'
import { useEffect } from 'react'
import { useLanterns } from '../../../lantern/context/LanternProvider'
import { useAuth } from '../../../../hooks/useAuth'
import mockDetails from '../../mocks/boothDetailResponses.json'
import mockBoothImage from '../../../performance/assets/performance-thumbnail.png'
import lanternOn from '../../../../assets/map/lantern/lanternOn.svg'
import lanternOff from '../../../../assets/map/lantern/lanternOff.svg'
import * as S from './BoothDetailPanel.styles'

// 실제 부스 설명은 장소 상세 페이지와 공통 콘텐츠를 재사용하도록 연결한다.
export default function BoothDetailPanel({ boothId, onBack }) {
  const { sheetTab, setSheetTab, selectedDate } = useMapContext()
  const { setActiveBooth } = useLanterns()
  const { isLoggedIn } = useAuth()
  // 3D 테스트 핀의 임시 ID를 상세 목데이터 ID로 연결한다.
  const pinIds = {
    'test-booth-1': 3,
    'test-booth-2': 5,
    'test-booth-3': 4,
    'test-booth-4': 7,
  }
  const id = pinIds[boothId] ?? Number(boothId)
  const response = mockDetails.find((item) => item.data.booth_id === id)
  const booth = response
    ? {
        ...response.data,
        has_my_lantern: isLoggedIn && response.data.has_my_lantern,
        image_url: response.data.image_url?.startsWith('/src/')
          ? mockBoothImage
          : response.data.image_url,
      }
    : null
  const simple =
    booth &&
    (booth.place_type === 'FACILITY' ||
      ['TOILET', 'ALCOHOL'].includes(booth.category))
  const money = (value) =>
    value ? `${value.toLocaleString('ko-KR')}원` : '무료'

  const activeBoothId = booth && !simple ? booth.booth_id : null
  const festivalDate = selectedDate ?? '2026-09-29'

  useEffect(() => {
    setActiveBooth(activeBoothId == null ? null : {
      boothId: activeBoothId,
      festivalDate,
    })

    // 목록으로 돌아가거나 지도 페이지를 떠날 때 이전 부스 선택을 남기지 않는다.
    return () => setActiveBooth(null)
  }, [activeBoothId, festivalDate, setActiveBooth])

  return (
    <S.Panel>
      <S.Toolbar>
        <S.Back
          type="button"
          onClick={onBack}
          aria-label="목록으로 돌아가기"
          title="목록으로 돌아가기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="14"
            viewBox="0 0 16 14"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M14.375 5.7512H3.00917L6.48792 1.57287C6.65058 1.37716 6.72884 1.12485 6.70548 0.87144C6.68211 0.618031 6.55904 0.384283 6.36333 0.221617C6.16763 0.0589506 5.91531 -0.0193087 5.66191 0.00405519C5.4085 0.0274191 5.17475 0.150493 5.01208 0.3462L0.220417 6.0962C0.187523 6.1415 0.158662 6.18961 0.134167 6.23995C0.134167 6.28787 0.134167 6.31662 0.0670835 6.36453C0.0236456 6.47441 0.000901908 6.59138 0 6.70953C0.000901908 6.82769 0.0236456 6.94465 0.0670835 7.05453C0.0670835 7.10245 0.0670832 7.1312 0.134167 7.17912C0.158662 7.22946 0.187523 7.27756 0.220417 7.32287L5.01208 13.0729C5.10219 13.181 5.21502 13.268 5.34256 13.3277C5.4701 13.3873 5.60921 13.4181 5.75 13.4179C5.97392 13.4183 6.19092 13.3403 6.36333 13.1975C6.46037 13.117 6.54059 13.0182 6.59938 12.9067C6.65818 12.7952 6.6944 12.6732 6.70597 12.5477C6.71755 12.4222 6.70424 12.2956 6.66682 12.1752C6.62941 12.0548 6.56861 11.943 6.48792 11.8462L3.00917 7.66787H14.375C14.6292 7.66787 14.8729 7.5669 15.0526 7.38718C15.2324 7.20745 15.3333 6.9637 15.3333 6.70953C15.3333 6.45537 15.2324 6.21161 15.0526 6.03189C14.8729 5.85217 14.6292 5.7512 14.375 5.7512Z"
              fill="#9F9C99"
            />
          </svg>
        </S.Back>
        {booth && !simple && (
          <S.Tabs aria-label="부스 상세 보기">
            <S.Tab
              type="button"
              $active={sheetTab === 'info'}
              aria-pressed={sheetTab === 'info'}
              onClick={() => setSheetTab('info')}
            >
              부스 설명
            </S.Tab>
            <S.Tab
              type="button"
              $active={sheetTab === 'lantern'}
              aria-pressed={sheetTab === 'lantern'}
              onClick={() => setSheetTab('lantern')}
            >
              등불 보기
            </S.Tab>
          </S.Tabs>
        )}
      </S.Toolbar>
      {!booth ? (
        <S.Message role="alert">장소를 찾을 수 없습니다.</S.Message>
      ) : (
        <>
          <S.Header>
            <S.Identity>
              <S.Title>{booth.name}</S.Title>
              {!simple && booth.subtitle && (
                <S.Subtitle>{booth.subtitle}</S.Subtitle>
              )}
            </S.Identity>
            {!simple && (
              <S.Lantern $on={booth.has_my_lantern}>
                <img
                  src={booth.has_my_lantern ? lanternOn : lanternOff}
                  alt={booth.has_my_lantern ? '내 등불 등록됨' : '등불'}
                />
                <span>{booth.lantern_count}</span>
              </S.Lantern>
            )}
          </S.Header>
          {!simple && sheetTab === 'lantern' ? (
            <LanternViewTab key={booth.booth_id} boothId={booth.booth_id} />
          ) : (
            <>
              {simple ? (
                <>
                  <S.Section>
                    <S.Label>위치</S.Label>
                    <S.Text>{booth.location_detail || booth.zone}</S.Text>
                  </S.Section>
                  {booth.place_type === 'FACILITY' && booth.directions && (
                    <S.Section>
                      <S.Label>가는 길</S.Label>
                      <S.Text>{booth.directions}</S.Text>
                    </S.Section>
                  )}
                </>
              ) : (
                <>
                  {booth.description && (
                    <S.Section>
                      <S.Label>소개</S.Label>
                      <S.Text>{booth.description}</S.Text>
                    </S.Section>
                  )}
                  <S.Section>
                    <S.LabelRow>
                      <S.Label>정보</S.Label>
                      {booth.has_reusable_container && (
                        
                        <S.Reusable>
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" fill="none">
                            <path d="M10.8753 0.892131C8.26171 2.42573 8.44891 5.57573 6.61771 6.99713C5.23951 8.06693 3.29491 7.52513 2.17051 7.06493C2.17051 7.06493 1.40851 8.02673 0.861909 9.30893C0.678909 9.73913 -0.124491 9.26513 0.0165087 8.90093C1.80331 4.28993 7.88251 1.98953 7.88251 1.98953C7.88251 1.98953 3.59311 1.80773 0.726309 5.55353C0.649509 4.69793 0.522308 2.38313 2.74231 0.963531C5.75191 -0.963069 11.4855 0.534531 10.8753 0.892131Z" fill="#0D9352"/>
                          </svg>
                          다회용기 이용부스</S.Reusable>
                      )}
                    </S.LabelRow>
                    <S.Text>운영 위치: {booth.location_detail || booth.zone}</S.Text>
                    <S.Operations aria-label="운영 일정">
                      {booth.operations.map((op) => (
                        <li key={`${op.festival_date}-${op.time_slot}`}>
                          운영 시간: {Number(op.festival_date.slice(5, 7))}/
                          {Number(op.festival_date.slice(8, 10))} ({op.time_slot === 'DAY' ? '주간' : '야간'}){' '}
                          {op.open_at}–{op.close_at}
                        </li>
                      ))}
                    </S.Operations>
                    {!booth.operations.length && <S.Text>운영 일정 미정</S.Text>}
                    <S.Text>입장료: {money(booth.entrance_fee)}</S.Text>
                  </S.Section>
                  {booth.category !== 'ECO' && booth.menus.length > 0 && (
                    <S.Section>
                      <S.Label>메뉴</S.Label>
                      <S.MenuList>
                        {[...booth.menus]
                          .sort((a, b) => a.sort_order - b.sort_order)
                          .map((menu) => (
                            <li key={menu.menu_id}>
                              <span>{menu.name}</span>
                              <span>{money(menu.price)}</span>
                            </li>
                          ))}
                      </S.MenuList>
                    </S.Section>
                  )}
                  {booth.event_description && (
                    <S.Section>
                      <S.Label>이벤트</S.Label>
                      <S.Text>{booth.event_description}</S.Text>
                    </S.Section>
                  )}
                  {booth.instagram_id && (
                    <S.Section>
                      <S.Label>인스타</S.Label>
                      <S.Instagram
                        href={`https://www.instagram.com/${encodeURIComponent(booth.instagram_id)}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        @{booth.instagram_id}
                      </S.Instagram>
                    </S.Section>
                  )}
                </>
              )}
              {booth.image_url && (
                <S.Section>
                  <S.Label>이미지</S.Label>
                  <S.Poster
                    src={booth.image_url}
                    alt={`${booth.name} 안내 이미지`}
                  />
                </S.Section>
              )}
            </>
          )}
        </>
      )}
    </S.Panel>
  )
}
