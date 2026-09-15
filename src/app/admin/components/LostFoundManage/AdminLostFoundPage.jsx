import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import * as S from './AdminLostFoundPage.styles'
import { MOCK_LOST_FOUND } from './mockLostFound'
import LostFoundDateSelectModal from './LostFoundDateSelectModal'

// 분실물 관리 — 목록(날짜/제목/해시태그), 신규 등록(날짜 선택 모달→작성)
export default function AdminLostFoundPage() {
  const navigate = useNavigate()
  const [isDateSelectOpen, setIsDateSelectOpen] = useState(false)

  const items = MOCK_LOST_FOUND

  return (
    <S.Page>
      <S.TotalCount>{items.length}개</S.TotalCount>
      <S.ItemList>
        {items.map((item) => (
          <S.ItemCard key={item.id} onClick={() => navigate(`/admin/lost-found/${item.id}`)}>
            <S.CardContent>
              <S.TitleRow>
                <S.DateTag>{item.date}</S.DateTag>
                <S.Title>{item.title}</S.Title>
              </S.TitleRow>
              <S.KeywordList>
                {item.keywords.map((keyword) => (
                  <S.Keyword key={keyword}>#{keyword}</S.Keyword>
                ))}
              </S.KeywordList>
            </S.CardContent>
            <S.Thumbnail>{item.imageUrl && <img src={item.imageUrl} alt="" />}</S.Thumbnail>
          </S.ItemCard>
        ))}
      </S.ItemList>
      <S.BottomBar>
        <S.PrimaryButton type="button" onClick={() => setIsDateSelectOpen(true)}>
          분실물 추가하기
        </S.PrimaryButton>
      </S.BottomBar>

      <LostFoundDateSelectModal
        isOpen={isDateSelectOpen}
        onClose={() => setIsDateSelectOpen(false)}
        onSelect={(date) => navigate(`/admin/lost-found/new?date=${encodeURIComponent(date)}`)}
      />
    </S.Page>
  )
}
