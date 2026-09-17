import Modal from "../../../../components/common/Modal";

export default function ConfirmLogoutModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ textAlign: 'left', padding: '4px 0' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#111' }}>
          로그아웃 하시겠습니까?
        </h2>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '6px', margin: '6px 0 0 0' }}>
          등불을 달려면 다시 로그인해야 합니다.
        </p>
      </div>

      {/* 하단 버튼 영역 */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            flex: 1,
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
        <button
          type="button"
          onClick={onConfirm}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#333333',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '14px',
            color: '#ffffff',
            cursor: 'pointer',
          }}
        >
          로그아웃
        </button>
      </div>
    </Modal>
  );
}