import styled, { css, keyframes } from 'styled-components'

const travel = keyframes`
  0%, 6% { transform: translateX(0); }
  47%, 53% { transform: translateX(calc(var(--overflow-distance) * -1px)); }
  94%, 100% { transform: translateX(0); }
`

export const Viewport = styled.span`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
`

export const Text = styled.strong`
  display: block;
  width: max-content;
  min-width: 100%;
  margin: 0;
  font-size: ${({ $variant }) => ($variant === 'detail' ? '14px' : '13px')};
  font-weight: 700;
  line-height: 20px;
  --overflow-distance: ${({ $distance }) => $distance};

  ${({ $distance }) =>
    $distance > 0 &&
    css`
      animation: ${travel} ${Math.max(4.5, Math.min(8, 4.5 + $distance / 45))}s ease-in-out infinite;
    `}

  @media (prefers-reduced-motion: reduce) {
    max-width: 100%;
    overflow: hidden;
    animation: none;
    text-overflow: ellipsis;
  }
`
