import styled from 'styled-components'

export const Card = styled.article`
  position: relative;
  width: 210px;
  height: 280px;
  overflow: hidden;
  border-radius: 14px;
  background: var(--s_2, linear-gradient(337deg, #ACEEC8 14.51%, #EEC8B9 58.87%));
  color: #100b0b;
  box-shadow: ${({ $active }) =>
    $active
      ? '0 3px 6px rgba(255,161,161,.25), 0 -4px 6px rgba(194,255,175,.25), 0 0 6px rgba(243,246,188,.75)'
      : '0 2px 5px rgba(0,0,0,.1)'};
  transition: box-shadow .28s ease;
`

export const Track = styled.p`
  position: absolute;
  top: 16.8px;
  left: 16.8px;
  z-index: 2;
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
`

export const Glow = styled.div`
  position: absolute;
  top: 47.6px;
  left: 21px;
  width: 168px;
  height: 151.2px;
  border-radius: 138.6px;
  background: radial-gradient(50% 50% at 50% 50%, #e8f057 0%, rgba(255, 255, 255, 0) 100%);
`

export const ProfileSlot = styled.div`
  position: absolute;
  top: 65px;
  left: 39px;
  z-index: 1;
  width: 130px;
  height: 130px;
  overflow: hidden;
`

export const Profile = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
`

export const Info = styled.div`
  position: absolute;
  top: 212.8px;
  left: 16.8px;
  z-index: 2;
  display: flex;
  width: 86.8px;
  flex-direction: column;
  align-items: flex-start;
  color: #100b0b;
  text-align: left;
`

export const Department = styled.p`margin: 0; font-size: 10px; font-weight: 500; line-height: 1.2;`
export const Name = styled.h3`margin: 0; font-size: 28px; font-weight: 600; line-height: normal; white-space: nowrap;`
export const Dim = styled.div`position: absolute; inset: 0; z-index: 3; background: rgba(0,0,0,.4);`
