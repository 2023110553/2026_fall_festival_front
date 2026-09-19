import { useEffect, useRef, useState } from 'react'
import Modal from '../../../../components/common/Modal'
import EmptyState from '../../../../components/common/EmptyState'
import AlertModal from '../../../../components/common/AlertModal'
import LanternCard from '../../../lantern/components/LanternCard'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import EditLanternModal from '../../../lantern/components/EditLanternModal'
import { formatLanternDateTime } from '../../../lantern/utils/formatLanternDateTime'
import { formatDayLabel } from '../../../lantern/utils/formatDayLabel'
import { getToday } from '../../../lantern/utils/getToday'
import { getCurrentFestivalDate } from '../../../lantern/utils/getCurrentFestivalDate'
import { FESTIVAL_DATES } from '../../../../constants/festivalDates'
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

// 오늘이 축제 기간 전이면 DAY 1, 기간 중이면 해당 날짜, 기간이 다 지났으면 DAY 3을 기본 선택
// (등불 생성 시 festivalDate를 정하는 getCurrentFestivalDate와 동일한 보정 기준 — 새로 만든 등불이 항상 기본 선택된 day에 보이게 함)
function getDefaultDayIndex() {
  return FESTIVAL_DATES.indexOf(getCurrentFestivalDate())
}

export default function MyLanternList({ isOpen, onClose, lanterns = [], onDelete, onEdit }) {
  const [deletingId, setDeletingId] = useState(null)
  const [editingLantern, setEditingLantern] = useState(null)
  const [selectedDayIndex, setSelectedDayIndex] = useState(getDefaultDayIndex)
  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false)
  const [isEditRestrictedOpen, setIsEditRestrictedOpen] = useState(false)
  const dayPickerRef = useRef(null)

  // 드롭다운 바깥 클릭 시 닫기 (LanternCard의 더보기 메뉴와 동일한 패턴)
  useEffect(() => {
    if (!isDayDropdownOpen) return undefined

    const handleClickOutside = (e) => {
      if (dayPickerRef.current && !dayPickerRef.current.contains(e.target)) {
        setIsDayDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDayDropdownOpen])

  const selectedDate = FESTIVAL_DATES[selectedDayIndex]
  const today = getToday()
  const isPastDay = selectedDate < today
  const dayLanterns = lanterns.filter((l) => l.festivalDate === selectedDate)

  const handleSelectDay = (index) => {
    setSelectedDayIndex(index)
    setIsDayDropdownOpen(false)
  }

  // 지난 날짜(day)의 카드는 수정 불가 — 안내 모달만 띄우고 실제 수정 모달은 안 연다
  const handleEditClick = (lantern) => {
    if (isPastDay) {
      setIsEditRestrictedOpen(true)
    } else {
      setEditingLantern(lantern)
    }
  }

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
        <S.HeaderRow>
          <S.Header>
            <S.Title>나의 등불</S.Title>
            <S.SubTitle>내가 남긴 응원을 함께 확인해봐요.</S.SubTitle>
          </S.Header>

          <S.DayPicker ref={dayPickerRef}>
            <S.DayBadge
              type="button"
              onClick={() => setIsDayDropdownOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isDayDropdownOpen}
            >
              DAY {selectedDayIndex + 1}
              <S.DayBadgeChevron>⌄</S.DayBadgeChevron>
            </S.DayBadge>

            {isDayDropdownOpen && (
              <S.DayDropdown role="listbox">
                {FESTIVAL_DATES.map((date, index) => {
                  const isActive = index === selectedDayIndex
                  return (
                    <S.DayOption
                      key={date}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      $active={isActive}
                      onClick={() => handleSelectDay(index)}
                    >
                      <S.DayOptionLabel $active={isActive}>
                        DAY {index + 1}
                        <S.DayOptionDate>{formatDayLabel(date)}</S.DayOptionDate>
                      </S.DayOptionLabel>
                      <S.DayOptionCheck $active={isActive} aria-hidden="true">✓</S.DayOptionCheck>
                    </S.DayOption>
                  )
                })}
              </S.DayDropdown>
            )}
          </S.DayPicker>
        </S.HeaderRow>

        {/* Body */}
        <S.ListWrapper>
          {dayLanterns.length === 0 ? (
            <EmptyState>이 날짜에 남긴 등불이 없습니다.</EmptyState>
          ) : (
            dayLanterns.map((l) => {
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
                  onEdit={() => handleEditClick(l)}
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
            욕설 및 타인을 비방하는 글은 삭제조치 될 수 있어요. 지난 일자의 등불은 삭제만 가능하며
            수정은 불가해요.
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

      {/* 지난 날짜 등불 수정 시도 시 안내 */}
      <AlertModal
        isOpen={isEditRestrictedOpen}
        onClose={() => setIsEditRestrictedOpen(false)}
        title="지난 등불은 수정할 수 없어요"
        subTitle="지난 날짜의 등불은 삭제만 가능해요"
      />
    </>
  )
}
