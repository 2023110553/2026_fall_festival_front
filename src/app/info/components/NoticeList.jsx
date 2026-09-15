import Tag from '../../../components/common/Tag'
import * as S from './NoticeList.styles'

export default function NoticeList({ notices = [], onSelect }) {
  return <S.Stack><S.Heading><h2>축제 공지</h2><p>운영 및 일정 관련 소식을 확인하세요.</p></S.Heading><S.List>{notices.map((item) => <S.Card key={item.id} type="button" onClick={() => onSelect(item.id)}><S.Meta><Tag tone={item.isUrgent?'danger':'default'}>{item.isUrgent?'긴급 공지':'일반 공지'}</Tag><time>{item.date}</time></S.Meta><strong>{item.title}</strong><S.Chevron>›</S.Chevron></S.Card>)}</S.List></S.Stack>
}
