import styled from 'styled-components'
import { useTranslation } from '../../../../i18n/useTranslation'

export default function ReportModal() {
    const { t } = useTranslation()
    return (
        <Modal>
            <Content>
                <Header>
                    <Title></Title>
                    <Description></Description>
                </Header>
                <ReasonList>
                    <ReasonItem>
                        <input type="radio" name="reportReason" />
                        <span>{t('report.abuse')}</span>
                    </ReasonItem>
                    <ReasonItem>
                        <input type="radio" name="reportReason" />
                        <span>{t('report.obscene')}</span>
                    </ReasonItem>
                    <ReasonItem>
                        <input type="radio" name="reportReason" />
                        <span>{t('report.falseInfo')}</span>
                    </ReasonItem>
                    <ReasonItem>
                        <input type="radio" name="reportReason" />
                        <span>{t('report.other')}</span>
                    </ReasonItem>
                </ReasonList>
            </Content>
            <ButtonGroup>
                <CancelButton type="button">{t('common.cancel')}</CancelButton>
                <ReportButton type="button">{t('lantern.report')}</ReportButton>
            </ButtonGroup>
        </Modal>
    )
}
