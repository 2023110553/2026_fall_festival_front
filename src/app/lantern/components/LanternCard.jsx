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
    mapAppearance = false,
    }) {
    const { t } = useTranslation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef(null)
    const menuButtonRef = useRef(null)
    const hasMenuActions = isMine ? Boolean(onEdit || onDelete) : Boolean(onReport)
    const nickname = lantern.nickname?.trim()
    const anonymousNickname = t('lantern.anonymous')
    const displayNickname = nickname || anonymousNickname
    const hasCustomNickname = Boolean(nickname)
      && nickname !== anonymousNickname
      && nickname !== '익명의 코끼리'

    useEffect(() => {
        const handleClickOutside = (e) => {
        if (menuRef.current
          && !menuRef.current.contains(e.target)
          && !menuButtonRef.current?.contains(e.target)) {
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
        <S.CardContainer $mapAppearance={mapAppearance}>
         <S.Header $mapAppearance={mapAppearance}>
          <S.TitleGroup $mapAppearance={mapAppearance}>
            <S.Nickname $mapAppearance={mapAppearance} $hasCustomNickname={hasCustomNickname}>
              {displayNickname}
            </S.Nickname>

            {lantern.boothName && (
              <S.BoothName>{lantern.boothName}</S.BoothName>
            )}
          </S.TitleGroup>

          {hasMenuActions && (
            <S.MoreButton
              ref={menuButtonRef}
              type="button"
              $mapAppearance={mapAppearance}
              onClick={toggleMenu}
              aria-label={t('lantern.more')}
              aria-expanded={isMenuOpen}
            >
              {mapAppearance ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 5C8.55228 5 9 4.55228 9 4C9 3.44772 8.55228 3 8 3C7.44772 3 7 3.44772 7 4C7 4.55228 7.44772 5 8 5Z" fill="#737373" />
                  <path d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z" fill="#737373" />
                  <path d="M8 13C8.55228 13 9 12.5523 9 12C9 11.4477 8.55228 11 8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13Z" fill="#737373" />
                </svg>
              ) : '⋮'}
            </S.MoreButton>
          )}
        </S.Header>

        <S.Content $mapAppearance={mapAppearance}>{lantern.message || lantern.content}</S.Content>

        {/* 수정된 적 있으면 수정 시각, 없으면 작성 시각 */}
        <S.Time $mapAppearance={mapAppearance}>{formatLanternDateTime(lantern.updatedAt ?? lantern.createdAt)}</S.Time>

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
