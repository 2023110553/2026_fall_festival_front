// 등불을 아직 하나도 안 단 상태에서 나의 쿠폰 클릭 시 노출되는 안내 모달

import Modal from '../../../../components/common/Modal'

export default function NoLanternCouponModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ textAlign: 'center', padding: '4px 0' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#111' }}>
          등불이 아직 없습니다
        </h2>
        <p style={{ fontSize: '13px', color: '#666', marginTop: '8px', margin: '8px 0 0 0' }}>
          첫 등불을 달고 스크래치 쿠폰을 받아보세요
        </p>
      </div>

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
  )
}
