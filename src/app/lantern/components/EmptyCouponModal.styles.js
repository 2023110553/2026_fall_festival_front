import styled from 'styled-components'
import { panelStyle as basePanelStyle, Description as BaseDescription, FullWidthButton } from './CouponModal.styles'

export { Title } from './CouponModal.styles'
export const panelStyle = { ...basePanelStyle, borderRadius: '12px' }
export const Description = styled(BaseDescription)`margin-bottom: 16px;`
export const CloseButton = styled(FullWidthButton)`
  background-color: #d9d9d9;
  color: #737373;
`
