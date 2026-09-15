import styled from 'styled-components'
export const Stack=styled.div`display:flex;flex-direction:column;gap:16px;`
export const Heading=styled.header`h2{margin:0;color:#fff;font-size:22px}p{margin:7px 0 0;color:#8f8f8f;font-size:13px}`
export const DateTabs=styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:8px;`
export const DateButton=styled.button`height:38px;border:1px solid ${({$active})=>$active?'#fff':'#333'};border-radius:999px;background:${({$active})=>$active?'#fff':'#171717'};color:${({$active})=>$active?'#111':'#999'};font-size:13px;font-weight:600;`
export const Search=styled.input`width:100%;height:46px;padding:0 16px;border:1px solid #333;border-radius:12px;outline:none;background:#171717;color:#fff;font:inherit;&::placeholder{color:#777}&:focus{border-color:#777}`
export const List=styled.div`display:flex;flex-direction:column;gap:10px;`
export const Card=styled.button`width:100%;min-height:82px;display:flex;align-items:center;gap:12px;padding:12px;border:1px solid rgba(255,255,255,.1);border-radius:16px;background:#171717;color:#fff;text-align:left;`
export const Thumbnail=styled.span`width:56px;height:56px;flex:0 0 56px;border-radius:12px;background:linear-gradient(135deg,#333,#202020);`
export const Body=styled.span`min-width:0;flex:1;display:flex;flex-direction:column;gap:6px;strong{font-size:15px}span{color:#929292;font-size:12px}`
export const Chevron=styled.span`color:#777;font-size:24px;`
