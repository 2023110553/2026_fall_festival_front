export function getPerformanceProgress(
    currentTime,
    startAt,
    endAt
) {
    if (
        !(currentTime instanceof Date) ||
        Number.isNaN(currentTime.getTime())
    ) {
        throw new Error(
            '유효한 currentTime이 필요합니다.'
        )
    }

    if (
        typeof startAt !== 'string' ||
        typeof endAt !== 'string' ||
        !startAt.trim() ||
        !endAt.trim()
    ) {
        throw new Error(
            'startAt과 endAt은 비어 있지 않은 날짜 문자열이어야 합니다.'
        )
    }

    const start = new Date(startAt)
    const end = new Date(endAt)

    if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime())
    ) {
        throw new Error(
            '유효한 공연 시간이 필요합니다.'
        )
    }

    if (start >= end) {
        throw new Error(
            'endAt은 startAt보다 이후여야 합니다.'
        )
    }

    if (currentTime <= start) {
        return 0
    }

    if (currentTime >= end) {
        return 1
    }

    return (
        currentTime.getTime() -
        start.getTime()
    ) / (
        end.getTime() -
        start.getTime()
    )
}
