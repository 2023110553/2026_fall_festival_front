import { useEffect, useRef, useState } from 'react';
import Modal from '../../../components/common/Modal'
import AlertModal from '../../../components/common/AlertModal'
import * as S from './CreateLanternModal.styles'
import { BOOTH_CATEGORIES } from '../../../constants/categories'
import { getLanternBoothOptions } from '../../../api/lantern'
import { useTranslation } from '../../../i18n/useTranslation'

// map 도메인 PinLabel.jsx와 동일한 방식 — 부스 category를 지도 마커와 같은 색으로 매핑
const DEFAULT_BOOTH_DOT_COLOR = '#DC7054';
const getCategoryColor = (category) =>
  BOOTH_CATEGORIES.find((item) => item.value === category)?.color ?? DEFAULT_BOOTH_DOT_COLOR;

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
    '0 0 10px 0 rgba(0, 0, 0, 0.15)',
};

export default function CreateLanternModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  boothList = [],
  usedBoothIds = [], // 오늘 이미 등불을 단 부스 ID 목록 — 드롭다운에서 재선택 방지용
  currentCount = 0, // 현재 작성한 등불 개수
  presetBoothId = null, // 부스 상세에서 진입한 경우 미리 선택돼 있어야 할 부스 ID
}) {
  const { t } = useTranslation()
  const [selectedBooth, setSelectedBooth] = useState('');
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [boothError, setBoothError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [isBoothOpen, setIsBoothOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isDuplicateBoothModalOpen, setIsDuplicateBoothModalOpen] = useState(false);
  const [isForbiddenWordModalOpen, setIsForbiddenWordModalOpen] = useState(false);
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [fetchedBoothList, setFetchedBoothList] = useState([]);
  const [isBoothListLoading, setIsBoothListLoading] = useState(false);
  const boothFieldRef = useRef(null);

  // 모달이 열릴 때마다 당일 운영 부스 목록을 새로 받아온다 (지도팀 소관 GET /api/booths/,
  // 여긴 부스 선택 드롭다운 전용으로만 사용 — place_type=BOOTH만 등불을 달 수 있음)
  useEffect(() => {
    if (!isOpen || boothList.length > 0) return;

    let cancelled = false;
    setIsBoothListLoading(true);

    getLanternBoothOptions()
      .then((res) => {
        if (cancelled) return;
        const booths = res.data?.data?.booths ?? [];
        setFetchedBoothList(
          booths
            .filter((booth) => booth.place_type === 'BOOTH')
            .map((booth) => ({ id: booth.booth_id, name: booth.name, category: booth.category }))
        );
      })
      .catch(() => {
        if (!cancelled) setFetchedBoothList([]);
      })
      .finally(() => {
        if (!cancelled) setIsBoothListLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, boothList.length]);

  const resolvedBoothList = boothList.length > 0 ? boothList : fetchedBoothList;

  const selectedBoothName = resolvedBoothList.find((booth) => booth.id === selectedBooth)?.name ?? '';

  // 부스 상세에서 진입한 경우 해당 부스를 자동으로 선택해둔다 (이미 등불을 단 부스면 건너뜀)
  useEffect(() => {
    if (!isOpen || !presetBoothId || selectedBooth !== '') return;
    const matched = resolvedBoothList.find((booth) => booth.id === presetBoothId);
    if (!matched || usedBoothIds.includes(Number(presetBoothId))) return;
    setSelectedBooth(presetBoothId);
  }, [isOpen, presetBoothId, resolvedBoothList, selectedBooth, usedBoothIds]);

  // 드롭다운 바깥 클릭 시 닫기
  useEffect(() => {
    if (!isBoothOpen) return undefined;

    const handleOutsideClick = (e) => {
      if (boothFieldRef.current && !boothFieldRef.current.contains(e.target)) {
        setIsBoothOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isBoothOpen]);

  // 폼 초기화
  const resetForm = () => {
    setSelectedBooth('');
    setNickname('');
    setContent('');
    setBoothError(false);
    setContentError(false);
    setIsBoothOpen(false);
    setSubmitError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 빈 화면(오버레이) 또는 닫기 버튼 클릭 시 바로 닫지 않고 먼저 확인 모달을 띄운다
  const requestClose = () => setIsLeaveConfirmOpen(true);

  const confirmLeave = () => {
    setIsLeaveConfirmOpen(false);
    handleClose();
  };

  // 이미 등불을 단 부스를 다시 고르려고 하면 선택 자체를 막고 안내 모달을 띄운다
  const handleSelectBooth = (boothId) => {
    if (usedBoothIds.includes(Number(boothId))) {
      setIsBoothOpen(false);
      setIsDuplicateBoothModalOpen(true);
      return;
    }
    setSelectedBooth(boothId);
    setBoothError(false);
    setIsBoothOpen(false);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (e.target.value.trim().length > 0) setContentError(false);
  };

  // onSubmitSuccess는 부모(useCreateLanternFlow)에서 실제 등록 API를 호출하고,
  // 실패 시 { field, code, message } 형태로 reject해서 인라인 에러/안내 모달로 보여준다.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const isBoothEmpty = selectedBooth === '';
    const isContentEmpty = content.trim().length === 0;

    if (isBoothEmpty || isContentEmpty) {
      setBoothError(isBoothEmpty);
      setContentError(isContentEmpty);
      return;
    }

    if (!onSubmitSuccess) return;

    // 닉네임 기본값("익명의 코끼리")은 백엔드가 명시적으로 채워준다 — 프론트는 입력값 그대로(빈 값 포함)만 전달
    // boothName은 API로 보내지 않고, 카드에 바로 표시하기 위해 로컬에서만 같이 들고 다닌다
    const lanternData = {
      boothId: selectedBooth,
      boothName: selectedBoothName,
      nickname: nickname.trim(),
      message: content.trim(),
    };

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await onSubmitSuccess(lanternData);
      resetForm();
      onClose();
    } catch (err) {
      if (err?.code === 'DUPLICATE_BOOTH_LANTERN') {
        setIsDuplicateBoothModalOpen(true);
      } else if (err?.code === 'FORBIDDEN_WORD_DETECTED') {
        setIsForbiddenWordModalOpen(true);
      } else {
        setSubmitError(err?.message || '등불 등록에 실패했어요. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Modal isOpen={isOpen} onClose={requestClose} style={largeModalStyle}>
      <S.Form onSubmit={handleSubmit}>
        <S.TopWrapper>
          {/* Header */}
          <S.HeaderWrapper>
            <S.ModalTitle>
              {t('lantern.addTitle', { count: Math.min(currentCount + 1, 3) })}
            </S.ModalTitle>
            <S.ModalSubtitle>
              {t('lantern.addDescription')}
            </S.ModalSubtitle>
          </S.HeaderWrapper>

          <S.FieldsGroup>
            {/* 부스 선택 드롭다운 */}
            <S.FieldWrapper>
              <S.Label>{t('lantern.selectBooth')}</S.Label>
              <S.SelectWrapper ref={boothFieldRef}>
                <S.SelectTrigger
                  type="button"
                  onClick={() => setIsBoothOpen((prev) => !prev)}
                  $hasValue={selectedBooth !== ''}
                >
                  <span>{isBoothListLoading ? t('lantern.loadingBooths') : (selectedBoothName || t('lantern.selectBoothPlaceholder'))}</span>
                  <S.Chevron
                    $isOpen={isBoothOpen}
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1 1L5 5L9 1" stroke="#9F9C99" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </S.Chevron>
                </S.SelectTrigger>

                {isBoothOpen && (
                  <S.DropdownList>
                    {resolvedBoothList.map((booth) => (
                      <S.DropdownItem key={booth.id} onClick={() => handleSelectBooth(booth.id)}>
                        <S.Dot $color={getCategoryColor(booth.category)} />
                        {booth.name}
                      </S.DropdownItem>
                    ))}
                  </S.DropdownList>
                )}
              </S.SelectWrapper>
              {boothError && <S.ErrorText>{t('lantern.selectBoothPlaceholder')}</S.ErrorText>}
            </S.FieldWrapper>

            {/* 닉네임 입력 */}
            <S.FieldWrapper>
              <S.Label>
                {t('lantern.nickname')} <S.OptionalText>{t('lantern.optional')}</S.OptionalText>
              </S.Label>
              <S.InputWrapper>
                <S.Input
                  type="text"
                  maxLength={5}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={t('lantern.nicknamePlaceholder')}
                />
                <S.CharCount>{nickname.length}/5</S.CharCount>
              </S.InputWrapper>
            </S.FieldWrapper>

            {/* 축제 한마디 */}
            <S.FieldWrapper>
              <S.Label>{t('lantern.message')}</S.Label>
              <S.InputWrapper>
                <S.Textarea
                  maxLength={30}
                  rows={3}
                  value={content}
                  onChange={handleContentChange}
                  placeholder={t('lantern.messagePlaceholder')}
                />
                <S.CharCount>{content.length}/30</S.CharCount>
              </S.InputWrapper>
              {contentError && <S.ErrorText>{t('lantern.messageRequired')}</S.ErrorText>}
            </S.FieldWrapper>
          </S.FieldsGroup>

          <S.NoticeWrapper>
            <S.InfoIcon width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.5 3.5H6.5V6.5H5.5V3.5ZM5.5 7.5H6.5V8.5H5.5V7.5Z" fill="#9F9C99" />
              <path
                d="M6 11C8.755 11 11 8.755 11 6C11 3.245 8.755 1 6 1C3.245 1 1 3.245 1 6C1 8.755 3.245 11 6 11ZM6 2C8.205 2 10 3.795 10 6C10 8.205 8.205 10 6 10C3.795 10 2 8.205 2 6C2 3.795 3.795 2 6 2Z"
                fill="#9F9C99"
              />
            </S.InfoIcon>
            <S.NoticeText>{t('lantern.policy')}</S.NoticeText>
          </S.NoticeWrapper>

          {submitError && <S.ErrorText>{submitError}</S.ErrorText>}
        </S.TopWrapper>
        {/* Footer 버튼 */}
        <S.ButtonRow>
          <S.CloseButton type="button" onClick={requestClose}>
            {t('common.close')}
          </S.CloseButton>

          <S.SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('lantern.submitting') : t('nav.addLantern')}
          </S.SubmitButton>
        </S.ButtonRow>
      </S.Form>
    </Modal>

    <AlertModal
      isOpen={isDuplicateBoothModalOpen}
      onClose={() => setIsDuplicateBoothModalOpen(false)}
      title={t('lantern.duplicateTitle')}
      subTitle={t('lantern.duplicateDescription')}
    />

    <AlertModal
      isOpen={isForbiddenWordModalOpen}
      onClose={() => setIsForbiddenWordModalOpen(false)}
      title={t('lantern.forbiddenTitle')}
      subTitle={t('lantern.forbiddenDescription')}
    />

    <AlertModal
      isOpen={isLeaveConfirmOpen}
      onClose={() => setIsLeaveConfirmOpen(false)}
      title={t('lantern.leaveTitle')}
      subTitle={t('lantern.leaveDescription')}
      buttonText={t('common.cancel')}
      onConfirm={confirmLeave}
      confirmText={t('lantern.leave')}
    />
    </>
  );
}
