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
              {lantern.top_report_reason && <S.ReportBadge>{lantern.top_report_reason}</S.ReportBadge>}
            </S.TitleRow>
            <S.ReportCount>
              {lantern.report_count}
              <S.SirenIcon src={sirenIcon} alt="신고" />
            </S.ReportCount>
          </S.TopRow>
          <S.BoothName>{lantern.booth_name}</S.BoothName>
          <S.MessageBox>{lantern.content}</S.MessageBox>
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
