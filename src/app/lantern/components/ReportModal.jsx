import { useState } from 'react'
import Modal from '../../components/common/Modal'
import * as S from './ReportModal.styles'

const REPORT_REASONS = [
    '욕설 및 비방',
    '음란하거나 불쾌한 내용',
    '허위 정보',
    '기타',
    ]

    export default function ReportModal({ isOpen, onClose, onSubmit }) {
    const [selectedReason, setSelectedReason] = useState('')

    const handleReasonChange = (reason) => {
        setSelectedReason(reason)
    }

    const handleSubmit = () => {
        if (!selectedReason) return

        // TODO: 신고 API 연동
        if (onSubmit) {
        onSubmit(selectedReason)
        }
        
        // 초기화 및 모달 닫기
        setSelectedReason('')
        onClose()
    }

    const handleClose = () => {
        setSelectedReason('')
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
                <S.OptionItem key={reason}>
                <S.RadioInput
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => handleReasonChange(reason)}
                />
                {reason}
                </S.OptionItem>
            ))}
            </S.OptionList>

            <S.ButtonGroup>
            <S.CancelButton type="button" onClick={handleClose}>
                취소
            </S.CancelButton>
            <S.SubmitButton
                type="button"
                $disabled={!selectedReason}
                onClick={handleSubmit}
            >
                신고하기
            </S.SubmitButton>
            </S.ButtonGroup>
        </S.Container>
        </Modal>
    )
}