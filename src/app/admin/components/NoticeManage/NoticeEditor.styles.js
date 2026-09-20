import styled from 'styled-components'

export {
  Page,
  Container,
  Header,
  BackButton,
  HeaderTitle,
  TitleRow,
  ContentCard,
  BottomBar,
  PrimaryButton,
} from './AdminNoticeDetailPage.styles'

const AutoGrowTextarea = styled.textarea`
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  outline: none;
  resize: none;
  overflow: hidden;
  background: transparent;
  color: #000;
  font-family: inherit;
  word-break: keep-all;

  &::placeholder {
    color: #A0A0A0;
  }
`

export const TitleInput = styled(AutoGrowTextarea)`
  flex: 1;
  min-width: 0;
  padding-top: 1px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.35;
`

export const ContentInput = styled(AutoGrowTextarea)`
  margin-top: 16px;
  font-size: 14px;
  line-height: 1.6;
`

export const ImageArea = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  background: #000;
  aspect-ratio: ${({ $empty }) => ($empty ? '16 / 10' : 'auto')};
`

export const Image = styled.img`
  display: block;
  width: 100%;
  object-fit: cover;
`

export const ImageButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 124px;
  height: 44px;
  border: none;
  border-radius: 12px;
  background: #FFF;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`

export const HiddenFileInput = styled.input`
  display: none;
`

export const Toast = styled.div`
  position: fixed;
  left: 50%;
  bottom: 90px;
  transform: translateX(-50%);
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 8px;
  width: min(343px, calc(100% - 32px));
  padding: 10px 12px;
  border: 1px solid #E3A5A5;
  border-radius: 10px;
  background: #FFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  color: #000;
  font-size: 10px;
  font-family: var(--font-pretendard);

  svg {
    flex-shrink: 0;
  }
`

export const TypeSelectWrap = styled.label`
  position: relative;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;

  svg {
    position: absolute;
    right: 6px;
    pointer-events: none;
  }
`

export const TypeSelect = styled.select`
  appearance: none;
  height: 30px;
  padding: 0 18px 0 7px;
  border: none;
  border-radius: 5px;
  background: ${({ $urgent }) => ($urgent ? '#AD0000' : '#6E6E6E')};
  color: #FFF;
  font-family: inherit;
  font-size: 10px;
  cursor: pointer;

  option {
    color: #000;
    background: #FFF;
  }
`

export const TypeTag = styled.span`
  flex-shrink: 0;
  height: 30px;
  padding: 4px 2px 4px 6px;
  border-radius: 4px;
  background: ${({ $urgent }) => ($urgent ? '#DC7054' : '#6E6E6E')};
  color: #FFF;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  font-family: var(--font-pretendard);
`