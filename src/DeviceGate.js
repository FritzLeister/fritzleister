import { useEffect, useState } from 'react'

const MOBILE_MAX_WIDTH = 768

function readDeviceState() {
    if (typeof window === 'undefined') {
        return { isMobileViewport: false, isTouchDevice: false }
    }

    const viewportWidth = window.innerWidth || 0
    const isMobileViewport = viewportWidth < MOBILE_MAX_WIDTH
    const isTouchDevice =
        window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(any-pointer: coarse)').matches ||
        (navigator.maxTouchPoints || 0) > 0

    return { isMobileViewport, isTouchDevice }
}

export default function DeviceGate({ children, fallback, onDeviceChange }) {
    const [deviceState, setDeviceState] = useState(() => readDeviceState())

    useEffect(() => {
        const updateDeviceState = () => {
            const next = readDeviceState()
            setDeviceState(next)
            onDeviceChange?.(next)
        }

        updateDeviceState()

        window.addEventListener('resize', updateDeviceState)
        window.addEventListener('orientationchange', updateDeviceState)

        return () => {
            window.removeEventListener('resize', updateDeviceState)
            window.removeEventListener('orientationchange', updateDeviceState)
        }
    }, [onDeviceChange])

    if (deviceState.isMobileViewport) {
        return typeof fallback === 'function' ? fallback(deviceState) : fallback
    }

    return children
}
