import { useTranslation } from '../../../i18n/useTranslation'
import * as S from './InfoDetailHeader.styles'

export default function InfoDetailHeader({ title, onBack, compact = false }) {
  const { t } = useTranslation()
  return (
    <S.Header $compact={compact}>
      <S.Back type="button" onClick={onBack} aria-label={t('common.backToList', { title })}>
        ‹
      </S.Back>
      <h2>{title}</h2>
      <span aria-hidden="true" />
    </S.Header>
  )
}
