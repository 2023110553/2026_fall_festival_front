import Tag from '../../../components/common/Tag'
import EmptyState from '../../../components/common/EmptyState'
import { formatNoticeDate } from '../utils/formatNoticeDate'
import { useTranslation } from '../../../i18n/useTranslation'
import * as S from './NoticeList.styles'

const getNoticeListTitle = (notice) => {
  if (notice.type !== 'URGENT') return notice.title

  const [month, day] = formatNoticeDate(notice.created_at).split('.')
  if (!month || !day) return notice.title

  return `[${Number(month)}/${Number(day)}]${notice.title}`
}

export default function NoticeList({ notices = [], onSelect }) {
  const { t } = useTranslation()
  if (notices.length === 0) {
    return <EmptyState>{t('notice.empty')}</EmptyState>
  }

  return (
    <S.List>
      {notices.map((item) => (
        <S.Card
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
        >
          <S.TitleRow>
            <Tag tone={item.type === 'URGENT' ? 'danger' : 'default'}>
              {item.type === 'URGENT' ? t('notice.urgent') : t('notice.normal')}
            </Tag>
            <S.Title>{getNoticeListTitle(item)}</S.Title>
          </S.TitleRow>
          <S.Summary>{item.content}</S.Summary>
        </S.Card>
      ))}
    </S.List>
  )
}
