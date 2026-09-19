import { useState, useEffect } from 'react'
import * as S from './EditLanternModal.styles'
import { formatLanternDateTime } from '../utils/formatLanternDateTime'

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
            <S.Time>{formatLanternDateTime(lantern?.createdAt)}</S.Time>
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