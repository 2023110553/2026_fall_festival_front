import Modal from '../../../components/common/Modal'

export default function LanternLimitModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ textAlign: 'left', padding: '4px 0' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#111' }}>
          등불 3개를 모두 달았어요
        </h2>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '6px', margin: '6px 0 0 0' }}>
          등불은 하루에 3개씩만 달 수 있어요
        </p>
      </div>

      {/* 하단 닫기 버튼 */}
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