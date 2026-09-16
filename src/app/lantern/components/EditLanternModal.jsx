import { useState, useEffect } from 'react'
import * as S from './EditLanternModal.styles'

function formatTime24(timeStr) {
    if (!timeStr) return ''
    if (!timeStr.includes('오전') && !timeStr.includes('오후')) return timeStr

    const isPM = timeStr.includes('오후')
    const cleanStr = timeStr.replace(/오전|오후/g, '').trim()
    const parts = cleanStr.split(':')
    if (parts.length < 2) return timeStr

    let hours = parseInt(parts[0], 10)
    const minutes = parts[1]

    if (isPM && hours < 12) hours += 12
    else if (!isPM && hours === 12) hours = 0

    return `${String(hours).padStart(2, '0')}:${minutes}`
    }

    export default function EditLanternModal({ isOpen, onClose, lantern, onSubmit }) {
    const [content, setContent] = useState('')

    useEffect(() => {
        if (lantern) {
        setContent(lantern.message || lantern.content || '')
        }
    }, [lantern])

    if (!isOpen) return null

    const handleChange = (e) => {
        const value = e.target.value
        if (value.length <= 30) {
        setContent(value)
        }
    }

    // 완료 버튼 클릭 시 변경 사항 전달 후 닫기
    const handleSubmit = () => {
        if (!content.trim()) return
        if (onSubmit && lantern) {
        onSubmit(lantern.id, content)
        }
        onClose()
    }

    return (
        <S.Overlay onClick={onClose}>
        <S.Container onClick={(e) => e.stopPropagation()}>
            <S.Header>
            <S.Nickname>{lantern?.nickname || '익명의 코끼리'}</S.Nickname>
            <S.MoreButton type="button">⋮</S.MoreButton>
            </S.Header>

            <S.InputWrapper>
            <S.TextArea
                value={content}
                onChange={handleChange}
                placeholder="등불 내용을 입력해 주세요"
                maxLength={30}
            />
            <S.CharCount>{content.length}/30</S.CharCount>
            </S.InputWrapper>

            <S.Footer>
            <S.Time>{formatTime24(lantern?.createdAt)}</S.Time>
            <S.ButtonGroup>
                <S.CancelButton type="button" onClick={onClose}>
                취소
                </S.CancelButton>
                <S.SubmitButton type="button" onClick={handleSubmit}>
                완료
                </S.SubmitButton>
            </S.ButtonGroup>
            </S.Footer>
        </S.Container>
        </S.Overlay>
    )
}