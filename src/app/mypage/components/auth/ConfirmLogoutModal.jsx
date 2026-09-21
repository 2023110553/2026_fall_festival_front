import AlertModal from '../../../../components/common/AlertModal'

export default function ConfirmLogoutModal({ isOpen, onClose, onConfirm }) {
  return (
    <AlertModal
      isOpen={isOpen}
      onClose={onClose}
      title="로그아웃 하시겠습니까?"
      subTitle="등불을 달려면 다시 로그인해야 해요."
      buttonText="닫기"
      onConfirm={onConfirm}
      confirmText="로그아웃"
    />
  )
}
