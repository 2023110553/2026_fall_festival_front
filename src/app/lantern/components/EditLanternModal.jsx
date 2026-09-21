import { useState, useEffect, useRef } from 'react'
import * as S from './EditLanternModal.styles'
import { formatLanternTime } from '../utils/formatLanternDateTime'
import AlertModal from '../../../components/common/AlertModal'

export default function EditLanternModal({ isOpen, onClose, lantern, onSubmit }) {
    const [nickname, setNickname] = useState('')
    const [message, setMessage] = useState('')
    const [messageError, setMessageError] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false)
    // 버튼은 항상 눌리게 두되, 응답 오기 전 연타로 같은 요청이 중복 전송되는 것만 막는다
    const isSubmittingRef = useRef(false)

    useEffect(() => {
        if (lantern) {
        // '익명의 코끼리'는 미입력 시 표시 전용 기본값이라, 수정할 땐 빈 입력으로 되돌려둔다
        setNickname(lantern.nickname === '익명의 코끼리' ? '' : lantern.nickname || '')
        setMessage(lantern.message || lantern.content || '')
        setMessageError(false)
        setSubmitError('')
        }
    }, [lantern])

    if (!isOpen) return null

    const requestClose = () => setIsLeaveConfirmOpen(true)
    const confirmLeave = () => {
        setIsLeaveConfirmOpen(false)
        onClose()
    }

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
        if (value.trim().length > 0) setMessageError(false)
        }
    }

    // 완료 버튼 클릭 시 변경 사항 전달 후 닫기 — 실패하면 닫지 않고 빨간 안내 문구로 보여준다
    const handleSubmit = async () => {
        const isMessageEmpty = !message.trim()
        if (isMessageEmpty) {
        setMessageError(true)
        return
        }
        if (!onSubmit || !lantern) return
        if (isSubmittingRef.current) return
        isSubmittingRef.current = true

        setSubmitError('')
        try {
        // 닉네임은 빈 값 그대로 저장 — '익명의 코끼리'는 표시 전용 fallback
        await onSubmit(lantern.id, {
            nickname: nickname.trim(),
            message: message.trim(),
        })
        onClose()
        } catch (err) {
        setSubmitError(err?.response?.data?.message || '등불 수정에 실패했어요. 다시 시도해주세요.')
        } finally {
        isSubmittingRef.current = false
        }
    }

    return (
        <>
        <S.Overlay onClick={requestClose}>
            <S.Container onClick={(e) => e.stopPropagation()}>
                {lantern?.boothName && <S.BoothLabel>{lantern.boothName}</S.BoothLabel>}

                <S.InputGroup>
                    <S.NicknameBox>
                        <S.NicknameInput
                            value={nickname}
                            onChange={handleNicknameChange}
                            placeholder="닉네임을 입력해주세요."
                            maxLength={5}
                        />
                        <S.CharCount>{nickname.length}/5</S.CharCount>
                    </S.NicknameBox>

                    <S.MessageBox>
                        <S.MessageTextArea
                            value={message}
                            onChange={handleMessageChange}
                            placeholder="응원의 한마디를 남겨주세요."
                            maxLength={30}
                        />
                        <S.CharCount>{message.length}/30</S.CharCount>
                    </S.MessageBox>
                    {messageError && <S.ErrorText>응원의 한마디를 입력해주세요.</S.ErrorText>}
                </S.InputGroup>

                {submitError && <S.ErrorText>{submitError}</S.ErrorText>}

                <S.Footer>
                    <S.Time>{formatLanternTime(lantern?.createdAt)}</S.Time>
                    <S.ButtonGroup>
                        <S.CancelButton type="button" onClick={requestClose}>
                        취소
                        </S.CancelButton>
                        <S.SubmitButton type="button" onClick={handleSubmit}>
                        완료
                        </S.SubmitButton>
                    </S.ButtonGroup>
                </S.Footer>
            </S.Container>
        </S.Overlay>

        <AlertModal
            isOpen={isLeaveConfirmOpen}
            onClose={() => setIsLeaveConfirmOpen(false)}
            title="작성을 그만둘까요?"
            subTitle="지금 나가면 작성한 내용이 저장되지 않아요."
            buttonText="취소"
            onConfirm={confirmLeave}
            confirmText="나가기"
        />
        </>
    )
}
