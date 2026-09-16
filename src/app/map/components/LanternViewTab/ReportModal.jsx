import styled from 'styled-components'

export default function ReportModal() {
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
                        <span>욕설 및 비방</span>
                    </ReasonItem>
                    <ReasonItem>
                        <input type="radio" name="reportReason" />
                        <span>음란하거나 불쾌한 내용</span>
                    </ReasonItem>
                    <ReasonItem>
                        <input type="radio" name="reportReason" />
                        <span>허위 정보</span>
                    </ReasonItem>
                    <ReasonItem>
                        <input type="radio" name="reportReason" />
                        <span>기타</span>
                    </ReasonItem>
                </ReasonList>
            </Content>
            <ButtonGroup>
                <CancelButton type="button">취소</CancelButton>
                <ReportButton type="button">신고하기</ReportButton>
            </ButtonGroup>
        </Modal>
    )
}