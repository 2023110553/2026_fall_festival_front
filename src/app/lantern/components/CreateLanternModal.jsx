import { useState } from 'react';
import Modal from '../../../components/common/Modal'

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

  // 폼 초기화
  const resetForm = () => {
    setSelectedBooth('');
    setNickname('');
    setContent('');
    setBoothError(false);
    setContentError(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBoothChange = (e) => {
    setSelectedBooth(e.target.value);
    if (e.target.value !== '') setBoothError(false);
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
      {/* Header */}
      <div style={{ textAlign: 'left', width: '100%', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#111' }}>
          등불 달기 ({Math.min(currentCount + 1, 3)}/3)
        </h2>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '4px', margin: 0, fontWeight: '500' }}>
          축제 한 마디 남기고 부스 응원하기
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ textAlign: 'left', width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* 부스 선택 드롭다운 */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: '#333' }}>
            부스 선택
          </label>
          <select
            value={selectedBooth}
            onChange={handleBoothChange}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '12px',
              border: '1px solid #ddd',
              fontSize: '12px',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: '#fff',
              color: selectedBooth ? '#111' : '#aaa',
            }}
          >
            <option value="" disabled hidden></option>
            {boothList.length > 0 ? (
              boothList.map((booth) => (
                <option key={booth.id} value={booth.id} style={{ color: '#111' }}>
                  {booth.name}
                </option>
              ))
            ) : (
              // 일단 부스 더미데이터로 넣어놓음
              <>
                <option value="booth1" style={{ color: '#111' }}>맛있는 타코야키 부스</option>
                <option value="booth2" style={{ color: '#111' }}>컴퓨터공학과 체험 부스</option>
                <option value="booth3" style={{ color: '#111' }}>중앙 동아리 밴드 공연 부스</option>
              </>
            )}
          </select>
          {boothError && (
            <p style={{ fontSize: '10px', color: '#e33e3e', margin: '4px 0 0' }}>
              부스를 선택해주세요.
            </p>
          )}
        </div>

        {/* 닉네임 입력 */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#333' }}>
              닉네임 <span style={{ fontWeight: 'normal', color: '#aaa' }}>(선택)</span>
            </label>
            <span style={{ fontSize: '10px', color: '#aaa' }}>{nickname.length}/5</span>
          </div>
          <input
            type="text"
            maxLength={5}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '12px',
              border: '1px solid #ddd',
              fontSize: '12px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 축제 한마디 */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#333' }}>
              축제 한마디
            </label>
            <span style={{ fontSize: '10px', color: '#aaa' }}>{content.length}/30</span>
          </div>
          <textarea
            maxLength={30}
            rows={3}
            value={content}
            onChange={handleContentChange}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '12px',
              border: '1px solid #ddd',
              fontSize: '12px',
              outline: 'none',
              resize: 'none',
              boxSizing: 'border-box',
            }}
          />
          {contentError && (
            <p style={{ fontSize: '10px', color: '#e33e3e', margin: '4px 0 0' }}>
              축제 한마디를 입력해주세요.
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', width: '100%', textAlign: 'left' }}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink: 0, marginTop: '1px' }}
          >
            <path d="M5.5 3.5H6.5V6.5H5.5V3.5ZM5.5 7.5H6.5V8.5H5.5V7.5Z" fill="#9F9C99" />
            <path
              d="M6 11C8.755 11 11 8.755 11 6C11 3.245 8.755 1 6 1C3.245 1 1 3.245 1 6C1 8.755 3.245 11 6 11ZM6 2C8.205 2 10 3.795 10 6C10 8.205 8.205 10 6 10C3.795 10 2 8.205 2 6C2 3.795 3.795 2 6 2Z"
              fill="#9F9C99"
            />
          </svg>
          <p style={{ fontFamily: 'Pretendard', fontSize: '8px', color: '#9F9C99', fontWeight: 400, margin: 0 }}>
            등불은 하루 최대 3개까지 달 수 있어요. 삭제한 등불도 횟수에 포함돼요.
            <br />
            욕설 및 타인을 비방하는 글은 삭제조치 될 수 있어요. 지난 일자의 등불은 삭제만 가능하며
            수정은 불가해요.
          </p>
        </div>

        {/* Footer 버튼 */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button
            type="button"
            onClick={handleClose}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#f4f4f4',
              border: 'none',
              borderRadius: '14px',
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#555',
              cursor: 'pointer',
            }}
          >
            닫기
          </button>
          
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#1e1e1e',
              border: 'none',
              borderRadius: '14px',
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            등불 달기
          </button>
        </div>
      </form>
    </Modal>
  );
}