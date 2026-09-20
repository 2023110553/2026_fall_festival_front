import Modal from "../../../../components/common/Modal";

const modalStyle = {
  width: '225px',
  padding: '16px 14px',
};

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} style={modalStyle}>
      <div style={{ textAlign: 'left', padding: '2px 0' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, color: '#111' }}>
          정말 삭제하시겠습니까?
        </h2>
        <p style={{ fontSize: '10px', color: '#666', margin: '4px 0 0 0' }}>
          삭제 후에는 데이터가 복구되지 않습니다.
        </p>
      </div>

      {/* 하단 버튼 영역 */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '14px' }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#ededed',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '11px',
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
            padding: '10px',
            backgroundColor: '#ffbaba',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '11px',
            color: '#be1919',
            cursor: 'pointer',
          }}
        >
          삭제하기
        </button>
      </div>
    </Modal>
  );
}