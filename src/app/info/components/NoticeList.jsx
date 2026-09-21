import Tag from '../../../components/common/Tag'
import EmptyState from '../../../components/common/EmptyState'
import OverflowMarquee from './OverflowMarquee'
import { useTranslation } from '../../../i18n/useTranslation'
import * as S from './NoticeList.styles'

export default function NoticeList({ notices = [], onSelect }) {
  const { t } = useTranslation()
  if (notices.length === 0) {
    return <EmptyState>{t('notice.empty')}</EmptyState>
  }

  return (
    <S.List>
      {notices.map((item) => (
        <S.Card
          key={item.notice_id}
          type="button"
          onClick={() => onSelect(item.notice_id)}
        >
          <S.TitleRow>
            <Tag tone={item.type === 'URGENT' ? 'danger' : 'default'}>
              {item.type === 'URGENT' ? t('notice.urgent') : t('notice.normal')}
            </Tag>
            <OverflowMarquee>{item.title}</OverflowMarquee>
          </S.TitleRow>
          <S.Summary>
            <time dateTime={item.created_at}>
              {item.created_at.slice(5, 10).replace('-', '.')}
            </time>
            <span>{item.preview_content}</span>
          </S.Summary>
        </S.Card>
      ))}
    </S.List>
  )
}
