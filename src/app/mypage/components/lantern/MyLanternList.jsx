import { useState } from 'react'
import Modal from '../../../../components/common/Modal'
import EmptyState from '../../../../components/common/EmptyState'
import LanternCard from '../../../lantern/components/LanternCard'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import EditLanternModal from '../../../lantern/components/EditLanternModal'
import { formatLanternDateTime } from '../../../lantern/utils/formatLanternDateTime'
import * as S from './MyLanternList.styles'

const largeModalStyle = {
  display: 'flex',
  width: '305px',
  padding: '28px 16px 16px 16px',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '16px',
  borderRadius: '12px',
  background: '#FFF',
  boxShadow:
    '0 3px 6px 0 rgba(255, 161, 161, 0.25), 0 -4px 6px 0 rgba(194, 255, 175, 0.25), 0 0 6px 0 rgba(243, 246, 188, 0.75)',
}

export default function MyLanternList({ isOpen, onClose, lanterns = [], onDelete, onEdit }) {
  const [deletingId, setDeletingId] = useState(null)
  const [editingLantern, setEditingLantern] = useState(null)

  // 삭제 확인 동작
  const handleConfirmDelete = () => {
    if (deletingId && onDelete) {
      onDelete(deletingId)
    }
    setDeletingId(null)
  }

  // 수정 완료 제출 시
  const handleConfirmEdit = (id, newContent) => {
    if (onEdit) {
      onEdit(id, newContent)
    }
    setEditingLantern(null) // 수정 모달 닫힘 -> 조건에 의해 다시 나의 등불 목록 모달이 뜸
  }

  return (
    <>
      {/* 수정 모달이 꺼져 있을 때만 '나의 등불 목록' 모달 렌더링 */}
      <Modal isOpen={isOpen && editingLantern === null} onClose={onClose} style={largeModalStyle}>
        {/* Header */}
        <S.Header>
          <S.Title>나의 등불({lanterns.length}/3)</S.Title>
          <S.SubTitle>오늘 남긴 등불 확인하기</S.SubTitle>
        </S.Header>

        {/* Body */}
        <S.ListWrapper>
          {lanterns.length === 0 ? (
            <EmptyState>등불이 아직 없습니다.</EmptyState>
          ) : (
            lanterns.map((l) => {
              const isAdmin = l.status === 'DELETED_BY_ADMIN'
              const isUserDeleted = l.isDeleted || l.status === 'DELETED_BY_USER'

              if (isAdmin || isUserDeleted) {
                return (
                  <S.DeletedCard key={l.id} $isAdmin={isAdmin}>
                    <S.DeletedNickname $isAdmin={isAdmin}>
                      {l.nickname || '익명의 코끼리'}
                    </S.DeletedNickname>
                    <S.DeletedMessage $isAdmin={isAdmin}>
                      {isAdmin ? '관리자에 의해 삭제된 댓글입니다.' : '삭제한 댓글입니다'}
                    </S.DeletedMessage>
                    <S.DeletedTime $isAdmin={isAdmin}>
                      {formatLanternDateTime(l.createdAt)}
                    </S.DeletedTime>
                  </S.DeletedCard>
                )
              }

              return (
                <LanternCard
                  key={l.id}
                  lantern={l}
                  isMine={true}
                  onEdit={() => setEditingLantern(l)} // 수정 클릭 시 지정
                  onDelete={(id) => setDeletingId(id)}
                />
              )
            })
          )}
        </S.ListWrapper>

        {/* Footer Notice */}
        <S.FooterNotice>
          <S.InfoIcon>i</S.InfoIcon>
          <S.NoticeText>
            등불은 하루 최대 3개까지 달 수 있어요. 삭제한 등불도 횟수에 포함돼요.
            <br />
            쿠폰은 발급 당일에만 사용 가능합니다.
          </S.NoticeText>
        </S.FooterNotice>

        <S.CloseBtn type="button" onClick={onClose}>
          닫기
        </S.CloseBtn>
      </Modal>

      {/* 2차 삭제 확인 모달 */}
      <ConfirmDeleteModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* 3차 단독 수정 모달 */}
      <EditLanternModal
        isOpen={editingLantern !== null}
        onClose={() => setEditingLantern(null)}
        lantern={editingLantern}
        onSubmit={handleConfirmEdit}
      />
    </>
  )
}