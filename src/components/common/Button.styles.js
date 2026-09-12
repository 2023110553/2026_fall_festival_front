import styled, { css } from 'styled-components'

export const Base = styled.button`
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  padding: 12px 20px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 15px;
  font-weight: 600;
  transition: opacity 0.15s ease;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  ${({ $variant, theme }) =>
    $variant === 'secondary'
      ? css`
          background: ${theme.color.surface};
          color: ${theme.color.text};
        `
      : css`
          background: ${theme.color.primary};
          color: #fff;
        `}
`
