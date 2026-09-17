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

  // 폼 초기화
  const resetForm = () => {
    setSelectedBooth('');
    setNickname('');
    setContent('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 입력값 검증: 부스 선택 + 축제 한마디 작성 시에만 버튼 활성화
  const isValid = selectedBooth !== '' && content.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

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
            onChange={(e) => setSelectedBooth(e.target.value)}
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
            <option value="" disabled hidden>
              부스를 선택해주세요
            </option>
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
            placeholder="입력 안 한 경우 → 익명의 코끼리"
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
            onChange={(e) => setContent(e.target.value)}
            placeholder="축제 한 마디를 적어주세요"
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
        </div>

        <p style={{ fontSize: '10px', color: '#aaa', lineHeight: '1.3', margin: 0 }}>
          ⓘ 등불은 하루 최대 3개까지 달 수 있어요. 삭제한 등불도 횟수에 포함돼요.
        </p>

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
            disabled={!isValid}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: isValid ? '#1e1e1e' : '#ccc',
              border: 'none',
              borderRadius: '14px',
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#ffffff',
              cursor: isValid ? 'pointer' : 'not-allowed',
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