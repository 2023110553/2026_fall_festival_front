import Tag from '../../../components/common/Tag'
import * as S from './NoticeDetail.styles'

export default function NoticeDetail({ notice, onBack }) {
  if (!notice) return null
  return <S.Page>
    <S.Back type="button" onClick={onBack}>← 목록으로</S.Back>
    <S.Meta><Tag tone={notice.isUrgent ? 'danger' : 'default'}>{notice.isUrgent ? '긴급 공지' : '일반 공지'}</Tag><time>{notice.date}</time></S.Meta>
    <S.Title>{notice.title}</S.Title>
    {notice.imageUrl && <S.Image src={notice.imageUrl} alt={notice.title} />}
    <S.Content>{notice.content}</S.Content>
  </S.Page>
}
