import styled from 'styled-components'
export const Stack=styled.div`display:flex;flex-direction:column;gap:16px;`
export const Heading=styled.header`h2{margin:0;color:#fff;font-size:22px}p{margin:7px 0 0;color:#8f8f8f;font-size:13px}`
export const List=styled.div`display:flex;flex-direction:column;gap:10px;`
export const Card=styled.button`position:relative;width:100%;min-height:88px;display:flex;flex-direction:column;align-items:flex-start;gap:12px;padding:12px 40px 12px 12px;border:1px solid rgba(255,255,255,.1);border-radius:16px;background:#171717;color:#fff;text-align:left;>strong{font-size:15px}`
export const Meta=styled.span`display:flex;align-items:center;gap:8px;time{color:#777;font-size:12px}`
export const Chevron=styled.span`position:absolute;top:50%;right:14px;color:#777;font-size:24px;transform:translateY(-50%);`
