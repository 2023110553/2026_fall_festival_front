export function getPerformanceProgress(
    date,
    startTime,
    endTime,
    now
) {
    const start = new Date(
        `${date}T${startTime}:00`
    )

    const end = new Date(
        `${date}T${endTime}:00`
    )

    if (now <= start) {
        return 0
    }

    if (now >= end) {
        return 1
    }

    return (
        (now.getTime() - start.getTime()) /
        (end.getTime() - start.getTime())
    )
}