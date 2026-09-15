import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import * as S from './AdminNoticeDetailPage.styles'
import { MOCK_NOTICES, NOTICE_TYPE_LABEL } from './mockNotices'
import ConfirmDeleteModal from '../LanternManage/ConfirmDeleteModal'

export default function AdminNoticeDetailPage() {
  const { noticeId } = useParams()
  const navigate = useNavigate()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const notice = MOCK_NOTICES.find((n) => String(n.id) === noticeId)

  const goToList = () => navigate('/admin/notices')

  const handleDeleteConfirm = () => {
    console.log('delete notice', notice.id)
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
          <S.HeaderTitle>공지 관리</S.HeaderTitle>
        </S.Header>

        {notice && (
          <>
            <S.TitleRow>
              <S.TypeTag $urgent={notice.type === 'URGENT'}>{NOTICE_TYPE_LABEL[notice.type]}</S.TypeTag>
              <S.Title>{notice.title}</S.Title>
            </S.TitleRow>
            <S.ContentCard>
              {notice.imageUrl && <S.Image src={notice.imageUrl} alt="" />}
              <S.Content>{notice.content}</S.Content>
            </S.ContentCard>
            <S.BottomBar>
              <S.PrimaryButton type="button">게시물 수정하기</S.PrimaryButton>
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
