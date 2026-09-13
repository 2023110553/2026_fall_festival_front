import { useState } from 'react'
import BottomNav from '../../components/layout/BottomNav'
import FestivalDateTabs from '../../components/common/FestivalDateTabs'
import TopHeader from '../../components/common/TopHeader'
import * as S from './ComponentPreviewPage.styles'

export default function ComponentPreviewPage() {
  const [selectedDate, setSelectedDate] = useState('29')

  return (
    <S.Page>
      <S.Content>
        <h1>공통 컴포넌트 미리보기</h1>

        <S.Section>
          <h2>상단 헤더</h2>
          <S.HeaderPreview>
            <S.StateLabel>로그인 전</S.StateLabel>
            <TopHeader title="지도" isLoggedIn={false} />
          </S.HeaderPreview>
          <S.HeaderPreview>
            <S.StateLabel>로그인 후 · 아이콘을 눌러보세요</S.StateLabel>
            <TopHeader title="지도" isLoggedIn />
          </S.HeaderPreview>
        </S.Section>

        <S.Section>
          <h2>축제 날짜 선택</h2>
          <FestivalDateTabs value={selectedDate} onChange={setSelectedDate} />
          <S.Value>현재 선택값: {selectedDate}</S.Value>
        </S.Section>

        <S.Section>
          <h2>Bottom Navigation</h2>
          <p>화면 아래에 고정된 실제 컴포넌트를 확인하세요.</p>
        </S.Section>
      </S.Content>

      <BottomNav />
    </S.Page>
  )
}
