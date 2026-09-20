export function formatTime(isoString) {
    const date = new Date(isoString)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
}

export function getProgress(serverTime, startAt, endAt) {
    const now = new Date(serverTime).getTime()
    const start = new Date(startAt).getTime()
    const end = new Date(endAt).getTime()
    if (now <= start) return 0
    if (now >= end) return 1
    return (now - start) / (end - start)
}

export function isLive(serverTime, startAt, endAt) {
    const now = new Date(serverTime).getTime()
    return new Date(startAt).getTime() <= now && now < new Date(endAt).getTime()
}