import Modal from '../../../../components/common/Modal'
import * as S from './LanternDetailModal.styles'
import sirenIcon from '../../../../assets/admin/siren.svg'

export default function LanternDetailModal({ lantern, onClose, onDelete }) {
  return (
    <Modal isOpen={!!lantern} onClose={onClose} style={S.panelStyle}>
      {lantern && (
        <>
          <S.TopRow>
            <S.TitleRow>
              <S.Nickname>{lantern.nickname}</S.Nickname>
              {lantern.reportReason && <S.ReportBadge>{lantern.reportReason}</S.ReportBadge>}
            </S.TitleRow>
            <S.ReportCount>
              {lantern.reportCount}
              <S.SirenIcon src={sirenIcon} alt="신고" />
            </S.ReportCount>
          </S.TopRow>
          <S.BoothName>{lantern.boothName}</S.BoothName>
          <S.MessageBox>{lantern.message}</S.MessageBox>
          <S.ButtonRow>
            <S.CloseButton type="button" onClick={onClose}>
              닫기
            </S.CloseButton>
            <S.DeleteButton type="button" onClick={() => onDelete(lantern)}>
              삭제하기
            </S.DeleteButton>
          </S.ButtonRow>
        </>
      )}
    </Modal>
  )
}
