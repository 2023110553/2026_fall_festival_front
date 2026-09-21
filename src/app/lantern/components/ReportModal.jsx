import { useRef, useState } from 'react'
import Modal from '../../../components/common/Modal'
import { useTranslation } from '../../../i18n/useTranslation'
import * as S from './ReportModal.styles'

const REPORT_REASONS = [
    { value: 'ABUSE', labelKey: 'report.abuse' },
    { value: 'OBSCENE', labelKey: 'report.obscene' },
    { value: 'FALSE_INFO', labelKey: 'report.falseInfo' },
    { value: 'ETC', labelKey: 'report.other' },
]

    export default function ReportModal({ isOpen, onClose, onSubmit }) {
    const { t } = useTranslation()
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
            setError(t('report.error'))
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
            <S.Title>{t('report.title')}</S.Title>
            <S.SubTitle>{t('report.description')}</S.SubTitle>
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
                {t(reason.labelKey)}
                </S.OptionItem>
            ))}
            </S.OptionList>

            {error && <p role="alert">{error}</p>}
            <S.ButtonGroup>
            <S.CancelButton disabled={pending} type="button" onClick={handleClose}>
                {t('common.cancel')}
            </S.CancelButton>
            <S.SubmitButton
                type="button"
                disabled={!selectedReason || pending || !onSubmit}
                $disabled={!selectedReason || pending || !onSubmit}
                onClick={handleSubmit}
            >
                {pending ? t('report.pending') : t('report.title')}
            </S.SubmitButton>
            </S.ButtonGroup>
        </S.Container>
        </Modal>
    )
}