import { useEffect, useState } from 'react'

export default function useServerTime(serverTime) {
    const [now, setNow] = useState(() => new Date(serverTime))

    useEffect(() => {
        const base = new Date(serverTime).getTime()
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