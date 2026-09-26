import { useState, useRef, useEffect } from 'react'
import * as S from './LanternCard.styles'
import { formatLanternDateTime } from '../utils/formatLanternDateTime'
import { useTranslation } from '../../../i18n/useTranslation'
import editIcon from '../../../assets/lantern/edit.svg'
import deleteIcon from '../../../assets/lantern/delete.svg'

export default function LanternCard({
    lantern,
    isMine = false,
    onEdit,
    onDelete,
    onReport,
    }) {
    const { t } = useTranslation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef(null)
    const hasMenuActions = isMine ? Boolean(onEdit || onDelete) : Boolean(onReport)

    useEffect(() => {
        const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setIsMenuOpen(false)
        }
        }
        if (isMenuOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMenuOpen])

    const toggleMenu = (e) => {
        e.stopPropagation()
        setIsMenuOpen((prev) => !prev)
    }

    return (
        <S.CardContainer>
         <S.Header>
          <S.TitleGroup>
            <S.Nickname>
              {lantern.nickname || t('lantern.anonymous')}
            </S.Nickname>

            {lantern.boothName && (
              <S.BoothName>{lantern.boothName}</S.BoothName>
            )}
          </S.TitleGroup>

          {hasMenuActions && (
            <S.MoreButton
              type="button"
              onClick={toggleMenu}
              aria-label={t('lantern.more')}
            >
              ⋮
            </S.MoreButton>
          )}
        </S.Header>

        <S.Content>{lantern.message || lantern.content}</S.Content>

        {/* 수정된 적 있으면 수정 시각, 없으면 작성 시각 */}
        <S.Time>{formatLanternDateTime(lantern.updatedAt ?? lantern.createdAt)}</S.Time>

        {hasMenuActions && isMenuOpen && (
            <S.DropdownMenu ref={menuRef}>
            {isMine ? (
                <>
                {onEdit && (
                    <S.DropdownItem
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsMenuOpen(false)
                        onEdit(lantern.id)
                    }}
                    >
                    <img src={editIcon} alt="" />
                    {t('lantern.edit')}
                    </S.DropdownItem>
                )}
                {onDelete && (
                    <S.DropdownItem
                    $isDanger
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsMenuOpen(false)
                        onDelete(lantern.id)
                    }}
                    >
                    <img src={deleteIcon} alt="" />
                    {t('lantern.delete')}
                    </S.DropdownItem>
                )}
                </>
            ) : (
                <>
                {onReport && (
                    <S.DropdownItem
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsMenuOpen(false)
                        onReport(lantern.id)
                    }}
                    >
                    {t('lantern.report')}
                    </S.DropdownItem>
                )}
                </>
            )}
            </S.DropdownMenu>
        )}
        </S.CardContainer>
    )
}
