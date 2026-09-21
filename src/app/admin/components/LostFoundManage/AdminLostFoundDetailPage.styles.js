import styled from 'styled-components'

import { TypeTag } from '../NoticeManage/AdminNoticeDetailPage.styles'

export {
  Page,
  Container,
  Header,
  BackButton,
  HeaderTitle,
  TitleRow,
  Title,
  BottomBar,
  PrimaryButton,
  DangerButton,
} from '../NoticeManage/AdminNoticeDetailPage.styles'

export const DateTag = styled(TypeTag)`
  padding: 5px 9px;
  font-size: 12px;
`

// images는 배열이라 sort_order 순으로 여러 장이 올 수 있다 (1장이면 기존 화면과 동일)
export const ImageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

// 로딩 / 404 등 안내 문구
export const StatusMessage = styled.p`
  margin: 0;
  padding: 24px 16px;
  color: #8A8A8A;
  text-align: center;
  font-size: 13px;
  font-family: var(--font-pretendard);
`

export {
  ImageArea,
  Image,
  KeywordSection,
  KeywordList,
  Keyword,
} from './LostFoundEditor.styles'
