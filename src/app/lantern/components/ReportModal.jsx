import { useRef, useState } from 'react'
import Modal from '../../../components/common/Modal'
import * as S from './ReportModal.styles'

const REPORT_REASONS = [
    { value: 'ABUSE', label: '욕설 및 비방' },
    { value: 'OBSCENE', label: '음란하거나 불쾌한 내용' },
    { value: 'FALSE_INFO', label: '허위 정보' },
    { value: 'ETC', label: '기타' },
]

    export default function ReportModal({ isOpen, onClose, onSubmit }) {
    const [selectedReason, setSelectedReason] = useState('')
    const [pending, setPending] = useState(false)
    const [error, setError] = useState('')
    const busy = useRef(false)

    const handleReasonChange = (reason) => {
        setSelectedReason(reason)
    }

    // 호출부는 API 실패 시 reject하고, 중복 신고 코드는 호출부에서 별도로 처리한다.
    const handleSubmit = async () => {
        if (!selectedReason || !onSubmit || busy.current) return
        busy.current = true
        setPending(true)
        setError('')
        try {
            await onSubmit(selectedReason)
            setSelectedReason('')
            onClose()
        } catch {
            setError('신고하지 못했어요. 잠시 후 다시 시도해주세요.')
        } finally {
            busy.current = false
            setPending(false)
        }
    }

    const handleClose = () => {
        if (busy.current) return
        setSelectedReason('')
        setError('')
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
        <S.Container>
            <S.Header>
            <S.Title>신고하기</S.Title>
            <S.SubTitle>신고 사유를 선택해주세요</S.SubTitle>
            </S.Header>

            <S.OptionList>
            {REPORT_REASONS.map((reason) => (
                <S.OptionItem key={reason.value}>
                <S.RadioInput
                    type="radio"
                    disabled={pending}
                    name="reportReason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={() => handleReasonChange(reason.value)}
                />
                {reason.label}
                </S.OptionItem>
            ))}
            </S.OptionList>

            {error && <p role="alert">{error}</p>}
            <S.ButtonGroup>
            <S.CancelButton disabled={pending} type="button" onClick={handleClose}>
                취소
            </S.CancelButton>
            <S.SubmitButton
                type="button"
                disabled={!selectedReason || pending || !onSubmit}
                $disabled={!selectedReason || pending || !onSubmit}
                onClick={handleSubmit}
            >
                {pending ? '신고 중...' : '신고하기'}
            </S.SubmitButton>
            </S.ButtonGroup>
        </S.Container>
        </Modal>
    )
}