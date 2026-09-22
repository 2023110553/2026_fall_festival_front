import { useEffect, useState } from 'react'

import Modal from '../../../../components/common/Modal'
import * as S from './LanternDetailModal.styles'
import { getAdminLanternDetail } from '../../../../api/admin'
import sirenIcon from '../../../../assets/admin/siren.svg'

export default function LanternDetailModal({ lantern, onClose, onDelete }) {
  // GET /api/lanterns/{lantern_id}/ — 열리는 즉시 목록 데이터로 그리고, 상세가 오면 덮어쓴다
  const [detail, setDetail] = useState(null)
  const [error, setError] = useState('')

  const lanternId = lantern?.id

  useEffect(() => {
    if (lanternId == null) return
    let ignore = false
    setDetail(null)
    setError('')

    getAdminLanternDetail(lanternId)
      .then((res) => {
        if (!ignore) setDetail(res.data?.data ?? null)
      })
      .catch((err) => {
        if (ignore) return
        setError(
          err.response?.status === 404
            ? '존재하지 않거나 이미 삭제된 등불입니다.'
            : '신고 상세 정보를 불러오지 못했습니다.',
        )
      })

    return () => {
      ignore = true
    }
  }, [lanternId])

  const view = lantern && { ...lantern, ...detail }
  const isNotFound = error && !detail

  return (
    <Modal isOpen={!!lantern} onClose={onClose} style={S.panelStyle}>
      {view && (
        <>
          <S.TopRow>
            <S.TitleRow>
              <S.Nickname>{view.nickname}</S.Nickname>
              {view.top_report_reason && <S.ReportBadge>{view.top_report_reason}</S.ReportBadge>}
            </S.TitleRow>
            <S.ReportCount>
              {view.report_count}
              <S.SirenIcon src={sirenIcon} alt="신고" />
            </S.ReportCount>
          </S.TopRow>
          {/* 상세 응답이 오면 부스명 옆에 소속 학과(booth_department)를 붙인다 */}
          <S.BoothName>
            {view.booth_name}
            {view.booth_department && ` · ${view.booth_department}`}
          </S.BoothName>
          <S.MessageBox>{view.message}</S.MessageBox>
          {error && <S.ErrorMessage role="alert">{error}</S.ErrorMessage>}
          <S.ButtonRow>
            <S.CloseButton type="button" onClick={onClose}>
              닫기
            </S.CloseButton>
            <S.DeleteButton type="button" onClick={() => onDelete(lantern)} disabled={!!isNotFound}>
              삭제하기
            </S.DeleteButton>
          </S.ButtonRow>
        </>
      )}
    </Modal>
  )
}
