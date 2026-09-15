import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import * as S from './AdminLostFoundDetailPage.styles'
import { MOCK_LOST_FOUND } from './mockLostFound'
import ConfirmDeleteModal from '../LanternManage/ConfirmDeleteModal'

export default function AdminLostFoundDetailPage() {
  const { itemId } = useParams()
  const navigate = useNavigate()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const item = MOCK_LOST_FOUND.find((i) => String(i.id) === itemId)

  const goToList = () => navigate('/admin/lost-found')

  const handleDeleteConfirm = () => {
    console.log('delete lost-found', item.id)
    setIsDeleteOpen(false)
    goToList()
  }

  return (
    <S.Page>
      <S.Container>
        <S.Header>
          <S.BackButton type="button" aria-label="뒤로가기" onClick={goToList}>
            <svg width="12" height="22" viewBox="0 0 12 22" fill="none" aria-hidden="true">
              <path d="M11 1L1 11L11 21" stroke="#000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </S.BackButton>
          <S.HeaderTitle>분실물 관리</S.HeaderTitle>
        </S.Header>

        {item && (
          <>
            <S.TitleRow>
              <S.DateTag>{item.date}</S.DateTag>
              <S.Title>{item.title}</S.Title>
            </S.TitleRow>
            <S.ImageArea>{item.imageUrl && <S.Image src={item.imageUrl} alt="" />}</S.ImageArea>
            <S.KeywordSection>
              <S.KeywordList>
                {item.keywords.map((keyword) => (
                  <S.Keyword key={keyword}>#{keyword}</S.Keyword>
                ))}
              </S.KeywordList>
            </S.KeywordSection>
            <S.BottomBar>
              <S.PrimaryButton type="button" onClick={() => navigate(`/admin/lost-found/${itemId}/edit`)}>
                게시물 수정하기
              </S.PrimaryButton>
              <S.DangerButton type="button" onClick={() => setIsDeleteOpen(true)}>
                삭제하기
              </S.DangerButton>
            </S.BottomBar>
          </>
        )}
      </S.Container>

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </S.Page>
  )
}
