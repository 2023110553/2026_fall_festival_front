import Tag from '../../../components/common/Tag'
import OverflowMarquee from './OverflowMarquee'
import * as S from './NoticeList.styles'

export default function NoticeList({ notices = [], onSelect }) {
  return (
    <S.List>
      {notices.map((item) => (
        <S.Card key={item.id} type="button" onClick={() => onSelect(item.id)}>
          <S.TitleRow>
            <Tag tone={item.isUrgent ? 'danger' : 'default'}>
              {item.isUrgent ? '긴급 공지' : '일반 공지'}
            </Tag>
            <OverflowMarquee>{item.title}</OverflowMarquee>
          </S.TitleRow>
          <S.Summary>
            <time>{item.date}</time>
            <span>{item.content}</span>
          </S.Summary>
        </S.Card>
      ))}
    </S.List>
  )
}
