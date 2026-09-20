import * as S from './InfoDetailHeader.styles'

export default function InfoDetailHeader({ title, onBack, compact = false }) {
  return (
    <S.Header $compact={compact}>
      <S.Back type="button" onClick={onBack} aria-label={`${title} 목록으로 돌아가기`}>
        ‹
      </S.Back>
      <h2>{title}</h2>
      <span aria-hidden="true" />
    </S.Header>
  )
}
