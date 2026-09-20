import { useEffect, useRef, useState } from 'react'
import Modal from '../../../../components/common/Modal'
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
  borderRadius: '12px',
  background: '#F7F7F7',
  boxShadow:
    '0 0 10px 0 rgba(0, 0, 0, 0.15)',
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
  const handleConfirmEdit = (id, updates) => {
    if (onEdit) {
      onEdit(id, updates)
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
              <S.DayBadgeChevron
                width="6"
                height="4"
                viewBox="0 0 6 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.40242 0.127416C5.32039 0.0454869 5.20919 -0.00053215 5.09325 -0.00053215C4.97732 -0.00053215 4.86612 0.0454869 4.78409 0.127416L2.75992 2.15158L0.735753 0.127416C0.652818 0.0501366 0.543125 0.00806427 0.429782 0.0100639C0.31644 0.0120637 0.208298 0.0579796 0.128141 0.138137C0.0479832 0.218295 0.00206795 0.326436 6.8161e-05 0.439778C-0.00193163 0.553121 0.0401401 0.662814 0.11742 0.745749L2.45075 3.07908C2.53279 3.16101 2.64398 3.20703 2.75992 3.20703C2.87586 3.20703 2.98706 3.16101 3.06909 3.07908L5.40242 0.745749C5.48435 0.663718 5.53037 0.552521 5.53037 0.436583C5.53037 0.320645 5.48435 0.209448 5.40242 0.127416Z"
                  fill="#FDFDFD"
                />
              </S.DayBadgeChevron>
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
                      <S.DayOptionCheck
                        $active={isActive}
                        aria-hidden="true"
                        width="11"
                        height="8"
                        viewBox="0 0 11 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.485352 3.87937L3.88035 7.27437L9.53868 0.484375"
                          strokeWidth="0.97"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </S.DayOptionCheck>
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
            <S.EmptyState>아직 남긴 등불이 없습니다.</S.EmptyState>
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
                    {l.boothName && (
                      <S.DeletedBoothName $isAdmin={isAdmin}>{l.boothName}</S.DeletedBoothName>
                    )}
                    <S.DeletedMessage $isAdmin={isAdmin}>
                      {isAdmin ? '관리자에 의해 삭제된 댓글입니다.' : '삭제한 댓글입니다'}
                    </S.DeletedMessage>
                    <S.DeletedTime $isAdmin={isAdmin}>
                      {formatLanternDateTime(l.updatedAt ?? l.createdAt)}
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
          <S.InfoIcon width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 3.5H6.5V6.5H5.5V3.5ZM5.5 7.5H6.5V8.5H5.5V7.5Z" fill="#9F9C99" />
            <path
              d="M6 11C8.755 11 11 8.755 11 6C11 3.245 8.755 1 6 1C3.245 1 1 3.245 1 6C1 8.755 3.245 11 6 11ZM6 2C8.205 2 10 3.795 10 6C10 8.205 8.205 10 6 10C3.795 10 2 8.205 2 6C2 3.795 3.795 2 6 2Z"
              fill="#9F9C99"
            />
          </S.InfoIcon>
          <S.NoticeText>
            등불은 하루 최대 3개까지 작성할 수 있으며, 삭제한 등불도 작성 횟수에 포함돼요.
            <br />
            욕설이나 타인을 비방하는 내용은 운영 정책에 따라 삭제될 수 있어요.
            <br />
            지난 날짜에 작성한 등불은 삭제만 가능하며 수정할 수 없어요.
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
