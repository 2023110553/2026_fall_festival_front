import { useState, useRef, useEffect } from 'react'
import * as S from './LanternCard.styles'

// '오후 11:51' -> '23:51', '오전 09:05' -> '09:05' 24시간 형식 변환 함수
function formatTime24(timeStr) {
    if (!timeStr) return ''

    // 이미 24시간 형식("20:44")이거나 오전/오후가 없으면 그대로 반환
    if (!timeStr.includes('오전') && !timeStr.includes('오후')) {
        return timeStr
    }

    const isPM = timeStr.includes('오후')
    const cleanStr = timeStr.replace(/오전|오후/g, '').trim()
    const parts = cleanStr.split(':')

    if (parts.length < 2) return timeStr

    let hours = parseInt(parts[0], 10)
    const minutes = parts[1]

    if (isPM && hours < 12) {
        hours += 12
    } else if (!isPM && hours === 12) {
        hours = 0
    }

    const formattedHours = String(hours).padStart(2, '0')
    return `${formattedHours}:${minutes}`
    }

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

        {/* 24시간 형식으로 변환된 시간 표시 */}
        <S.Time>{formatTime24(lantern.createdAt)}</S.Time>

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