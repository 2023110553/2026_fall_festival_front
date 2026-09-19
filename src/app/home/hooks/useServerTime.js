import { useEffect, useState } from 'react'

function parseServerTime(serverTime) {
    if (
        typeof serverTime !== 'string' ||
        !serverTime.trim()
    ) {
        return null
    }

    const timestamp = new Date(serverTime).getTime()

    return Number.isFinite(timestamp)
        ? timestamp
        : null
}

export default function useServerTime(serverTime) {
    const [now, setNow] = useState(() => {
        const timestamp = parseServerTime(serverTime)
        return timestamp === null ? null : new Date(timestamp)
    })

    useEffect(() => {
        const baseServerTime = parseServerTime(serverTime)

        if (baseServerTime === null) {
            setNow(null)
            return
        }

        const syncedAt = performance.now()

        setNow(new Date(baseServerTime))

        const timer = setInterval(() => {
            const elapsed = performance.now() - syncedAt

            setNow(
                new Date(
                    baseServerTime + elapsed
                )
            )
        }, 60 * 1000)

        return () => {
            clearInterval(timer)
        }
    }, [serverTime])

    return now
}
