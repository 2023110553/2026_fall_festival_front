import {
    useEffect,
    useState,
} from 'react'

export default function useCurrentTime() {
    const [now, setNow] = useState(
        new Date()
    )

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date())
        }, 60 * 1000)

        return () => {
            clearInterval(timer)
        }
    }, [])

    return now
}