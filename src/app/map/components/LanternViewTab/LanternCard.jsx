import styled from 'styled-components'
import { useTranslation } from '../../../../i18n/useTranslation'

export default function LanternCard({ lantern }) {
    const { t } = useTranslation()
    return (
        <Card>
            <ContentArea>
                <TextArea>
                    <NickName>{lantern.nickname}</NickName>
                    <Message>{lantern.message}</Message>
                    <Time>{lantern.time}</Time>
                </TextArea>
                <MoreButton type="button" aria-label={t('lantern.more')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 5C8.55228 5 9 4.55228 9 4C9 3.44772 8.55228 3 8 3C7.44772 3 7 3.44772 7 4C7 4.55228 7.44772 5 8 5Z" fill="#737373"/>
                        <path d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z" fill="#737373"/>
                        <path d="M8 13C8.55228 13 9 12.5523 9 12C9 11.4477 8.55228 11 8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13Z" fill="#737373"/>
                    </svg>
                </MoreButton>
            </ContentArea>
        </Card>
    )
}

const Card = styled.div`
    display: flex;
    width: 316.46px;
    padding: 12px 18px 8px 20px;
    align-items: center;
    gap: 19.193px;
    border-radius: 9.14px;
    background: var(--aurora_white, #FDFDFD);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.10);
`;

const ContentArea = styled.div`
    display: flex;
    width: 100%;
    align-items: flex-start;
    gap: 10px;
`;

const TextArea = styled.div`
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: column;
    align-items: flex-start;
    overflow-wrap: anywhere;
`

const NickName = styled.p`
    margin: 0 0 4px 0;
    color: #100B0B;
    font-family: var(--font-pretendard);
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

const Message = styled.p`
    margin: 0 0 8px 0;
    color: #100B0B;
    font-family: var(--font-pretendard);
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const Time = styled.p`
    margin: 0;
    color: #9F9C99;
    font-family: var(--font-pretendard);
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const MoreButton = styled.button`
    display: flex;
    flex-shrink: 0;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
`;


