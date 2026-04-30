import { useEffect, useState } from "react"
import MuiNumberfield from "../MuiNumberfield"
import MuiSelect from "../MuiSelect"

export default function WandFensterBearbeiten({ selectedObject, setEditMenü, objs, setObjs, gebäudeHöhe, gebäudeBreite, gebäudeLänge }) {
    const meterEinheit = 2.5
    const istLangeWand = selectedObject?.lang ?? true
    const maxFensterBreite = istLangeWand ? gebäudeLänge : gebäudeBreite
    const maxFensterHöhe = gebäudeHöhe
    const clampValue = (value, min, max) => Math.min(Math.max(value, min), max)

    // Pre-füllen mit aktuellen Werten
    const [fensterBreite, setFensterBreite] = useState(selectedObject?.value[0] ?? 4.1)
    const [fensterHöhe, setFensterHöhe] = useState(selectedObject?.value[1] ?? 2.95)
    const [posSegment] = useState(selectedObject?.posSegment ?? 'mittig')
    const [reflektor, setReflektor] = useState(selectedObject?.reflektor ?? 'keine')
    const [sprossenX, setSprossenX] = useState(selectedObject?.sprossenX ?? 0)
    const [sprossenY, setSprossenY] = useState(selectedObject?.sprossenY ?? 0)
    const [fensterFarbe, setFensterFarbe] = useState(selectedObject?.fensterFarbe ?? 'Weiß')
    const [reflektorFarbe, setReflektorFarbe] = useState(selectedObject?.reflektorFarbe ?? 'Weiß')
    const [anzeigeAbstände, setAnzeigeAbstände] = useState({
        links: Number(selectedObject?.abstandLinks ?? 0),
        unten: Number(selectedObject?.abstandUnten ?? 0)
    })

    const aktuellerAbstandLinks = clampValue(Number(anzeigeAbstände.links ?? 0), 0, Number.POSITIVE_INFINITY)
    const aktuellerAbstandUnten = clampValue(Number(anzeigeAbstände.unten ?? 0), 0, Number.POSITIVE_INFINITY)
    const formatDistance = (value) => `${(Number(value || 0) / meterEinheit).toFixed(2)} m`

    useEffect(() => {
        setAnzeigeAbstände({
            links: Number(selectedObject?.abstandLinks ?? 0),
            unten: Number(selectedObject?.abstandUnten ?? 0)
        })
    }, [selectedObject?.id, selectedObject?.abstandLinks, selectedObject?.abstandUnten])

    useEffect(() => {
        const handlePositionValues = (event) => {
            if (event?.detail?.id !== selectedObject?.id) return

            setAnzeigeAbstände({
                links: Number(event.detail.abstandLinks ?? 0),
                unten: Number(event.detail.abstandUnten ?? 0)
            })
        }

        window.addEventListener('wand-fenster:position-values', handlePositionValues)
        return () => window.removeEventListener('wand-fenster:position-values', handlePositionValues)
    }, [selectedObject?.id])

    const handleRefreshPosition = () => {
        if (!selectedObject?.id) return
        window.dispatchEvent(new CustomEvent('wand-fenster:refresh-position', {
            detail: { id: selectedObject.id }
        }))
    }

    const handleUpdate = () => {
        if (selectedObject) {
            handleRefreshPosition()
            const sichereFensterBreite = clampValue(fensterBreite, 0.2, maxFensterBreite)
            const sichereFensterHöhe = clampValue(fensterHöhe, 0.2, maxFensterHöhe)
            setObjs(objs => objs.map(obj => 
                obj.id === selectedObject.id 
                    ? { 
                        ...obj, 
                        value: [sichereFensterBreite, sichereFensterHöhe], 
                        posSegment,
                        reflektor,
                        sprossenX,
                        sprossenY,
                        fensterFarbe,
                        reflektorFarbe
                    }
                    : obj
            ))
            setEditMenü(null)
        }
    }

    const handleDelete = () => {
        if (selectedObject) {
            setObjs(objs => objs.filter(obj => obj.id !== selectedObject.id))
            setEditMenü(null)
        }
    }

    return (
        <div style={{
            position: "fixed",
            top: 455,
            right: 20,
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            color: "#000000ff",
            width: 350,
            maxHeight: 'calc(100vh - 470px)',
            overflowY: 'scroll',
            WebkitOverflowScrolling: 'touch',
            padding: "15px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            zIndex: 999,
            boxSizing: 'border-box'
        }}>
            <div style={{
                margin: "8px",
                paddingBottom: "4px",
                borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
            }}>
                <p className='text' style={{ fontSize: 17 }}>
                    Fenster Anpassen
                </p>
            </div>

            <div style={{ margin: '10px', marginTop: '8px', marginRight: '12px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    marginBottom: '6px',
                    marginRight: '10px'
                }}>
                    <p className='text' style={{ fontSize: 13, marginBottom: 0 }}>Position:</p>
                    <button
                        onClick={handleRefreshPosition}
                        style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid rgba(0,0,0,0.18)',
                            backgroundColor: 'rgba(255, 255, 255, 0.45)',
                            color: 'black',
                            cursor: 'pointer',
                            fontWeight: 500,
                            fontSize: '11px',
                            lineHeight: 1.2,
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.65)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.45)'}
                    >
                        Aktualisieren
                    </button>
                </div>

                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    marginBottom: "10px", 
                    justifyContent: 'space-between', 
                    marginRight: "10px"
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className='text' style={{ fontWeight: 200 }}>Abstand Links</span>
                        <span className='text' style={{ fontSize: 12 }}>Per Button aktualisieren</span>
                    </div>
                    <span className='text' style={{ fontWeight: 200 }}>{formatDistance(aktuellerAbstandLinks)}</span>
                </div>

                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    marginBottom: "14px", 
                    justifyContent: 'space-between', 
                    marginRight: "10px"
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className='text' style={{ fontWeight: 200 }}>Abstand Unten</span>
                        <span className='text' style={{ fontSize: 12 }}>Zum Boden</span>
                    </div>
                    <span className='text' style={{ fontWeight: 200 }}>{formatDistance(aktuellerAbstandUnten)}</span>
                </div>

                {/* <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Position im Segment:</p>

                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    marginBottom: "10px", 
                    justifyContent: 'space-between', 
                    marginRight: "10px",
                }}>
                    <span className='text' style={{ fontWeight: 200 }}>Horizontal</span>
                    <MuiSelect
                        option1={'Links'}
                        value1={'links'}
                        option2={'Mittig'}
                        value2={'mittig'}
                        option3={'Rechts'}
                        value3={'rechts'}
                        label={'Segment'}
                        state={posSegment}
                        setState={setPosSegment}
                    />
                </div> */}

                <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Abmessungen:</p>

                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    marginBottom: "10px", 
                    justifyContent: 'space-between', 
                    marginRight: "10px"
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className='text' style={{ fontWeight: 200}}>Breite</span>
                        <span className='text' style={{ fontSize: 12}}>0.2-{maxFensterBreite}</span>
                    </div>
                    <MuiNumberfield 
                        label={'m'} 
                        min={0.2} 
                        max={maxFensterBreite} 
                        state={fensterBreite} 
                        setState={setFensterBreite} 
                    />
                </div>

                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    marginBottom: "14px", 
                    justifyContent: 'space-between', 
                    marginRight: "10px"
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className='text' style={{ fontWeight: 200}}>Höhe</span>
                        <span className='text' style={{ fontSize: 12}}>0.2-{maxFensterHöhe}</span>
                    </div>
                    <MuiNumberfield 
                        label={'m'} 
                        min={0.2} 
                        max={maxFensterHöhe} 
                        state={fensterHöhe} 
                        setState={setFensterHöhe} 
                    />
                </div>

                <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Eigenschaften:</p>

                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    marginBottom: "10px", 
                    justifyContent: 'space-between', 
                    marginRight: "10px",
                }}>
                    <span className='text' style={{ fontWeight: 200 }}>Reflektor</span>
                    <MuiSelect
                        option1={'Keine'}
                        value1={'keine'}
                        option2={'Klein'}
                        value2={'klein'}
                        option3={'Groß'}
                        value3={'groß'}
                        label={'Reflektor'}
                        state={reflektor}
                        setState={setReflektor}
                    />
                </div>

                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    marginBottom: "10px", 
                    justifyContent: 'space-between', 
                    marginRight: "10px"
                }}>
                    <span className='text' style={{ fontWeight: 200 }}>Sprossen X</span>
                    <MuiNumberfield 
                        label={''} 
                        min={0} 
                        max={50} 
                        state={sprossenX} 
                        setState={setSprossenX} 
                    />
                </div>

                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    marginBottom: "14px", 
                    justifyContent: 'space-between', 
                    marginRight: "10px"
                }}>
                    <span className='text' style={{ fontWeight: 200 }}>Sprossen Y</span>
                    <MuiNumberfield 
                        label={''} 
                        min={0} 
                        max={50} 
                        state={sprossenY} 
                        setState={setSprossenY} 
                    />
                </div>

                <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Farben:</p>

                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    marginBottom: "10px", 
                    justifyContent: 'space-between', 
                    marginRight: "10px",
                }}>
                    <span className='text' style={{ fontWeight: 200 }}>Farbe des Artikels</span>
                    <MuiSelect
                        option1={'Weiß'}
                        value1={'Weiß'}
                        option2={'Grau'}
                        value2={'Grau'}
                        option3={'Schwarz'}
                        value3={'Schwarz'}
                        label={'Farbe'}
                        state={fensterFarbe}
                        setState={setFensterFarbe}
                    />
                </div>

                {(reflektor === 'klein' || reflektor === 'groß') && (
                    <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    marginBottom: "14px", 
                    justifyContent: 'space-between', 
                    marginRight: "10px",
                    }}>
                        <span className='text' style={{ fontWeight: 200 }}>Farbe des Reflektors</span>
                        <MuiSelect
                            option1={'Weiß'}
                            value1={'Weiß'}
                            option2={'Grau'}
                            value2={'Grau'}
                            option3={'Schwarz'}
                            value3={'Schwarz'}
                            label={'Reflektor'}
                            state={reflektorFarbe}
                            setState={setReflektorFarbe}
                        />
                    </div>
                )}
                
                {/* Buttons */}
                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    justifyContent: 'space-between',
                    marginTop: '12px'
                }}>
                    <button
                        onClick={() => setEditMenü(null)}
                        style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(0,0,0,0.2)',
                            backgroundColor: 'rgba(200, 200, 200, 0.3)',
                            color: 'black',
                            cursor: 'pointer',
                            fontWeight: 500,
                            fontSize: '14px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(150, 150, 150, 0.4)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(200, 200, 200, 0.3)'}
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={handleUpdate}
                        style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(0,0,0,0.2)',
                            backgroundColor: 'rgba(100, 180, 100, 0.5)',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: 500,
                            fontSize: '14px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(80, 160, 80, 0.7)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(100, 180, 100, 0.5)'}
                    >
                        Speichern
                    </button>
                </div>

                {/* Löschen Button */}
                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    justifyContent: 'center',
                    marginTop: '8px'
                }}>
                    <button
                        onClick={handleDelete}
                        style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(0,0,0,0.2)',
                            backgroundColor: 'rgba(220, 80, 80, 0.5)',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: 500,
                            fontSize: '14px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(200, 60, 60, 0.7)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(220, 80, 80, 0.5)'}
                    >
                        Löschen
                    </button>
                </div>
            </div>
        </div>
    )
}
