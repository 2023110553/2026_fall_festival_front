import styled from 'styled-components'

export {
  Page,
  Container,
  Header,
  BackButton,
  HeaderTitle,
  TitleRow,
  TitleInput,
  ImageButton,
  HiddenFileInput,
  Toast,
  BottomBar,
  PrimaryButton,
} from '../NoticeManage/NoticeEditor.styles'

import { TypeSelectWrap, TypeSelect } from '../NoticeManage/NoticeEditor.styles'

export const DateSelectWrap = styled(TypeSelectWrap)`
  svg {
    right: 8px;
  }
`

export const DateSelect = styled(TypeSelect)`
  padding: 5px 22px 5px 9px;
  font-size: 12px;
`

export const ImageArea = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 16px;
  overflow: hidden;
  border-radius: 4px;
  background: #000;
  aspect-ratio: 1 / 1;
`

export const Image = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const KeywordSection = styled.div`
  padding: 16px 16px 0;
`

export const KeywordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 12px;
  padding-top: 6px;
`

export const Keyword = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 6px;
  background: #FDFDFD;
  color: #000;
  font-size: 12px;
`

export const KeywordRemoveButton = styled.button`
  position: absolute;
  top: -7px;
  right: -7px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`

export const KeywordInput = styled.input`
  width: 108px;
  height: 26px;
  padding: 0 10px;
  border: none;
  border-radius: 6px;
  outline: none;
  background: #FDFDFD;
  color: #000;
  font-family: inherit;
  font-size: 12px;

  &::placeholder {
    color: #A0A0A0;
  }
`

export const AddKeywordButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 108px;
  height: 26px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: #FDFDFD;
  cursor: pointer;
`

export const Hint = styled.p`
  margin: 12px 0 0;
  color: #000;
  font-size: 10px;
`
