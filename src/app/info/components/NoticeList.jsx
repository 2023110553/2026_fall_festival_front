import Tag from '../../../components/common/Tag'
import EmptyState from '../../../components/common/EmptyState'
import OverflowMarquee from './OverflowMarquee'
import * as S from './NoticeList.styles'

export default function NoticeList({ notices = [], onSelect }) {
  if (notices.length === 0) {
    return <EmptyState>등록된 공지사항이 없습니다.</EmptyState>
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
              {item.type === 'URGENT' ? '긴급 공지' : '일반 공지'}
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
