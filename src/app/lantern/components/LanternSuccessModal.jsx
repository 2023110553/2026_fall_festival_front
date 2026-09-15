import Modal from '../../../components/common/Modal'

/**
 * 2번째, 3번째 등불 달기 성공 시 노출되는 완료 안내 모달 컴포넌트
 * @param {boolean} isOpen - 모달 열림 상태
 * @param {function} onClose - 모달 닫기 함수
 */
export default function LanternSuccessModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header & Content */}
      <div style={{ textAlign: 'left', padding: '4px 0' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#111' }}>
          등불을 성공적으로 남겼어요!
        </h2>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '6px', margin: '6px 0 0 0', lineHeight: '1.4' }}>
          쿠폰은 하루에 한 번, 첫 등불을 달 때만 받을 수 있어요.
        </p>
      </div>

      {/* Footer: 닫기 버튼 */}
      <div style={{ marginTop: '20px' }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#ededed',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '14px',
            color: '#666',
            cursor: 'pointer',
          }}
        >
          닫기
        </button>
      </div>
    </Modal>
  );
}