import styled from 'styled-components'

export const Page = styled.main`
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 24px;
  text-align: center;
  background: ${({ theme }) => theme.color.bg};
`

export const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.text};
`

export const Description = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.color.textSub};
`

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`

export const PrimaryButton = styled.button`
  padding: 10px 20px;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.primary};
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`

export const GhostButton = styled.button`
  padding: 10px 20px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.bg};
  color: ${({ theme }) => theme.color.text};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`
