import { useMemo, useState } from 'react'

const TUTORIAL_UI_HIGHLIGHT_EVENT = 'tutorial-ui-highlight'

export default function FirstRunTutorial({ setEditMenü, editMenü }) {
    const [showPrompt, setShowPrompt] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [stepIndex, setStepIndex] = useState(0)

    const steps = useMemo(() => ([
        {
            id: 'navigation',
            title: 'Navigation links',
            text: 'Starte links mit Abmessungen. Dort steuerst du Breite, Länge, Traufhöhe und Dachart direkt über die globalen Hallen-States.',
            actionLabel: 'Abmessungen öffnen',
            action: () => setEditMenü('Abmessungen')
        },
        {
            id: 'oeffnungen',
            title: 'Öffnungen platzieren',
            text: 'Öffne zuerst links den Bereich Öffnungen und klicke dann auf einen blauen Add-Button an Wand oder Dach. Unten rechts wählst du den Öffnungstyp aus. Platzierte Öffnungen bewegst du mit der Maus oder mit den Pfeiltasten. Mit einem Klick auf die Öffnung öffnest du direkt die Bearbeitung.',
            actionLabel: 'Öffnungen öffnen',
            action: () => setEditMenü('Öffnungen')
        },
        {
            id: 'verkleidung',
            title: 'Verkleidung einstellen',
            text: 'Im Bereich Verkleidung definierst du Wandaufbau, Isolierung, Paneeltyp, Orientierung und Farben. Diese Einstellungen wirken direkt auf Materialdarstellung und Aufbau der Hallenhülle.',
            actionLabel: 'Verkleidung öffnen',
            action: () => setEditMenü('Verkleidung')
        },
        {
            id: 'konstruktion',
            title: 'Konstruktion',
            text: 'Im Bereich Konstruktion steuerst du die tragenden Elemente wie Rahmen, Pfetten und Wandriegel sowie die konstruktive Sicht auf die Halle.',
            actionLabel: 'Konstruktion öffnen',
            action: () => setEditMenü('Konstruktion')
        },
        {
            id: 'darstellung',
            title: 'Darstellung rechts',
            text: 'Rechts blendest du Kanten, Oberflächen und Hauptelemente wie Platten, Massivwände oder Öffnungen ein/aus. So wechselst du schnell zwischen Technik- und Präsentationssicht.',
            actionLabel: 'Darstellung fokussieren',
            action: () => setEditMenü('Verkleidung')
        },
        {
            id: 'aktionen-oben',
            title: 'Buttons oben',
            text: 'Oben rechts steuerst du den globalen Ablauf: Home bringt dich zur Startseite, Reset startet die Konfiguration neu und Save übernimmt den aktuellen Stand.',
            actionLabel: 'Obere Buttons zeigen',
            action: () => setEditMenü('')
        },
        {
            id: 'angebot',
            title: 'Angebot',
            text: 'Im Bereich Angebot hinterlegst du Nutzungszweck, Bauzeitraum und Kontaktdaten für die Anfrage. Dieser Schritt bereitet die Übergabe der Konfiguration vor.',
            actionLabel: 'Angebot öffnen',
            action: () => setEditMenü('Angebot')
        }
    ]), [setEditMenü])

    if (showPrompt) {
        return (
            <div
                style={{
                    position: 'fixed',
                    left: '50%',
                    bottom: 24,
                    transform: 'translateX(-50%)',
                    width: 'min(460px, calc(100vw - 32px))',
                    background: 'rgba(255, 255, 255, 0.92)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: 14,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.18)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    padding: 16,
                    zIndex: 1200
                }}
            >
                <p className="text" style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                    Anleitung gefällig?
                </p>
                <p className="text" style={{ fontSize: 14, fontWeight: 400, marginBottom: 14 }}>
                    Wir zeigen dir die wichtigsten Schritte für Navigation, Öffnungen, Verkleidung und Darstellung in weniger als einer Minute.
                </p>

                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        className="buttonDark"
                        style={{ minHeight: '2.6em', padding: '0.5em 1.1em' }}
                        onClick={() => setShowPrompt(false)}
                    >
                        Überspringen
                    </button>
                    <button
                        type="button"
                        className="buttonDark"
                        style={{ minHeight: '2.6em', padding: '0.5em 1.1em' }}
                        onClick={() => {
                            setShowPrompt(false)
                            setIsOpen(true)
                            setStepIndex(0)
                        }}
                    >
                        Tutorial starten
                    </button>
                </div>
            </div>
        )
    }

    if (!isOpen) return null

    const lastStepIndex = Math.max(0, steps.length - 1)
    const safeStepIndex = Math.min(Math.max(stepIndex, 0), lastStepIndex)
    const step = steps[safeStepIndex] ?? steps[0]
    const isLast = safeStepIndex >= lastStepIndex

    const closeTutorial = () => {
        setIsOpen(false)
    }

    const triggerUiHighlight = (area) => {
        if (typeof window === 'undefined') return
        window.dispatchEvent(new CustomEvent(TUTORIAL_UI_HIGHLIGHT_EVENT, { detail: { area } }))
    }

    const leftUiMenus = new Set([
        'Abmessungen',
        'Felder',
        'Verkleidung',
        'Öffnungen',
        'Konstruktion',
        'Angebot',
        'Zubehör',
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
    const openingTypeMenus = new Set(['Öffnungen-Auswahl', 'Öffnungen-Dach-Auswahl'])
    const shouldUseBottomRight =
        leftUiMenus.has(editMenü) &&
        !openingTypeMenus.has(editMenü) &&
        !openingEditMenus.has(editMenü)
    const tutorialPositionStyle = shouldUseBottomRight
        ? {
            right: 20,
            bottom: 20
        }
        : {
            left: '50%',
            bottom: 24,
            transform: 'translateX(-50%)'
        }

    return (
        <div
            style={{
                position: 'fixed',
                ...tutorialPositionStyle,
                width: 'min(560px, calc(100vw - 32px))',
                background: 'rgba(255, 255, 255, 0.92)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: 14,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.18)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                padding: 16,
                zIndex: 1200
            }}
        >
            <button
                type="button"
                className="buttonDark"
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    minHeight: '2em',
                    padding: '0.25em 0.7em',
                    fontSize: 12,
                    zIndex: 3
                }}
                onClick={closeTutorial}
            >
                Überspringen
            </button>

            <p className="text" style={{ fontSize: 12, opacity: 0.7, marginBottom: 6, paddingRight: 110 }}>
                Onboarding {safeStepIndex + 1}/{steps.length}
            </p>
            <p className="text" style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, paddingRight: 110 }}>
                {step.title}
            </p>
            <p className="text" style={{ fontSize: 14, fontWeight: 400, marginBottom: 14, paddingRight: 110 }}>
                {step.text}
            </p>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                {safeStepIndex > 0 && (
                    <button
                        type="button"
                        className="buttonDark"
                        style={{ minHeight: '2.6em', padding: '0.5em 1.1em' }}
                        onClick={() => {
                            setEditMenü('')
                            setStepIndex(prev => Math.max(prev - 1, 0))
                        }}
                    >
                        Zurück
                    </button>
                )}
                <button
                    type="button"
                    className="buttonDark"
                    style={{ minHeight: '2.6em', padding: '0.5em 1.1em' }}
                    onClick={() => {
                        if (typeof step?.action === 'function') {
                            step.action()
                        }

                        if (step?.id === 'darstellung') {
                            triggerUiHighlight('darstellung')
                        }

                        if (step?.id === 'aktionen-oben') {
                            triggerUiHighlight('top-actions')
                        }
                    }}
                >
                    {step.actionLabel}
                </button>
                <button
                    type="button"
                    className="buttonDark"
                    style={{ minHeight: '2.6em', padding: '0.5em 1.1em' }}
                    onClick={() => {
                        setEditMenü('')

                        if (isLast) {
                            closeTutorial()
                            return
                        }
                        setStepIndex(prev => Math.min(prev + 1, lastStepIndex))
                    }}
                >
                    {isLast ? 'Fertig' : 'Weiter'}
                </button>
            </div>
        </div>
    )
}
