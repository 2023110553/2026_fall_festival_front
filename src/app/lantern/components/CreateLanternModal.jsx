import { useEffect, useRef, useState } from 'react';
import Modal from '../../../components/common/Modal'
import * as S from './CreateLanternModal.styles'

// 부스별 점 색상 — BE에서 부스 색상 필드를 내려주기 전까지 인덱스로 순환
const BOOTH_DOT_COLORS = ['#FF6B6B', '#5FD068', '#4C9AFF', '#FFC24C'];

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
};

export default function CreateLanternModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  boothList = [],
  currentCount = 0, // 현재 작성한 등불 개수
}) {
  const [selectedBooth, setSelectedBooth] = useState('');
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [boothError, setBoothError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [isBoothOpen, setIsBoothOpen] = useState(false);
  const boothFieldRef = useRef(null);

  const resolvedBoothList = boothList.length > 0
    ? boothList
    // 일단 부스 더미데이터로 넣어놓음
    : [
        { id: 'booth1', name: '맛있는 타코야키 부스' },
        { id: 'booth2', name: '컴퓨터공학과 체험 부스' },
        { id: 'booth3', name: '중앙 동아리 밴드 공연 부스' },
      ];

  const selectedBoothName = resolvedBoothList.find((booth) => booth.id === selectedBooth)?.name ?? '';

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
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSelectBooth = (boothId) => {
    setSelectedBooth(boothId);
    setBoothError(false);
    setIsBoothOpen(false);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (e.target.value.trim().length > 0) setContentError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isBoothEmpty = selectedBooth === '';
    const isContentEmpty = content.trim().length === 0;

    if (isBoothEmpty || isContentEmpty) {
      setBoothError(isBoothEmpty);
      setContentError(isContentEmpty);
      return;
    }

    // 닉네임 안 적은 경우 '익명의 코끼리' 적용
    const finalNickname = nickname.trim() || '익명의 코끼리';

    const lanternData = {
      boothId: selectedBooth,
      nickname: finalNickname,
      content: content.trim(),
    };

    if (onSubmitSuccess) {
      onSubmitSuccess(lanternData);
    }

    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} style={largeModalStyle}>
      <S.Form onSubmit={handleSubmit}>
        <S.TopWrapper>
          {/* Header */}
          <S.HeaderWrapper>
            <S.ModalTitle>
              등불 달기 ({Math.min(currentCount + 1, 3)}/3)
            </S.ModalTitle>
            <S.ModalSubtitle>
              축제 한 마디 남기고 부스를 응원해봐요.
            </S.ModalSubtitle>
          </S.HeaderWrapper>

          <S.FieldsGroup>
            {/* 부스 선택 드롭다운 */}
            <S.FieldWrapper>
              <S.Label>부스 선택</S.Label>
              <S.SelectWrapper ref={boothFieldRef}>
                <S.SelectTrigger
                  type="button"
                  onClick={() => setIsBoothOpen((prev) => !prev)}
                  $hasValue={selectedBooth !== ''}
                >
                  <span>{selectedBoothName}</span>
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
                    {resolvedBoothList.map((booth, index) => (
                      <S.DropdownItem key={booth.id} onClick={() => handleSelectBooth(booth.id)}>
                        <S.Dot $color={BOOTH_DOT_COLORS[index % BOOTH_DOT_COLORS.length]} />
                        {booth.name}
                      </S.DropdownItem>
                    ))}
                  </S.DropdownList>
                )}
              </S.SelectWrapper>
              {boothError && <S.ErrorText>부스를 선택해주세요.</S.ErrorText>}
            </S.FieldWrapper>

            {/* 닉네임 입력 */}
            <S.FieldWrapper>
              <S.Label>
                닉네임 <S.OptionalText>(선택)</S.OptionalText>
              </S.Label>
              <S.InputWrapper>
                <S.Input
                  type="text"
                  maxLength={5}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
                <S.CharCount>{nickname.length}/5</S.CharCount>
              </S.InputWrapper>
            </S.FieldWrapper>

            {/* 축제 한마디 */}
            <S.FieldWrapper>
              <S.Label>축제 한마디</S.Label>
              <S.InputWrapper>
                <S.Textarea
                  maxLength={30}
                  rows={3}
                  value={content}
                  onChange={handleContentChange}
                />
                <S.CharCount>{content.length}/30</S.CharCount>
              </S.InputWrapper>
              {contentError && <S.ErrorText>축제 한마디를 입력해주세요.</S.ErrorText>}
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
            <S.NoticeText>
              등불은 하루 최대 3개까지 달 수 있어요. 삭제한 등불도 횟수에 포함돼요.
              <br />
              욕설 및 타인을 비방하는 글은 삭제조치 될 수 있어요. 지난 일자의 등불은 삭
              <br />
              제만 가능하며 수정은 불가해요.
            </S.NoticeText>
          </S.NoticeWrapper>
        </S.TopWrapper>
        {/* Footer 버튼 */}
        <S.ButtonRow>
          <S.CloseButton type="button" onClick={handleClose}>
            닫기
          </S.CloseButton>

          <S.SubmitButton type="submit">
            등불 달기
          </S.SubmitButton>
        </S.ButtonRow>
      </S.Form>
    </Modal>
  );
}
