import { useMemo, useState, useEffect, useRef } from 'react'

const OPENING_HINT_DISABLED_KEY = 'opening-movement-hint-disabled-session'

export default function OpeningMovementHint({ editMenü, isFirstOpening = false, openingCreatedCycle = 0 }) {
    const [animationState, setAnimationState] = useState('drag') // 'drag' | 'keys'
    const [isVisible, setIsVisible] = useState(false)
    const [isDismissed, setIsDismissed] = useState(false)
    const [isPermanentlyDisabled, setIsPermanentlyDisabled] = useState(false)
    const [acknowledgedCycle, setAcknowledgedCycle] = useState(0)
    const lastPreparedCycleRef = useRef(0)

    useEffect(() => {
        if (typeof window === 'undefined') return
        const storedValue = window.sessionStorage.getItem(OPENING_HINT_DISABLED_KEY)
        if (storedValue === 'true') {
            setIsPermanentlyDisabled(true)
        }
    }, [])

    useEffect(() => {
        if (!isFirstOpening) return
        if (openingCreatedCycle <= 0) return
        if (openingCreatedCycle === lastPreparedCycleRef.current) return

        // Bei neuer Öffnung genau einen neuen Tutorial-Zyklus vorbereiten.
        lastPreparedCycleRef.current = openingCreatedCycle
        setIsDismissed(false)
        setAnimationState('drag')
    }, [isFirstOpening, openingCreatedCycle])

    // Der Hint soll beim ersten Erstellen direkt sichtbar sein (Felder)
    // und weiterhin in Bearbeiten-Menüs funktionieren.
    const isOpeningTutorialContext = useMemo(() => {
        const openingEditMenus = new Set([
            'LeerÖffnung-Bearbeiten',
            'Fenster-Bearbeiten',
            'Tür-Bearbeiten',
            'SektionalTor-Bearbeiten',
            'Schiebetür-Bearbeiten',
            'Rolltor-Bearbeiten',
            'TransparentesPaneel-Bearbeiten',
            'Laderampe-Bearbeiten',
            'Lichtkuppel-Bearbeiten',
            'Photovoltaik-Bearbeiten'
        ])
        return isFirstOpening && (openingEditMenus.has(editMenü) || editMenü === 'Felder')
    }, [editMenü, isFirstOpening])

    const hasPendingTutorialForCycle = openingCreatedCycle > 0 && openingCreatedCycle > acknowledgedCycle
    const shouldShowHint = isOpeningTutorialContext && hasPendingTutorialForCycle && !isPermanentlyDisabled

    // Zyklus durch Animationen
    useEffect(() => {
        if (!shouldShowHint) {
            setIsVisible(false)
            return
        }

        setIsVisible(true)
        const interval = setInterval(() => {
            setAnimationState(prev => prev === 'drag' ? 'keys' : 'drag')
        }, 3000) // Wechsel alle 3 Sekunden

        return () => clearInterval(interval)
    }, [shouldShowHint])

    if (!isVisible || isDismissed) return null

    const handleDisablePermanently = () => {
        if (typeof window !== 'undefined') {
            window.sessionStorage.setItem(OPENING_HINT_DISABLED_KEY, 'true')
        }
        setIsPermanentlyDisabled(true)
        setAcknowledgedCycle(openingCreatedCycle)
        setIsVisible(false)
        setIsDismissed(true)
    }

    const handleClose = () => {
        setAcknowledgedCycle(openingCreatedCycle)
        setIsDismissed(true)
        setIsVisible(false)
    }

    const isDragActive = animationState === 'drag'
    const isKeysActive = animationState === 'keys'

    return (
        <div
            style={{
                position: 'fixed',
                left: 20,
                bottom: 20,
                width: 'min(320px, calc(100vw - 40px))',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: 12,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: 14,
                zIndex: 1100,
                animation: 'fadeInHint 0.4s ease-out',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
            }}
        >
            <style>{`
                @keyframes fadeInHint {
                    from { 
                        opacity: 0; 
                        transform: translateY(8px);
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0);
                    }
                }

                @keyframes dragDemo {
                    0% { 
                        transform: translate(0, 0);
                        opacity: 0.5;
                    }
                    50% { 
                        transform: translate(12px, 12px);
                        opacity: 1;
                    }
                    100% { 
                        transform: translate(0, 0);
                        opacity: 0.5;
                    }
                }

                @keyframes keyBounce {
                    0%, 100% { 
                        transform: translateY(0) scale(1); 
                        opacity: 0.4;
                    }
                    50% { 
                        transform: translateY(-4px) scale(1.08); 
                        opacity: 1;
                    }
                }

                .drag-demo-active {
                    animation: dragDemo 1.2s ease-in-out infinite !important;
                }

                .arrow-key-button.active {
                    animation: keyBounce 0.8s ease-in-out infinite !important;
                }
            `}</style>

            <button
                type="button"
                onClick={handleClose}
                aria-label="Hinweis schließen"
                style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 22,
                    height: 22,
                    border: '1px solid rgba(0, 0, 0, 0.14)',
                    borderRadius: 6,
                    background: 'rgba(255, 255, 255, 0.85)',
                    color: 'rgba(0, 0, 0, 0.65)',
                    fontSize: 13,
                    lineHeight: 1,
                    cursor: 'pointer',
                    padding: 0
                }}
            >
                x
            </button>

            <button
                type="button"
                onClick={handleDisablePermanently}
                aria-label="Hinweis nicht mehr anzeigen"
                style={{
                    position: 'absolute',
                    top: 8,
                    right: 36,
                    height: 22,
                    border: '1px solid rgba(0, 0, 0, 0.14)',
                    borderRadius: 6,
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: 'rgba(0, 0, 0, 0.7)',
                    fontSize: 11,
                    lineHeight: 1,
                    cursor: 'pointer',
                    padding: '0 6px',
                    whiteSpace: 'nowrap'
                }}
            >
                nicht mehr anzeigen
            </button>

            <p style={{ fontSize: 14, fontWeight: 600, margin: '0 28px 8px 0', color: 'rgba(0, 0, 0, 0.85)', letterSpacing: '-0.3px' }}>
                Öffnung verschieben
            </p>

            {/* Drag Demo */}
            <div style={{
                width: '100%',
                height: 56,
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '12px 0',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(0, 0, 0, 0.06)'
            }}>
                <svg 
                    className={isDragActive ? 'drag-demo-active' : ''}
                    width="28" 
                    height="28" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                    style={{ color: 'rgba(0, 0, 0, 0.5)' }}
                >
                    <path d="M3 3l8 14L9 11h10L3 3z" fill="currentColor" />
                </svg>
                {isDragActive && (
                    <p style={{ fontSize: 12, fontWeight: 400, margin: '0 0 0 8px', color: 'rgba(0, 0, 0, 0.55)' }}>
                        Klick &amp; Ziehen
                    </p>
                )}
            </div>

            {/* Arrow Keys Demo */}
            <div style={{
                width: '100%',
                height: 56,
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '12px 0',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(0, 0, 0, 0.06)'
            }}>
                <div style={{
                    display: 'flex',
                    gap: 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 12
                }}>
                    {['↑', '↓', '←', '→'].map((arrow, i) => (
                        <div
                            key={i}
                            className={isKeysActive ? 'arrow-key-button active' : 'arrow-key-button'}
                            style={{
                                width: 22,
                                height: 22,
                                border: '1.2px solid rgba(0, 0, 0, 0.15)',
                                borderRadius: 4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 11,
                                fontWeight: 600,
                                color: 'rgba(0, 0, 0, 0.5)',
                                background: 'rgba(255, 255, 255, 0.8)',
                                transition: 'all 0.15s ease',
                                ...(isKeysActive && {
                                    background: 'rgba(0, 0, 0, 0.08)',
                                    color: 'rgba(0, 0, 0, 0.7)',
                                    borderColor: 'rgba(0, 0, 0, 0.2)'
                                })
                            }}
                        >
                            {arrow}
                        </div>
                    ))}
                </div>
                {isKeysActive && (
                    <p style={{ fontSize: 12, fontWeight: 400, margin: 0, marginLeft: 'auto', marginRight: 10, color: 'rgba(0, 0, 0, 0.55)' }}>
                        Pfeiltasten
                    </p>
                )}
            </div>

            <p style={{ fontSize: 12, fontWeight: 400, color: 'rgba(0, 0, 0, 0.55)', textAlign: 'center', margin: '6px 0 0 0', letterSpacing: '0.2px' }}>
                Bewege Öffnungen frei
            </p>
        </div>
    )
}
