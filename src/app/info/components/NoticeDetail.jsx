import Tag from '../../../components/common/Tag'
import InfoDetailHeader from './InfoDetailHeader'
import OverflowMarquee from './OverflowMarquee'
import * as S from './NoticeDetail.styles'

export default function NoticeDetail({ notice, onBack }) {
  if (!notice) return null

  return (
    <S.Page>
      <InfoDetailHeader title="공지" onBack={onBack} />

      <S.Article>
        <S.TitleRow>
          <Tag tone={notice.isUrgent ? 'danger' : 'default'}>
            {notice.isUrgent ? '긴급 공지' : '일반 공지'}
          </Tag>
          <OverflowMarquee as="h3" variant="detail">
            {notice.title}
          </OverflowMarquee>
        </S.TitleRow>

        {notice.imageUrl && <S.Image src={notice.imageUrl} alt="" />}
        <S.Content>
          <time>{notice.date}</time> {notice.content}
        </S.Content>
      </S.Article>
    </S.Page>
  )
}
