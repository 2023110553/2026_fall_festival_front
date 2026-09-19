import { useState, useEffect } from 'react'
import * as S from './EditLanternModal.styles'
import { formatLanternDateTime } from '../utils/formatLanternDateTime'

export default function EditLanternModal({ isOpen, onClose, lantern, onSubmit }) {
    const [nickname, setNickname] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (lantern) {
        setNickname(lantern.nickname || '')
        setMessage(lantern.message || lantern.content || '')
        }
    }, [lantern])

    if (!isOpen) return null

    const handleNicknameChange = (e) => {
        const value = e.target.value
        if (value.length <= 5) {
        setNickname(value)
        }
    }

    const handleMessageChange = (e) => {
        const value = e.target.value
        if (value.length <= 30) {
        setMessage(value)
        }
    }

    // 완료 버튼 클릭 시 변경 사항 전달 후 닫기
    const handleSubmit = () => {
        if (!message.trim()) return
        if (onSubmit && lantern) {
        // 닉네임은 빈 값 그대로 저장 — '익명의 코끼리'는 표시 전용 fallback
        onSubmit(lantern.id, {
            nickname: nickname.trim(),
            message,
        })
        }
        onClose()
    }

    return (
        <S.Overlay onClick={onClose}>
        <S.Container onClick={(e) => e.stopPropagation()}>
            {lantern?.boothName && <S.BoothLabel>{lantern.boothName}</S.BoothLabel>}

            <S.InputBox>
            <S.NicknameInput
                value={nickname}
                onChange={handleNicknameChange}
                placeholder="닉네임을 입력해주세요"
                maxLength={5}
            />
            <S.CharCount>{nickname.length}/5</S.CharCount>
            </S.InputBox>

            <S.InputBox>
            <S.MessageTextArea
                value={message}
                onChange={handleMessageChange}
                placeholder="응원의 한마디를 남겨주세요"
                maxLength={30}
            />
            <S.CharCount>{message.length}/30</S.CharCount>
            </S.InputBox>

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
