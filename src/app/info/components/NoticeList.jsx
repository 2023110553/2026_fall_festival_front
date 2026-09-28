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
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
        >
          <S.TitleRow>
            <Tag tone={item.type === 'URGENT' ? 'danger' : 'default'}>
              {item.type === 'URGENT' ? t('notice.urgent') : t('notice.normal')}
            </Tag>
            <OverflowMarquee>{item.title}</OverflowMarquee>
          </S.TitleRow>
          <S.Summary>{item.content}</S.Summary>
        </S.Card>
      ))}
    </S.List>
  )
}
