import { useEffect, useState } from 'react'

export default function useServerTime(serverTime) {
    const [now, setNow] = useState(() => {
        const timestamp = new Date(serverTime).getTime()
        return Number.isFinite(timestamp) ? new Date(timestamp) : null
    })

    useEffect(() => {
        const base = new Date(serverTime).getTime()

        if (!Number.isFinite(base)) {
            setNow(null)
            return
        }

        const syncedAt = performance.now()
        setNow(new Date(base))

        const timer = setInterval(() => {
            const elapsed = performance.now() - syncedAt
            setNow(new Date(base + elapsed))
        }, 60 * 1000)

        return () => clearInterval(timer)
    }, [serverTime])

    return now
}