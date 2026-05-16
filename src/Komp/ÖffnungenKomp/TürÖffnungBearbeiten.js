import { useState } from "react"
import MuiNumberfield from "../MuiNumberfield"
import MuiSelect from "../MuiSelect"
import PositionInfoSection, { useOpeningPositionDisplay } from "./PositionInfoSection"

export default function TürÖffnungBearbeiten({ selectedObject, setEditMenü, objs, setObjs, gebäudeHöhe, gebäudeBreite, gebäudeLänge }) {
    const istLangeWand = selectedObject?.lang ?? true
    const maxTürBreite = istLangeWand ? gebäudeLänge : gebäudeBreite
    const maxTürHöhe = gebäudeHöhe
    const maxAbstand = istLangeWand ? gebäudeLänge : gebäudeBreite
    const clampValue = (value, min, max) => Math.min(Math.max(value, min), max)

    // Pre-füllen mit aktuellen Werten
    const [türBreite, setTürBreite] = useState(selectedObject?.value[0] ?? 0.95)
    const [türHöhe, setTürHöhe] = useState(selectedObject?.value[1] ?? 2.05)
    const [posSegment] = useState(selectedObject?.posSegment ?? 'mittig')
    const [doppeltür, setDoppeltür] = useState(selectedObject?.doppeltür ?? 'nein')
    const [öffnet, setÖffnet] = useState(selectedObject?.öffnet ?? 'innen')
    const [orientierung, setOrientierung] = useState(selectedObject?.orientierung ?? 'links')
    const [türReflektor, setTürReflektor] = useState(selectedObject?.türReflektor ?? 'keine')
    const [türFarbe, setTürFarbe] = useState(selectedObject?.türFarbe ?? 'Weiß')
    const [türFüllFarbe, setTürFüllFarbe] = useState(selectedObject?.türFüllFarbe ?? 'Weiß')
    const [türFüllFarbeInnen, setTürFüllFarbeInnen] = useState(selectedObject?.türFüllFarbeInnen ?? 'Weiß')
    const [abstandLinks] = useState(selectedObject?.abstandLinks ?? 0)
    const [abstandRechts] = useState(selectedObject?.abstandRechts ?? 0)
    const positionFields = [
        { key: 'abstandLinks', label: 'Abstand Links', hint: 'Per Button aktualisieren' },
        { key: 'abstandRechts', label: 'Abstand Rechts', hint: 'Per Button aktualisieren' }
    ]
    const { displayValues, handleRefreshPosition } = useOpeningPositionDisplay(selectedObject, positionFields)

    const handleUpdate = () => {
        if (selectedObject) {
            handleRefreshPosition()
            const sichereTürBreite = clampValue(türBreite, 0.2, maxTürBreite)
            const sichereTürHöhe = clampValue(türHöhe, 0.2, maxTürHöhe)
            const sichererAbstandLinks = clampValue(displayValues.abstandLinks ?? abstandLinks, 0, maxAbstand)
            const sichererAbstandRechts = clampValue(displayValues.abstandRechts ?? abstandRechts, 0, maxAbstand)
            setObjs(objs => objs.map(obj => 
                obj.id === selectedObject.id 
                    ? { 
                        ...obj, 
                        value: [sichereTürBreite, sichereTürHöhe],
                        posSegment,
                        doppeltür,
                        öffnet,
                        orientierung,
                        türReflektor,
                        türFarbe,
                        türFüllFarbe,
                        türFüllFarbeInnen,
                        abstandLinks: sichererAbstandLinks,
                        abstandRechts: sichererAbstandRechts
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
            width: 420,
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
                    Tür Anpassen
                </p>
            </div>

            <div style={{ margin: '10px', marginTop: '8px', marginRight: '12px' }}>
                <PositionInfoSection fields={positionFields} values={displayValues} onRefresh={handleRefreshPosition} />

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
                        <span className='text' style={{ fontSize: 12}}>0.2-{maxTürBreite}</span>
                    </div>
                    <MuiNumberfield 
                        label={'m'} 
                        min={0.2} 
                        max={maxTürBreite} 
                        state={türBreite} 
                        setState={setTürBreite} 
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
                        <span className='text' style={{ fontSize: 12}}>0.2-{maxTürHöhe}</span>
                    </div>
                    <MuiNumberfield 
                        label={'m'} 
                        min={0.2} 
                        max={maxTürHöhe} 
                        state={türHöhe} 
                        setState={setTürHöhe} 
                    />
                </div>

                {/*
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
                        <span className='text' style={{ fontSize: 12 }}>Mitte bis Wandrand</span>
                    </div>
                    <MuiNumberfield
                        label={'m'}
                        min={0}
                        max={maxAbstand}
                        state={abstandLinks}
                        setState={setAbstandLinks}
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
                        <span className='text' style={{ fontWeight: 200 }}>Abstand Rechts</span>
                        <span className='text' style={{ fontSize: 12 }}>Mitte bis Wandrand</span>
                    </div>
                    <MuiNumberfield
                        label={'m'}
                        min={0}
                        max={maxAbstand}
                        state={abstandRechts}
                        setState={setAbstandRechts}
                    />
                </div>
                */}

                <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Türeigenschaften:</p>

                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    marginBottom: "10px", 
                    justifyContent: 'space-between', 
                    marginRight: "10px",
                }}>
                    <span className='text' style={{ fontWeight: 200 }}>Doppeltür</span>
                    <MuiSelect
                        option1={'Nein'}
                        value1={'nein'}
                        option2={'Ja'}
                        value2={'ja'}
                        label={'Doppeltür'}
                        state={doppeltür}
                        setState={setDoppeltür}
                    />
                </div>

                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    marginBottom: "10px", 
                    justifyContent: 'space-between', 
                    marginRight: "10px",
                }}>
                    <span className='text' style={{ fontWeight: 200 }}>Öffnungsrichtung</span>
                    <MuiSelect
                        option1={'Innen'}
                        value1={'innen'}
                        option2={'Außen'}
                        value2={'außen'}
                        label={'Öffnet'}
                        state={öffnet}
                        setState={setÖffnet}
                    />
                </div>

                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    marginBottom: "10px", 
                    justifyContent: 'space-between', 
                    marginRight: "10px",
                }}>
                    <span className='text' style={{ fontWeight: 200 }}>Türdrücker</span>
                    <MuiSelect
                        option1={'Links'}
                        value1={'links'}
                        option2={'Rechts'}
                        value2={'rechts'}
                        label={'Seite'}
                        state={orientierung}
                        setState={setOrientierung}
                    />
                </div>

                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    marginBottom: "14px", 
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
                        state={türReflektor}
                        setState={setTürReflektor}
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
                    <span className='text' style={{ fontWeight: 200 }}>Rahmen & Zarge</span>
                    <MuiSelect
                        option1={'Weiß'}
                        value1={'Weiß'}
                        option2={'Grau'}
                        value2={'Grau'}
                        option3={'Schwarz'}
                        value3={'Schwarz'}
                        label={'Farbe'}
                        state={türFarbe}
                        setState={setTürFarbe}
                    />
                </div>

                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    marginBottom: "10px", 
                    justifyContent: 'space-between', 
                    marginRight: "10px",
                }}>
                    <span className='text' style={{ fontWeight: 200 }}>Türblatt außen</span>
                    <MuiSelect
                        option1={'Weiß'}
                        value1={'Weiß'}
                        option2={'Grau'}
                        value2={'Grau'}
                        option3={'Schwarz'}
                        value3={'Schwarz'}
                        label={'Farbe'}
                        state={türFüllFarbe}
                        setState={setTürFüllFarbe}
                    />
                </div>

                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    marginBottom: "14px", 
                    justifyContent: 'space-between', 
                    marginRight: "10px",
                }}>
                    <span className='text' style={{ fontWeight: 200 }}>Türblatt innen</span>
                    <MuiSelect
                        option1={'Weiß'}
                        value1={'Weiß'}
                        option2={'Grau'}
                        value2={'Grau'}
                        option3={'Schwarz'}
                        value3={'Schwarz'}
                        label={'Farbe'}
                        state={türFüllFarbeInnen}
                        setState={setTürFüllFarbeInnen}
                    />
                </div>
                
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
