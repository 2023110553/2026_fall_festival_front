import { useState, useRef, useEffect } from 'react'
import * as S from './LanternCard.styles'
import { formatLanternDateTime } from '../utils/formatLanternDateTime'

export default function LanternCard({
    lantern,
    isMine = false,
    onEdit,
    onDelete,
    onReport,
    }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef(null)

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
            <S.Nickname>{lantern.nickname || '익명의 코끼리'}</S.Nickname>
            <S.MoreButton type="button" onClick={toggleMenu}>
            ⋮
            </S.MoreButton>
        </S.Header>

        <S.Content>{lantern.message || lantern.content}</S.Content>

        {/* 수정된 적 있으면 수정 시각, 없으면 작성 시각 */}
        <S.Time>{formatLanternDateTime(lantern.updatedAt ?? lantern.createdAt)}</S.Time>

        {isMenuOpen && (
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
                    수정하기
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
                    삭제하기
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
                    신고하기
                    </S.DropdownItem>
                )}
                </>
            )}
            </S.DropdownMenu>
        )}
        </S.CardContainer>
    )
}