import EmptyState from '../../../../components/common/EmptyState'
import { useTranslation } from '../../../../i18n/useTranslation'

// 검색 결과 리스트 — 결과 없음 상태 포함
export default function SearchResultList({ results }) {
  const { t } = useTranslation()
  if (results.length === 0) {
    return <EmptyState>{t('map.noSearchResults')}</EmptyState>
  }

  return (
    <ul>
      {results.map((booth) => (
        <li key={booth.id}>{booth.name}</li>
      ))}
    </ul>
  )
}
