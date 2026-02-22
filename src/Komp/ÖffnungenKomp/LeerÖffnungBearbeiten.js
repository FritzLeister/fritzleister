import { useEffect, useState } from "react"
import MuiNumberfield from "../MuiNumberfield"
import MuiSelect from "../MuiSelect"

export default function LeerÖffnungBearbeiten({ selectedObject, setEditMenü, objs, setObjs, gebäudeHöhe, gebäudeBreite, gebäudeLänge }) {
    const internerMaßstab = 2.5
    const istLangeWand = selectedObject?.lang ?? true
    const maxÖffnungsBreite = istLangeWand ? gebäudeLänge : gebäudeBreite
    const maxÖffnungsHöhe = gebäudeHöhe

    const clampValue = (value, min, max) => Math.min(Math.max(value, min), max)

    // Pre-füllen mit aktuellen Werten
    const [öffnungsBreite, setÖffnungsBreite] = useState(() => clampValue((selectedObject?.value[0] ?? 12) / internerMaßstab, 1, maxÖffnungsBreite))
    const [öffnungsHöhe, setÖffnungsHöhe] = useState(() => clampValue((selectedObject?.value[1] ?? 8) / internerMaßstab, 1, maxÖffnungsHöhe))
    const [posSegment, setPosSegment] = useState(selectedObject?.posSegment ?? 'mittig')

    useEffect(() => {
        setÖffnungsBreite((prev) => clampValue(prev, 1, maxÖffnungsBreite))
        setÖffnungsHöhe((prev) => clampValue(prev, 1, maxÖffnungsHöhe))
    }, [maxÖffnungsBreite, maxÖffnungsHöhe])

    const handleUpdate = () => {
        if (selectedObject) {
            const sichereBreite = clampValue(öffnungsBreite, 1, maxÖffnungsBreite)
            const sichereHöhe = clampValue(öffnungsHöhe, 1, maxÖffnungsHöhe)
            setObjs(objs => objs.map(obj => 
                obj.id === selectedObject.id 
                    ? { ...obj, value: [sichereBreite * internerMaßstab, sichereHöhe * internerMaßstab], posSegment }
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


    // Muss noch gefixt werden SEHR WICHTIG
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
            padding: "15px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            zIndex: 999,
        }}>
            <div style={{
                margin: "8px",
                paddingBottom: "4px",
                borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
            }}>
                <p className='text' style={{ fontSize: 17 }}>
                    Leeröffnung Anpassen
                </p>
            </div>

            

            <div style={{ margin: '15px', marginTop: '12px', marginRight: '12px' }}>
                <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Abmessungen:</p>

                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    marginBottom: "12px", 
                    justifyContent: 'space-between', 
                    marginRight: "15px"
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className='text' style={{ fontWeight: 200}}>Breite</span>
                        <span className='text' style={{ fontSize: 12}}>1-{maxÖffnungsBreite}</span>
                    </div>
                    <MuiNumberfield 
                        label={'m'} 
                        min={1} 
                        max={maxÖffnungsBreite} 
                        state={öffnungsBreite} 
                        setState={(value) => setÖffnungsBreite(value)} 
                    />
                </div>

                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    marginBottom: "20px", 
                    justifyContent: 'space-between', 
                    marginRight: "15px"
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className='text' style={{ fontWeight: 200 }}>Höhe</span>
                        <span className='text' style={{ fontSize: 12 }}>1-{maxÖffnungsHöhe}</span>
                    </div>
                    <MuiNumberfield 
                        label={'m'} 
                        min={1} 
                        max={maxÖffnungsHöhe} 
                        state={öffnungsHöhe} 
                        setState={(value) => setÖffnungsHöhe(value)} 
                    />
                </div>

                {/* <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Position im Segment:</p>
                
                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    alignItems: 'center', 
                    marginBottom: "12px", 
                    justifyContent: 'space-between', 
                    marginRight: "15px",
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
                
                {/* Buttons */}
                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    justifyContent: 'space-between',
                    marginTop: '20px'
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
                    marginTop: '12px'
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
