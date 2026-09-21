import AlertModal from '../../components/common/AlertModal'
import { useTranslation } from '../../i18n/useTranslation'

export default function ConfirmLogoutModal({ isOpen, onClose, onConfirm, pending = false }) {
  const { t } = useTranslation()

  return (
    <AlertModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('auth.logoutTitle')}
      subTitle={t('auth.logoutDescription')}
      buttonText={t('common.close')}
      onConfirm={onConfirm}
      confirmText={pending ? t('auth.loggingOut') : t('header.logout')}
      disabled={pending}
    />
  )
}
