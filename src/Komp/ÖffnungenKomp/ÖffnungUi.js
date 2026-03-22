import { useState } from "react"
import MuiTextfeld from "../MuiTextfeld"
import MuiNumberfield from "../MuiNumberfield"
import MuiSelect from "../MuiSelect"
import { ENABLE_WANDFENSTER_ABSTAND_FEATURE } from "../../featureFlags"


export default function ÖffnungUi({ 
    wand, 
    lang = true, 
    rechts = true,
    addObj, 
    setEditMenü, 
    newId, 
    setNewId, 
    clickedButtonPos,
    gebäudeBreite,
    gebäudeLänge,
    gebäudeHöhe,
    dachArt = 'satteldach',
    dachneigung = 0
}) {
    const getLaderampeStartLängeByTyp = (typ) => {
        if (typ === 'laderaum') return 1
        if (typ === 'verladehütte') return 4
        return 3
    }


    // Arbeits - State:
    const [öffnungsName, setÖffnungsName] = useState('Neues Objekt')
    const [selectedType, setSelectedType] = useState('')
    const [öffnungsBreite, setÖffnungsBreite] = useState(12)
    const [öffnungsHöhe, setÖffnungsHöhe] = useState(3)

    // Fenster-UI State
    const [fensterBreite, setFensterBreite] = useState(4.1)
    const [fensterHöhe, setFensterHöhe] = useState(2.95)
    const [fensterPosSegment, setFensterPosSegment] = useState('mittig')
    const [reflektor, setReflektor] = useState('keine')
    const [sprossenX, setSprossenX] = useState(0)
    const [sprossenY, setSprossenY] = useState(0)
    const [fensterFarbe, setFensterFarbe] = useState('Weiß')
    const [reflektorFarbe, setReflektorFarbe] = useState('Weiß')
    const [fensterAbstandRechts, setFensterAbstandRechts] = useState(0)
    const [fensterAbstandUnten, setFensterAbstandUnten] = useState(0)

    // Tür-UI State
    const [türBreite, setTürBreite] = useState(0.95)
    const [türHöhe, setTürHöhe] = useState(2.05)
    const [türPosSegment, setTürPosSegment] = useState('mittig')
    const [doppeltür, setDoppeltür] = useState('nein')
    const [öffnet, setÖffnet] = useState('innen')
    const [orientierung, setOrientierung] = useState('links')
    const [türReflektor, setTürReflektor] = useState('keine')
    const [türFarbe, setTürFarbe] = useState('Weiß')
    const [türFüllFarbe, setTürFüllFarbe] = useState('Weiß')
    const [türFüllFarbeInnen, setTürFüllFarbeInnen] = useState('Weiß')

    // Sektionaltor-UI State
    const [sektionalTorBreite, setSektionalTorBreite] = useState(3)
    const [sektionalTorHöhe, setSektionalTorHöhe] = useState(3)
    const [sektionalTorPosSegment, setSektionalTorPosSegment] = useState('mittig')
    const [transparenteFüllung, setTransparenteFüllung] = useState('nein')
    const [transparentePaneele, setTransparentePaneele] = useState('1,2,3,4')
    const [fensterstreifenHöhe, setFensterstreifenHöhe] = useState(0.60)
    const [sektionalTorReflektor, setSektionalTorReflektor] = useState('keine')
    const [schlupftür, setSchlupftür] = useState('nein')
    const [schlupftürBreite, setSchlupftürBreite] = useState(1)
    const [schlupftürHöhe, setSchlupftürHöhe] = useState(2)
    const [schlupftürDistanzX, setSchlupftürDistanzX] = useState(0)
    const [schlupftürOrientierung, setSchlupftürOrientierung] = useState('rechts')
    const [sektionalTorFarbe, setSektionalTorFarbe] = useState('Weiß')
    const [sektionalTorFüllFarbe, setSektionalTorFüllFarbe] = useState('Grau')
    const [sektionalTorFüllFarbeInnen, setSektionalTorFüllFarbeInnen] = useState('Weiß')
    const [sektionalTorReflektorFarbe, setSektionalTorReflektorFarbe] = useState('Weiß')

    // Schiebetür-UI State
    const [schiebetürBreite, setSchiebetürBreite] = useState(3)
    const [schiebetürHöhe, setSchiebetürHöhe] = useState(3)
    const [schiebetürPosSegment, setSchiebetürPosSegment] = useState('mittig')
    const [schiebetürÖffnet, setSchiebetürÖffnet] = useState('außen')
    const [schiebeseite, setSchiebeseite] = useState('beide')
    const [schiebetürSchlupftür, setSchiebetürSchlupftür] = useState('nein')
    const [schiebetürSchlupftürBreite, setSchiebetürSchlupftürBreite] = useState(1)
    const [schiebetürSchlupftürHöhe, setSchiebetürSchlupftürHöhe] = useState(2)
    const [schiebetürSchlupftürDistanz, setSchiebetürSchlupftürDistanz] = useState(0.50)
    const [schiebetürSchlupftürTransparent, setSchiebetürSchlupftürTransparent] = useState('nein')
    const [schiebetürSchlupftürOrientierung, setSchiebetürSchlupftürOrientierung] = useState('rechts')
    const [schiebetürReflektor, setSchiebetürReflektor] = useState('keine')
    const [schiebetürSchienenFarbe, setSchiebetürSchienenFarbe] = useState('Grau')
    const [schiebetürFüllFarbe, setSchiebetürFüllFarbe] = useState('Weiß')

    // Rolltor-UI State
    const [rolltorBreite, setRolltorBreite] = useState(3)
    const [rolltorHöhe, setRolltorHöhe] = useState(3)
    const [rolltorPosSegment, setRolltorPosSegment] = useState('mittig')
    const [rolltorÖffnet, setRolltorÖffnet] = useState('innen')
    const [rolltorReflektor, setRolltorReflektor] = useState('keine')
    const [rolltorMotor, setRolltorMotor] = useState('rechts')
    const [rolltorFarbe, setRolltorFarbe] = useState('Weiß')
    const [rolltorFüllFarbe, setRolltorFüllFarbe] = useState('Weiß')

    // Transparentes Paneel-UI State
    const [transparentesPaneelBreite, setTransparentesPaneelBreite] = useState(3)
    const [transparentesPaneelHöhe, setTransparentesPaneelHöhe] = useState(3)
    const [transparentesPaneelPosSegment, setTransparentesPaneelPosSegment] = useState('mittig')

    // Laderampe-UI State
    const [laderampeBreite, setLaderampeBreite] = useState(3.5)
    const [laderampeHöhe, setLaderampeHöhe] = useState(4.5)
    const [laderampeLänge, setLaderampeLänge] = useState(getLaderampeStartLängeByTyp('ladehaus'))
    const [laderampeRampenhöhe, setLaderampeRampenhöhe] = useState(0.8)
    const [laderampePosSegment, setLaderampePosSegment] = useState('mittig')
    const [laderampeTyp, setLaderampeTyp] = useState('ladehaus')
    const [laderampeTransparenteFüllung, setLaderampeTransparenteFüllung] = useState('nein')
    const [laderampeTransparentePaneele, setLaderampeTransparentePaneele] = useState('1,2,3')
    const [laderampeFensterstreifenHöhe, setLaderampeFensterstreifenHöhe] = useState(0.60)
    const [laderampeReflektor, setLaderampeReflektor] = useState('keine')
    const [laderampeSchlupftür, setLaderampeSchlupftür] = useState('nein')
    const [laderampeSchlupftürBreite, setLaderampeSchlupftürBreite] = useState(1)
    const [laderampeSchlupftürHöhe, setLaderampeSchlupftürHöhe] = useState(2)
    const [laderampeSchlupftürDistanzX, setLaderampeSchlupftürDistanzX] = useState(1)
    const [laderampeSchlupftürOrientierung, setLaderampeSchlupftürOrientierung] = useState('rechts')
    const [laderampeFarbe, setLaderampeFarbe] = useState('Weiß')
    const [laderampeFüllFarbe, setLaderampeFüllFarbe] = useState('Weiß')
    const [laderampeVerkleidungFarbe, setLaderampeVerkleidungFarbe] = useState('Weiß')

    const handleLaderampeTypChange = (newTyp) => {
        setLaderampeTyp(newTyp)
        setLaderampeLänge(getLaderampeStartLängeByTyp(newTyp))
    }

    // Klein Lichtkuppel-UI State
    const [kleinLichtkuppelBreiteX, setKleinLichtkuppelBreiteX] = useState(1)
    const [kleinLichtkuppelBreiteY, setKleinLichtkuppelBreiteY] = useState(1)
    const [kleinLichtkuppelPosSegment, setKleinLichtkuppelPosSegment] = useState('mittig')
    const [kleinLichtkuppelDistanzX, setKleinLichtkuppelDistanzX] = useState(0.60)
    const [kleinLichtkuppelHorizontaleAusrichtung, setKleinLichtkuppelHorizontaleAusrichtung] = useState('mittig')
    const [kleinLichtkuppelDistanzY, setKleinLichtkuppelDistanzY] = useState(0)
    const [kleinLichtkuppelFarbe, setKleinLichtkuppelFarbe] = useState('Weiß')

    const [wandBilder] = useState([
        '/Öffnungen/Fenster.png',
        '/Öffnungen/Leeröffnung.png',
        '/Öffnungen/Tür.png',
        '/Öffnungen/SektionalTor.png',
        '/Öffnungen/SchiebeTor.png',
        '/Öffnungen/RollTor.png',
        '/Öffnungen/TransparentesPaneel.png',
        '/Öffnungen/Laderampe.png'
    ])

    const [dachBilder] = useState([
        '/Öffnungen/Leeröffnung.png',
        '/Öffnungen/TransparentesPaneel.png',
        '/Öffnungen/KleinLichtkuppel.png'
    ])

    const [dachTitel] = useState([
        'Hinzufügen Leeröffnung',
        'Hinzufügen Transparentes Paneel',
        'Hinzufügen Klein Lichtkuppel'
    ])

    const [bildTitel] = useState([
        'Hinzufügen Fenster',
        'Hinzufügen Leeröffnung',
        'Hinzufügen Tür',
        'Hinzufügen Sektionaltor',
        'Hinzufügen Schiebetür',
        'Hinzufügen Rolltor',
        'Hinzufügen Transparentes Paneel',
        'Hinzufügen Laderampe'
    ])

    const maxLeeröffnungBreite = wand === false ? gebäudeLänge : (lang ? gebäudeLänge : gebäudeBreite)
    const pultdachZusatz = (wand && lang && !rechts && dachArt === 'pultdach') ? (Number(dachneigung) || 0) : 0
    const maxLeeröffnungHöhe = wand === false ? Math.floor(gebäudeBreite / 2) : (gebäudeHöhe + pultdachZusatz)
    const maxFensterBreite = lang ? gebäudeLänge : gebäudeBreite
    const maxFensterHöhe = gebäudeHöhe
    const maxFensterAbstandRechts = Math.max(0, maxFensterBreite - fensterBreite)
    const maxFensterAbstandUnten = Math.max(0, maxFensterHöhe - fensterHöhe)
    const maxTürBreite = lang ? gebäudeLänge : gebäudeBreite
    const maxTürHöhe = gebäudeHöhe
    const maxSektionalTorBreite = lang ? gebäudeLänge : gebäudeBreite
    const maxSektionalTorHöhe = gebäudeHöhe
    const maxSchiebetürBreite = lang ? gebäudeLänge : gebäudeBreite
    const maxSchiebetürHöhe = gebäudeHöhe
    const maxRolltorBreite = lang ? gebäudeLänge : gebäudeBreite
    const maxRolltorHöhe = gebäudeHöhe
    const maxLaderampeBreite = lang ? gebäudeLänge : gebäudeBreite
    const maxLaderampeRampenhöhe = Math.max(0, gebäudeHöhe - 0.2)
    const begrenzteLaderampeRampenhöhe = Math.min(Math.max(Number(laderampeRampenhöhe) || 0, 0), maxLaderampeRampenhöhe)
    const maxLaderampeHöhe = Math.max(0.2, gebäudeHöhe - begrenzteLaderampeRampenhöhe)
    const maxTransparentesPaneelBreite = wand === false ? gebäudeLänge : (lang ? gebäudeLänge : gebäudeBreite)
    const maxTransparentesPaneelHöhe = wand === false ? Math.floor(gebäudeBreite / 2) : gebäudeHöhe
    const maxKleinLichtkuppelBreiteX = gebäudeLänge
    const maxKleinLichtkuppelBreiteY = Math.floor(gebäudeBreite / 2)

    return(
        <>
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
                width: 360,
                maxHeight: 'calc(100vh - 470px)',
                overflowY: 'auto',
                overflowX: 'hidden',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'thin',
                border: "1px solid rgba(255, 255, 255, 0.2)",
                zIndex: 999,
            }}>
                {selectedType === '' ? (
                    // Öffnungsauswahl-Ansicht
                    <>
                        <div style={{
                            margin: "8px",
                            paddingBottom: "4px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                        }}>
                            <p className='text' style={{ fontSize: 17 }}>
                                Neue Öffnung
                            </p>
                        </div>

                        <div style={{ margin: '4px'}}>
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "6px", 
                                justifyContent: 'space-between', 
                                marginRight: "10px",
                                marginLeft: '4px',
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className='text' style={{ fontWeight: 200}}>Name</span>
                                </div>
                                <MuiTextfeld
                                label={'Name'}
                                state={öffnungsName}
                                setState={setÖffnungsName}
                                />
                            </div>

                            {/* Bildplätze */}
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1fr 1fr', 
                                gap: '8px',
                                marginTop: '10px',
                                marginRight: "6px",
                                marginLeft: '6px'
                            }}>
                                {[...Array(wand ? 8 : 3)].map((_, index) => (
                                    <div 
                                        key={index}
                                        style={{
                                            width: '100%',
                                            height: '75px',
                                            backgroundColor: 'rgba(255, 255, 255, 1)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                        onClick={() => {
                                            if (wand && index === 0) setSelectedType('fenster')
                                            else if (wand && index === 1) setSelectedType('leeröffnung')
                                            else if (wand && index === 2) setSelectedType('tür')
                                            else if (wand && index === 3) setSelectedType('sektionaltor')
                                            else if (wand && index === 4) setSelectedType('schiebetür')
                                            else if (wand && index === 5) setSelectedType('rolltor')
                                            else if (wand && index === 6) setSelectedType('transparentespaneel')
                                            else if (wand && index === 7) setSelectedType('laderampe')
                                            else if (!wand && index === 0) setSelectedType('leeröffnung')
                                            else if (!wand && index === 1) setSelectedType('transparentespaneel')
                                            else if (!wand && index === 2) setSelectedType('kleinlichtskuppel')
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(200, 200, 200, 0.3)'
                                            e.currentTarget.style.transform = 'scale(1.05)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)'
                                            e.currentTarget.style.transform = 'scale(1)'
                                        }}
                                    >
                                        {wandBilder[index] ? (
                                            <img 
                                                src={wand ? wandBilder[index] : dachBilder[index]} 
                                                alt={`Bild ${index + 1}`}
                                                title={wand ? bildTitel[index] : dachTitel[index]}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    borderRadius: '8px',
                                                    padding: '5px'
                                                }}
                                            />
                                        ) : (
                                            <span className='text' style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.5)' }}>
                                                Bild {index + 1}
                                            </span>
                                        )}
                                    </div>
                                ))}

                            </div>
                        </div>
                    </>
                ) : selectedType === 'fenster' ? (
                    // Fenster UI
                    <>
                        <div style={{
                            margin: "8px",
                            paddingBottom: "4px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                        }}>
                            <p className='text' style={{ fontSize: 17 }}>
                                Fenster
                            </p>
                        </div>

                        <div style={{ margin: '10px', marginTop: '8px' }}>
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
                                    state={fensterPosSegment}
                                    setState={setFensterPosSegment}
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

                            {ENABLE_WANDFENSTER_ABSTAND_FEATURE && (
                                <>
                                    <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Position:</p>

                                    <div style={{ 
                                        display: 'flex', 
                                        gap: '10px', 
                                        alignItems: 'center', 
                                        marginBottom: "10px", 
                                        justifyContent: 'space-between', 
                                        marginRight: "10px"
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className='text' style={{ fontWeight: 200}}>Abstand Rechts</span>
                                            <span className='text' style={{ fontSize: 12}}>0-{maxFensterAbstandRechts.toFixed(2)}</span>
                                        </div>
                                        <MuiNumberfield 
                                            label={'m'} 
                                            min={0} 
                                            max={maxFensterAbstandRechts} 
                                            state={fensterAbstandRechts} 
                                            setState={setFensterAbstandRechts} 
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
                                            <span className='text' style={{ fontWeight: 200}}>Abstand Unten</span>
                                            <span className='text' style={{ fontSize: 12}}>0-{maxFensterAbstandUnten.toFixed(2)}</span>
                                        </div>
                                        <MuiNumberfield 
                                            label={'m'} 
                                            min={0} 
                                            max={maxFensterAbstandUnten} 
                                            state={fensterAbstandUnten} 
                                            setState={setFensterAbstandUnten} 
                                        />
                                    </div>
                                </>
                            )}

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
                                marginTop: '6px'
                            }}>
                                <button
                                    onClick={() => setSelectedType('')}
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
                                    Zurück
                                </button>
                                <button
                                    onClick={() => {
                                        addObj([fensterBreite, fensterHöhe], 'fenster', newId, rechts, clickedButtonPos, lang, {
                                            posSegment: fensterPosSegment,
                                            reflektor,
                                            sprossenX,
                                            sprossenY,
                                            fensterFarbe,
                                            reflektorFarbe,
                                            ...(ENABLE_WANDFENSTER_ABSTAND_FEATURE
                                                ? {
                                                    abstandRechts: Math.max(0, Math.min(fensterAbstandRechts, maxFensterAbstandRechts)),
                                                    abstandUnten: Math.max(0, Math.min(fensterAbstandUnten, maxFensterAbstandUnten))
                                                }
                                                : {})
                                        })
                                        setNewId(id => id + 1)
                                        setSelectedType('')
                                        setEditMenü('Felder')
                                    }}
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
                                    Hinzufügen
                                </button>
                            </div>
                        </div>
                    </>
                ) : selectedType === 'tür' ? (
                    // Tür-Eigenschaften
                    <>
                        <div style={{
                            margin: "8px",
                            paddingBottom: "4px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                        }}>
                            <p className='text' style={{ fontSize: 17 }}>
                                Tür
                            </p>
                        </div>

                        <div style={{ margin: '10px', marginTop: '8px' }}>
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
                                    state={türPosSegment}
                                    setState={setTürPosSegment}
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

                            <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Eigenschaften:</p>

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
                                    option3={'Schiebetor'}
                                    value3={'schiebetor'}
                                    label={'Doppeltür'}
                                    state={doppeltür}
                                    setState={setDoppeltür}
                                />
                            </div>

                            {doppeltür !== 'schiebetor' && (
                                <>
                                    <div style={{ 
                                        display: 'flex', 
                                        gap: '10px', 
                                        alignItems: 'center', 
                                        marginBottom: "10px", 
                                        justifyContent: 'space-between', 
                                        marginRight: "10px",
                                    }}>
                                        <span className='text' style={{ fontWeight: 200 }}>Öffnet</span>
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
                                        marginBottom: "14px", 
                                        justifyContent: 'space-between', 
                                        marginRight: "10px",
                                    }}>
                                        <span className='text' style={{ fontWeight: 200 }}>Orientierung</span>
                                        <MuiSelect
                                            option1={'Links'}
                                            value1={'links'}
                                            option2={'Rechts'}
                                            value2={'rechts'}
                                            label={'Orientierung'}
                                            state={orientierung}
                                            setState={setOrientierung}
                                        />
                                    </div>
                                </>
                            )}

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
                                <span className='text' style={{ fontWeight: 200 }}>Farbe des Artikels</span>
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
                                <span className='text' style={{ fontWeight: 200 }}>Füllfarbe</span>
                                <MuiSelect
                                    option1={'Weiß'}
                                    value1={'Weiß'}
                                    option2={'Grau'}
                                    value2={'Grau'}
                                    option3={'Schwarz'}
                                    value3={'Schwarz'}
                                    label={'Füllfarbe'}
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
                                <span className='text' style={{ fontWeight: 200 }}>Füllfarbe (innen)</span>
                                <MuiSelect
                                    option1={'Weiß'}
                                    value1={'Weiß'}
                                    option2={'Grau'}
                                    value2={'Grau'}
                                    option3={'Schwarz'}
                                    value3={'Schwarz'}
                                    label={'Füllfarbe innen'}
                                    state={türFüllFarbeInnen}
                                    setState={setTürFüllFarbeInnen}
                                />
                            </div>

                            {/* Buttons */}
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                justifyContent: 'space-between',
                                marginTop: '6px'
                            }}>
                                <button
                                    onClick={() => setSelectedType('')}
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
                                    Zurück
                                </button>
                                <button
                                    onClick={() => {
                                        addObj([türBreite, türHöhe], 'tür-öffnung', newId, rechts, clickedButtonPos, lang, {
                                            posSegment: türPosSegment,
                                            doppeltür,
                                            öffnet,
                                            orientierung,
                                            türReflektor,
                                            türFarbe,
                                            türFüllFarbe,
                                            türFüllFarbeInnen
                                        })
                                        setNewId(id => id + 1)
                                        setSelectedType('')
                                        setEditMenü('Felder')
                                    }}
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
                                    Hinzufügen
                                </button>
                            </div>
                        </div>
                    </>
                ) : selectedType === 'sektionaltor' ? (
                    // Sektionaltor-Eigenschaften
                    <>
                        <div style={{
                            margin: "8px",
                            paddingBottom: "4px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                        }}>
                            <p className='text' style={{ fontSize: 17 }}>
                                Sektionaltor
                            </p>
                        </div>

                        <div style={{ margin: '10px', marginTop: '8px' }}>
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
                                    state={sektionalTorPosSegment}
                                    setState={setSektionalTorPosSegment}
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
                                    <span className='text' style={{ fontSize: 12}}>0.2-{maxSektionalTorBreite}</span>
                                </div>
                                <MuiNumberfield 
                                    label={'m'} 
                                    min={0.2} 
                                    max={maxSektionalTorBreite} 
                                    state={sektionalTorBreite} 
                                    setState={setSektionalTorBreite} 
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
                                    <span className='text' style={{ fontSize: 12}}>0.2-{maxSektionalTorHöhe}</span>
                                </div>
                                <MuiNumberfield 
                                    label={'m'} 
                                    min={0.2} 
                                    max={maxSektionalTorHöhe} 
                                    state={sektionalTorHöhe} 
                                    setState={setSektionalTorHöhe} 
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
                                <span className='text' style={{ fontWeight: 200 }}>Transparente Füllung</span>
                                <MuiSelect
                                    option1={'Nein'}
                                    value1={'nein'}
                                    option2={'Ja'}
                                    value2={'ja'}
                                    label={'Transparente Füllung'}
                                    state={transparenteFüllung}
                                    setState={setTransparenteFüllung}
                                />
                            </div>

                            {transparenteFüllung === 'ja' && (
                                <>
                                    <div style={{ 
                                        display: 'flex', 
                                        gap: '10px', 
                                        alignItems: 'center', 
                                        marginBottom: "10px", 
                                        justifyContent: 'space-between', 
                                        marginRight: "10px"
                                    }}>
                                        <span className='text' style={{ fontWeight: 200 }}>Transparente Paneele</span>
                                        <MuiTextfeld
                                            label={'z.B. "1,2,3,4"'}
                                            state={transparentePaneele}
                                            setState={setTransparentePaneele}
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
                                        <span className='text' style={{ fontWeight: 200 }}>Fensterstreifen-Höhe</span>
                                        <MuiNumberfield 
                                            label={'m'} 
                                            min={0.1} 
                                            max={5} 
                                            state={fensterstreifenHöhe} 
                                            setState={setFensterstreifenHöhe} 
                                        />
                                    </div>
                                </>
                            )}

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
                                    state={sektionalTorReflektor}
                                    setState={setSektionalTorReflektor}
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
                                <span className='text' style={{ fontWeight: 200 }}>Schlupftür</span>
                                <MuiSelect
                                    option1={'Nein'}
                                    value1={'nein'}
                                    option2={'Ja'}
                                    value2={'ja'}
                                    label={'Schlupftür'}
                                    state={schlupftür}
                                    setState={setSchlupftür}
                                />
                            </div>

                            {schlupftür === 'ja' && (
                                <>
                                    <p className='text' style={{ fontSize: 12, marginBottom: "6px", fontWeight: 300 }}>Schlupftür Eigenschaften:</p>

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
                                            <span className='text' style={{ fontSize: 12}}>0.2-{maxSektionalTorBreite}</span>
                                        </div>
                                        <MuiNumberfield 
                                            label={'m'} 
                                            min={0.2} 
                                            max={maxSektionalTorBreite} 
                                            state={schlupftürBreite} 
                                            setState={setSchlupftürBreite} 
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
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className='text' style={{ fontWeight: 200}}>Höhe</span>
                                            <span className='text' style={{ fontSize: 12}}>0.2-{maxSektionalTorHöhe}</span>
                                        </div>
                                        <MuiNumberfield 
                                            label={'m'} 
                                            min={0.2} 
                                            max={maxSektionalTorHöhe} 
                                            state={schlupftürHöhe} 
                                            setState={setSchlupftürHöhe} 
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
                                        <span className='text' style={{ fontWeight: 200 }}>Distanz +X</span>
                                        <MuiNumberfield 
                                            label={'m'} 
                                            min={0} 
                                            max={maxSektionalTorBreite} 
                                            state={schlupftürDistanzX} 
                                            setState={setSchlupftürDistanzX} 
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
                                        <span className='text' style={{ fontWeight: 200 }}>Orientierung</span>
                                        <MuiSelect
                                            option1={'Rechts'}
                                            value1={'rechts'}
                                            option2={'Links'}
                                            value2={'links'}
                                            label={'Orientierung'}
                                            state={schlupftürOrientierung}
                                            setState={setSchlupftürOrientierung}
                                        />
                                    </div>
                                </>
                            )}

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
                                    state={sektionalTorFarbe}
                                    setState={setSektionalTorFarbe}
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
                                <span className='text' style={{ fontWeight: 200 }}>Füllfarbe</span>
                                <MuiSelect
                                    option1={'Weiß'}
                                    value1={'Weiß'}
                                    option2={'Grau'}
                                    value2={'Grau'}
                                    option3={'Schwarz'}
                                    value3={'Schwarz'}
                                    label={'Füllfarbe'}
                                    state={sektionalTorFüllFarbe}
                                    setState={setSektionalTorFüllFarbe}
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
                                <span className='text' style={{ fontWeight: 200 }}>Füllfarbe (innen)</span>
                                <MuiSelect
                                    option1={'Weiß'}
                                    value1={'Weiß'}
                                    option2={'Grau'}
                                    value2={'Grau'}
                                    option3={'Schwarz'}
                                    value3={'Schwarz'}
                                    label={'Füllfarbe innen'}
                                    state={sektionalTorFüllFarbeInnen}
                                    setState={setSektionalTorFüllFarbeInnen}
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
                                <span className='text' style={{ fontWeight: 200 }}>Farbe des Reflektors</span>
                                <MuiSelect
                                    option1={'Weiß'}
                                    value1={'Weiß'}
                                    option2={'Grau'}
                                    value2={'Grau'}
                                    option3={'Schwarz'}
                                    value3={'Schwarz'}
                                    label={'Reflektor'}
                                    state={sektionalTorReflektorFarbe}
                                    setState={setSektionalTorReflektorFarbe}
                                />
                            </div>

                            {/* Buttons */}
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                justifyContent: 'space-between',
                                marginTop: '6px'
                            }}>
                                <button
                                    onClick={() => setSelectedType('')}
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
                                    Zurück
                                </button>
                                <button
                                    onClick={() => {
                                        addObj([sektionalTorBreite, sektionalTorHöhe], 'sektionaltor', newId, rechts, clickedButtonPos, lang, {
                                            posSegment: sektionalTorPosSegment,
                                            transparenteFüllung,
                                            transparentePaneele: transparenteFüllung === 'ja' ? transparentePaneele : null,
                                            fensterstreifenHöhe: transparenteFüllung === 'ja' ? fensterstreifenHöhe : null,
                                            reflektor: sektionalTorReflektor,
                                            schlupftür,
                                            schlupftürBreite: schlupftür === 'ja' ? schlupftürBreite : null,
                                            schlupftürHöhe: schlupftür === 'ja' ? schlupftürHöhe : null,
                                            schlupftürDistanzX: schlupftür === 'ja' ? schlupftürDistanzX : null,
                                            schlupftürOrientierung: schlupftür === 'ja' ? schlupftürOrientierung : null,
                                            sektionalTorFarbe,
                                            sektionalTorFüllFarbe,
                                            sektionalTorFüllFarbeInnen,
                                            sektionalTorReflektorFarbe
                                        })
                                        setNewId(id => id + 1)
                                        setSelectedType('')
                                        setEditMenü('Felder')
                                    }}
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
                                    Hinzufügen
                                </button>
                            </div>
                        </div>
                    </>
                ) : selectedType === 'schiebetür' ? (
                    // Schiebetür-Eigenschaften
                    <>
                        <div style={{
                            margin: "8px",
                            paddingBottom: "4px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                        }}>
                            <p className='text' style={{ fontSize: 17 }}>
                                Schiebetür
                            </p>
                        </div>

                        <div style={{ margin: '10px', marginTop: '8px' }}>
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
                                    state={schiebetürPosSegment}
                                    setState={setSchiebetürPosSegment}
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
                                    <span className='text' style={{ fontSize: 12}}>0.2-{maxSchiebetürBreite}</span>
                                </div>
                                <MuiNumberfield 
                                    label={'m'} 
                                    min={0.2} 
                                    max={maxSchiebetürBreite} 
                                    state={schiebetürBreite} 
                                    setState={setSchiebetürBreite} 
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
                                    <span className='text' style={{ fontSize: 12}}>0.2-{maxSchiebetürHöhe}</span>
                                </div>
                                <MuiNumberfield 
                                    label={'m'} 
                                    min={0.2} 
                                    max={maxSchiebetürHöhe} 
                                    state={schiebetürHöhe} 
                                    setState={setSchiebetürHöhe} 
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
                                <span className='text' style={{ fontWeight: 200 }}>Öffnet</span>
                                <MuiSelect
                                    option1={'Innen'}
                                    value1={'innen'}
                                    option2={'Außen'}
                                    value2={'außen'}
                                    label={'Öffnet'}
                                    state={schiebetürÖffnet}
                                    setState={setSchiebetürÖffnet}
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
                                <span className='text' style={{ fontWeight: 200 }}>Schiebeseite</span>
                                <MuiSelect
                                    option1={'Beide'}
                                    value1={'beide'}
                                    option2={'Links'}
                                    value2={'links'}
                                    option3={'Rechts'}
                                    value3={'rechts'}
                                    label={'Schiebeseite'}
                                    state={schiebeseite}
                                    setState={setSchiebeseite}
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
                                <span className='text' style={{ fontWeight: 200 }}>Schlupftür</span>
                                <MuiSelect
                                    option1={'Nein'}
                                    value1={'nein'}
                                    option2={'Ja'}
                                    value2={'ja'}
                                    label={'Schlupftür'}
                                    state={schiebetürSchlupftür}
                                    setState={setSchiebetürSchlupftür}
                                />
                            </div>

                            {/* {schiebetürSchlupftür === 'ja' && (
                                <>
                                    <p className='text' style={{ fontSize: 12, marginBottom: "6px", fontWeight: 300 }}>Schlupftür Eigenschaften:</p>

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
                                            <span className='text' style={{ fontSize: 12}}>0.2-{maxSchiebetürBreite}</span>
                                        </div>
                                        <MuiNumberfield 
                                            label={'m'} 
                                            min={0.2} 
                                            max={maxSchiebetürBreite} 
                                            state={schiebetürSchlupftürBreite} 
                                            setState={setSchiebetürSchlupftürBreite} 
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
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className='text' style={{ fontWeight: 200}}>Höhe</span>
                                            <span className='text' style={{ fontSize: 12}}>0.2-{maxSchiebetürHöhe}</span>
                                        </div>
                                        <MuiNumberfield 
                                            label={'m'} 
                                            min={0.2} 
                                            max={maxSchiebetürHöhe} 
                                            state={schiebetürSchlupftürHöhe} 
                                            setState={setSchiebetürSchlupftürHöhe} 
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
                                        <span className='text' style={{ fontWeight: 200 }}>Distanz</span>
                                        <MuiNumberfield 
                                            label={'m'} 
                                            min={0} 
                                            max={maxSchiebetürBreite} 
                                            state={schiebetürSchlupftürDistanz} 
                                            setState={setSchiebetürSchlupftürDistanz} 
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
                                        <span className='text' style={{ fontWeight: 200 }}>Transparente Füllung</span>
                                        <MuiSelect
                                            option1={'Nein'}
                                            value1={'nein'}
                                            option2={'Ja'}
                                            value2={'ja'}
                                            label={'Transparente Füllung'}
                                            state={schiebetürSchlupftürTransparent}
                                            setState={setSchiebetürSchlupftürTransparent}
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
                                        <span className='text' style={{ fontWeight: 200 }}>Orientierung</span>
                                        <MuiSelect
                                            option1={'Rechts'}
                                            value1={'rechts'}
                                            option2={'Links'}
                                            value2={'links'}
                                            label={'Orientierung'}
                                            state={schiebetürSchlupftürOrientierung}
                                            setState={setSchiebetürSchlupftürOrientierung}
                                        />
                                    </div>
                                </>
                            )} */}

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
                                    state={schiebetürReflektor}
                                    setState={setSchiebetürReflektor}
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
                                <span className='text' style={{ fontWeight: 200 }}>Schienenfarbe</span>
                                <MuiSelect
                                    option1={'Weiß'}
                                    value1={'Weiß'}
                                    option2={'Grau'}
                                    value2={'Grau'}
                                    option3={'Schwarz'}
                                    value3={'Schwarz'}
                                    label={'Schienenfarbe'}
                                    state={schiebetürSchienenFarbe}
                                    setState={setSchiebetürSchienenFarbe}
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
                                <span className='text' style={{ fontWeight: 200 }}>Füllfarbe</span>
                                <MuiSelect
                                    option1={'Weiß'}
                                    value1={'Weiß'}
                                    option2={'Grau'}
                                    value2={'Grau'}
                                    option3={'Schwarz'}
                                    value3={'Schwarz'}
                                    label={'Füllfarbe'}
                                    state={schiebetürFüllFarbe}
                                    setState={setSchiebetürFüllFarbe}
                                />
                            </div>

                            {/* Buttons */}
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                justifyContent: 'space-between',
                                marginTop: '6px'
                            }}>
                                <button
                                    onClick={() => setSelectedType('')}
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
                                    Zurück
                                </button>
                                <button
                                    onClick={() => {
                                        addObj([schiebetürBreite, schiebetürHöhe], 'schiebetür', newId, rechts, clickedButtonPos, lang, {
                                            posSegment: schiebetürPosSegment,
                                            öffnet: schiebetürÖffnet,
                                            schiebeseite,
                                            schlupftür: schiebetürSchlupftür,
                                            schlupftürBreite: schiebetürSchlupftür === 'ja' ? schiebetürSchlupftürBreite : null,
                                            schlupftürHöhe: schiebetürSchlupftür === 'ja' ? schiebetürSchlupftürHöhe : null,
                                            schlupftürDistanz: schiebetürSchlupftür === 'ja' ? schiebetürSchlupftürDistanz : null,
                                            schlupftürTransparent: schiebetürSchlupftür === 'ja' ? schiebetürSchlupftürTransparent : null,
                                            schlupftürOrientierung: schiebetürSchlupftür === 'ja' ? schiebetürSchlupftürOrientierung : null,
                                            reflektor: schiebetürReflektor,
                                            schiebetürSchienenFarbe: schiebetürSchienenFarbe,
                                            schiebetürFüllFarbe: schiebetürFüllFarbe,
                                            schiebetürFüllFarbeInnen: schiebetürFüllFarbe
                                        })
                                        setNewId(id => id + 1)
                                        setSelectedType('')
                                        setEditMenü('Felder')
                                    }}
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
                                    Hinzufügen
                                </button>
                            </div>
                        </div>
                    </>
                ) : selectedType === 'rolltor' ? (
                    // Rolltor-Eigenschaften
                    <>
                        <div style={{
                            margin: "8px",
                            paddingBottom: "4px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                        }}>
                            <p className='text' style={{ fontSize: 17 }}>
                                Rolltor
                            </p>
                        </div>

                        <div style={{ margin: '10px', marginTop: '8px' }}>
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
                                    state={rolltorPosSegment}
                                    setState={setRolltorPosSegment}
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
                                    <span className='text' style={{ fontSize: 12}}>0.2-{maxRolltorBreite}</span>
                                </div>
                                <MuiNumberfield 
                                    label={'m'} 
                                    min={0.2} 
                                    max={maxRolltorBreite} 
                                    state={rolltorBreite} 
                                    setState={setRolltorBreite} 
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
                                    <span className='text' style={{ fontSize: 12}}>0.2-{maxRolltorHöhe}</span>
                                </div>
                                <MuiNumberfield 
                                    label={'m'} 
                                    min={0.2} 
                                    max={maxRolltorHöhe} 
                                    state={rolltorHöhe} 
                                    setState={setRolltorHöhe} 
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
                                <span className='text' style={{ fontWeight: 200 }}>Öffnet</span>
                                <MuiSelect
                                    option1={'Innen'}
                                    value1={'innen'}
                                    option2={'Außen'}
                                    value2={'außen'}
                                    label={'Öffnet'}
                                    state={rolltorÖffnet}
                                    setState={setRolltorÖffnet}
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
                                <span className='text' style={{ fontWeight: 200 }}>Reflektor</span>
                                <MuiSelect
                                    option1={'Keine'}
                                    value1={'keine'}
                                    option2={'Klein'}
                                    value2={'klein'}
                                    option3={'Groß'}
                                    value3={'groß'}
                                    label={'Reflektor'}
                                    state={rolltorReflektor}
                                    setState={setRolltorReflektor}
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
                                <span className='text' style={{ fontWeight: 200 }}>Platzierung des Motors</span>
                                <MuiSelect
                                    option1={'Rechts'}
                                    value1={'rechts'}
                                    option2={'Links'}
                                    value2={'links'}
                                    label={'Motor'}
                                    state={rolltorMotor}
                                    setState={setRolltorMotor}
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
                                    state={rolltorFarbe}
                                    setState={setRolltorFarbe}
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
                                <span className='text' style={{ fontWeight: 200 }}>Füllfarbe</span>
                                <MuiSelect
                                    option1={'Weiß'}
                                    value1={'Weiß'}
                                    option2={'Grau'}
                                    value2={'Grau'}
                                    option3={'Schwarz'}
                                    value3={'Schwarz'}
                                    label={'Füllfarbe'}
                                    state={rolltorFüllFarbe}
                                    setState={setRolltorFüllFarbe}
                                />
                            </div>

                            {/* Buttons */}
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                justifyContent: 'space-between',
                                marginTop: '6px'
                            }}>
                                <button
                                    onClick={() => setSelectedType('')}
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
                                    Zurück
                                </button>
                                <button
                                    onClick={() => {
                                        addObj([rolltorBreite, rolltorHöhe], 'rolltor', newId, rechts, clickedButtonPos, lang, {
                                            posSegment: rolltorPosSegment,
                                            öffnet: rolltorÖffnet,
                                            reflektor: rolltorReflektor,
                                            motorPlatzierung: rolltorMotor,
                                            farbe: rolltorFarbe,
                                            füllFarbe: rolltorFüllFarbe
                                        })
                                        setNewId(id => id + 1)
                                        setSelectedType('')
                                        setEditMenü('Felder')
                                    }}
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
                                    Hinzufügen
                                </button>
                            </div>
                        </div>
                    </>
                ) : selectedType === 'transparentespaneel' ? (
                    // Transparentes Paneel
                    <>
                        <div style={{
                            margin: "8px",
                            paddingBottom: "4px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                        }}>
                            <p className='text' style={{ fontSize: 17 }}>
                                Transparentes Paneel
                            </p>
                        </div>

                        <div style={{ margin: '10px', marginTop: '8px' }}>
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
                                    state={transparentesPaneelPosSegment}
                                    setState={setTransparentesPaneelPosSegment}
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
                                    <span className='text' style={{ fontSize: 12}}>0.2-{maxTransparentesPaneelBreite}</span>
                                </div>
                                <MuiNumberfield 
                                    label={'m'} 
                                    min={0.2} 
                                    max={maxTransparentesPaneelBreite} 
                                    state={transparentesPaneelBreite} 
                                    setState={setTransparentesPaneelBreite} 
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
                                    <span className='text' style={{ fontSize: 12}}>0.2-{maxTransparentesPaneelHöhe}</span>
                                </div>
                                <MuiNumberfield 
                                    label={'m'} 
                                    min={0.2} 
                                    max={maxTransparentesPaneelHöhe} 
                                    state={transparentesPaneelHöhe} 
                                    setState={setTransparentesPaneelHöhe} 
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
                                    onClick={() => setSelectedType('')}
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
                                    Zurück
                                </button>
                                <button
                                    onClick={() => {
                                        addObj([transparentesPaneelBreite, transparentesPaneelHöhe], 'transparentespaneel', newId, rechts, clickedButtonPos, lang, {
                                            posSegment: transparentesPaneelPosSegment,
                                            vorne: clickedButtonPos?.vorne ?? true,
                                            bereich: wand ? 'wand' : 'dach'
                                        })
                                        setNewId(id => id + 1)
                                        setSelectedType('')
                                        setEditMenü('Felder')
                                    }}
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
                                    Hinzufügen
                                </button>
                            </div>
                        </div>
                    </>
                ) : selectedType === 'laderampe' ? (
                    // Laderampe-Eigenschaften
                    <>
                        <div style={{
                            margin: "8px",
                            paddingBottom: "4px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                        }}>
                            <p className='text' style={{ fontSize: 17 }}>
                                Laderampe
                            </p>
                        </div>

                        <div style={{ margin: '10px', marginTop: '8px' }}>
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
                                    state={laderampePosSegment}
                                    setState={setLaderampePosSegment}
                                />
                            </div> */}

                            <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Abmessungen:</p>

                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "10px", 
                                justifyContent: 'space-between', 
                                marginRight: "10px",
                            }}>
                                <span className='text' style={{ fontWeight: 200 }}>Typ</span>
                                <MuiSelect
                                    option1={'Ladehaus'}
                                    value1={'ladehaus'}
                                    option2={'Laderaum mechanisch'}
                                    value2={'laderaum'}
                                    option3={'Verladehütte aus Kunststoff'}
                                    value3={'verladehütte'}
                                    label={'Typ'}
                                    state={laderampeTyp}
                                    setState={handleLaderampeTypChange}
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
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className='text' style={{ fontWeight: 200}}>Breite</span>
                                    <span className='text' style={{ fontSize: 12}}>0.2-{maxLaderampeBreite}</span>
                                </div>
                                <MuiNumberfield 
                                    label={'m'} 
                                    min={0.2} 
                                    max={maxLaderampeBreite} 
                                    state={laderampeBreite} 
                                    setState={setLaderampeBreite} 
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
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className='text' style={{ fontWeight: 200}}>Höhe</span>
                                    <span className='text' style={{ fontSize: 12}}>0.2-{maxLaderampeHöhe}</span>
                                </div>
                                <MuiNumberfield 
                                    label={'m'} 
                                    min={0.2} 
                                    max={maxLaderampeHöhe} 
                                    state={laderampeHöhe} 
                                    setState={setLaderampeHöhe} 
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
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className='text' style={{ fontWeight: 200}}>Länge</span>
                                    <span className='text' style={{ fontSize: 12}}>0-10</span>
                                </div>
                                <MuiNumberfield 
                                    label={'m'} 
                                    min={0} 
                                    max={10} 
                                    state={laderampeLänge} 
                                    setState={setLaderampeLänge} 
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
                                    <span className='text' style={{ fontWeight: 200}}>Höhe der Rampe</span>
                                    <span className='text' style={{ fontSize: 12}}>0-{maxLaderampeRampenhöhe}</span>
                                </div>
                                <MuiNumberfield 
                                    label={'m'} 
                                    min={0} 
                                    max={maxLaderampeRampenhöhe} 
                                    state={laderampeRampenhöhe} 
                                    setState={setLaderampeRampenhöhe} 
                                />
                            </div>

                            <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Sektionaltor:</p>

                            {/* <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "10px", 
                                justifyContent: 'space-between', 
                                marginRight: "10px",
                            }}>
                                <span className='text' style={{ fontWeight: 200 }}>Transparente Füllung</span>
                                <MuiSelect
                                    option1={'Nein'}
                                    value1={'nein'}
                                    option2={'Ja'}
                                    value2={'ja'}
                                    label={'Transparente Füllung'}
                                    state={laderampeTransparenteFüllung}
                                    setState={setLaderampeTransparenteFüllung}
                                />
                            </div> */}

                            {laderampeTransparenteFüllung === 'ja' && (
                                <>
                                    <div style={{ 
                                        display: 'flex', 
                                        gap: '10px', 
                                        alignItems: 'center', 
                                        marginBottom: "10px", 
                                        justifyContent: 'space-between', 
                                        marginRight: "10px"
                                    }}>
                                        <span className='text' style={{ fontWeight: 200 }}>Transparente Paneele</span>
                                        <MuiTextfeld
                                            label={'z.B. "1,2,3"'}
                                            state={laderampeTransparentePaneele}
                                            setState={setLaderampeTransparentePaneele}
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
                                        <span className='text' style={{ fontWeight: 200 }}>Fensterstreifen-Höhe</span>
                                        <MuiNumberfield 
                                            label={'m'} 
                                            min={0.1} 
                                            max={5} 
                                            state={laderampeFensterstreifenHöhe} 
                                            setState={setLaderampeFensterstreifenHöhe} 
                                        />
                                    </div>
                                </>
                            )}

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
                                    state={laderampeReflektor}
                                    setState={setLaderampeReflektor}
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
                                <span className='text' style={{ fontWeight: 200 }}>Schlupftür</span>
                                <MuiSelect
                                    option1={'Nein'}
                                    value1={'nein'}
                                    option2={'Ja'}
                                    value2={'ja'}
                                    label={'Schlupftür'}
                                    state={laderampeSchlupftür}
                                    setState={setLaderampeSchlupftür}
                                />
                            </div>

                            {laderampeSchlupftür === 'ja' && (
                                <>
                                    <p className='text' style={{ fontSize: 12, marginBottom: "6px", fontWeight: 300 }}>Schlupftür Eigenschaften:</p>

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
                                                <span className='text' style={{ fontSize: 12}}>0.2-{maxLaderampeBreite}</span>
                                        </div>
                                        <MuiNumberfield 
                                            label={'m'} 
                                            min={0.2} 
                                                max={maxLaderampeBreite} 
                                            state={laderampeSchlupftürBreite} 
                                            setState={setLaderampeSchlupftürBreite} 
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
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span className='text' style={{ fontWeight: 200}}>Höhe</span>
                                                <span className='text' style={{ fontSize: 12}}>0.2-{maxLaderampeHöhe}</span>
                                        </div>
                                        <MuiNumberfield 
                                            label={'m'} 
                                            min={0.2} 
                                                max={maxLaderampeHöhe} 
                                            state={laderampeSchlupftürHöhe} 
                                            setState={setLaderampeSchlupftürHöhe} 
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
                                        <span className='text' style={{ fontWeight: 200 }}>Distanz +X</span>
                                        <MuiNumberfield 
                                            label={'m'} 
                                            min={0} 
                                            max={maxLaderampeBreite} 
                                            state={laderampeSchlupftürDistanzX} 
                                            setState={setLaderampeSchlupftürDistanzX} 
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
                                        <span className='text' style={{ fontWeight: 200 }}>Orientierung</span>
                                        <MuiSelect
                                            option1={'Rechts'}
                                            value1={'rechts'}
                                            option2={'Links'}
                                            value2={'links'}
                                            label={'Orientierung'}
                                            state={laderampeSchlupftürOrientierung}
                                            setState={setLaderampeSchlupftürOrientierung}
                                        />
                                    </div>
                                </>
                            )}

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
                                    state={laderampeFarbe}
                                    setState={setLaderampeFarbe}
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
                                <span className='text' style={{ fontWeight: 200 }}>Füllfarbe</span>
                                <MuiSelect
                                    option1={'Weiß'}
                                    value1={'Weiß'}
                                    option2={'Grau'}
                                    value2={'Grau'}
                                    option3={'Schwarz'}
                                    value3={'Schwarz'}
                                    label={'Füllfarbe'}
                                    state={laderampeFüllFarbe}
                                    setState={setLaderampeFüllFarbe}
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
                                <span className='text' style={{ fontWeight: 200 }}>Farbe der Verkleidung</span>
                                <MuiSelect
                                    option1={'Weiß'}
                                    value1={'Weiß'}
                                    option2={'Grau'}
                                    value2={'Grau'}
                                    option3={'Schwarz'}
                                    value3={'Schwarz'}
                                    label={'Verkleidung'}
                                    state={laderampeVerkleidungFarbe}
                                    setState={setLaderampeVerkleidungFarbe}
                                />
                            </div>

                            {/* Buttons */}
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                justifyContent: 'space-between',
                                marginTop: '6px'
                            }}>
                                <button
                                    onClick={() => setSelectedType('')}
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
                                    Zurück
                                </button>
                                <button
                                    onClick={() => {
                                        const clampValue = (value, min, max) => {
                                            const num = Number(value)
                                            if (Number.isNaN(num)) return min
                                            return Math.min(Math.max(num, min), max)
                                        }

                                        const geklemmteRampenhöhe = clampValue(laderampeRampenhöhe, 0, maxLaderampeRampenhöhe)
                                        const maxLaderampeHöheNachRampe = Math.max(0.2, gebäudeHöhe - geklemmteRampenhöhe)
                                        const geklemmteLaderampeBreite = clampValue(laderampeBreite, 0.2, maxLaderampeBreite)
                                        const geklemmteLaderampeHöhe = clampValue(laderampeHöhe, 0.2, maxLaderampeHöheNachRampe)
                                        const geklemmteSchlupftürBreite = clampValue(laderampeSchlupftürBreite, 0.2, maxLaderampeBreite)
                                        const geklemmteSchlupftürHöhe = clampValue(laderampeSchlupftürHöhe, 0.2, maxLaderampeHöheNachRampe)
                                        const geklemmteSchlupftürDistanzX = clampValue(laderampeSchlupftürDistanzX, 0, maxLaderampeBreite)

                                        addObj([geklemmteLaderampeBreite, geklemmteLaderampeHöhe], 'laderampe', newId, rechts, clickedButtonPos, lang, {
                                            posSegment: laderampePosSegment,
                                            typ: laderampeTyp,
                                            länge: laderampeLänge,
                                            rampenhöhe: geklemmteRampenhöhe,
                                            transparenteFüllung: laderampeTransparenteFüllung,
                                            transparentePaneele: laderampeTransparenteFüllung === 'ja' ? laderampeTransparentePaneele : null,
                                            fensterstreifenHöhe: laderampeTransparenteFüllung === 'ja' ? laderampeFensterstreifenHöhe : null,
                                            reflektor: laderampeReflektor,
                                            schlupftür: laderampeSchlupftür,
                                            schlupftürBreite: laderampeSchlupftür === 'ja' ? geklemmteSchlupftürBreite : null,
                                            schlupftürHöhe: laderampeSchlupftür === 'ja' ? geklemmteSchlupftürHöhe : null,
                                            schlupftürDistanzX: laderampeSchlupftür === 'ja' ? geklemmteSchlupftürDistanzX : null,
                                            schlupftürOrientierung: laderampeSchlupftür === 'ja' ? laderampeSchlupftürOrientierung : null,
                                            farbe: laderampeFarbe,
                                            füllFarbe: laderampeFüllFarbe,
                                            verkleidungFarbe: laderampeVerkleidungFarbe
                                        })
                                        setNewId(id => id + 1)
                                        setSelectedType('')
                                        setEditMenü('Felder')
                                    }}
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
                                    Hinzufügen
                                </button>
                            </div>
                        </div>
                    </>
                ) : selectedType === 'leeröffnung' ? (
                    // Größenauswahl für Leeröffnung
                    <>
                        <div style={{
                            margin: "8px",
                            paddingBottom: "4px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                        }}>
                            <p className='text' style={{ fontSize: 17 }}>
                                Leeröffnung Größe
                            </p>
                        </div>

                        <div style={{ margin: '10px', marginTop: '8px' }}>
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "10px", 
                                justifyContent: 'space-between', 
                                marginRight: "10px"
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className='text' style={{ fontWeight: 200 }}>Breite</span>
                                    <span className='text' style={{ fontSize: 12 }}>1-{maxLeeröffnungBreite}</span>
                                </div>
                                <MuiNumberfield 
                                    label={'m'} 
                                    min={1} 
                                    max={maxLeeröffnungBreite} 
                                    state={öffnungsBreite} 
                                    setState={setÖffnungsBreite} 
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
                                    <span className='text' style={{ fontSize: 12}}>1-{maxLeeröffnungHöhe}</span>
                                </div>
                                <MuiNumberfield 
                                    label={'m'} 
                                    min={1} 
                                    max={maxLeeröffnungHöhe} 
                                    state={öffnungsHöhe} 
                                    setState={setÖffnungsHöhe} 
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
                                    onClick={() => setSelectedType('')}
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
                                    Zurück
                                </button>
                                <button
                                    onClick={() => {
                                        addObj([öffnungsBreite, öffnungsHöhe], 'leeröffnung', newId, rechts, clickedButtonPos, lang, {
                                            posSegment: 'mittig',
                                            vorne: clickedButtonPos?.vorne ?? true,
                                            bereich: wand ? 'wand' : 'dach'
                                        })
                                        setNewId(id => id + 1)
                                        setSelectedType('')
                                        setEditMenü('Felder')
                                    }}
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
                                    Hinzufügen
                                </button>
                            </div>
                        </div>
                    </>
                ) : null}
                
                {/* Klein Lichtkuppel Form */}
                {selectedType === 'kleinlichtskuppel' ? (
                    // Klein Lichtkuppel
                    <>
                        <div style={{
                            margin: "8px",
                            paddingBottom: "4px",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                        }}>
                            <p className='text' style={{ fontSize: 17 }}>
                                Klein Lichtkuppel
                            </p>
                        </div>

                        <div style={{ margin: '10px', marginTop: '8px' }}>
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
                                    state={kleinLichtkuppelPosSegment}
                                    setState={setKleinLichtkuppelPosSegment}
                                />
                            </div> */}

                            <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Position:</p>

                            {/* <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "10px", 
                                justifyContent: 'space-between', 
                                marginRight: "10px"
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className='text' style={{ fontWeight: 200}}>Distanz +X</span>
                                    <span className='text' style={{ fontSize: 12}}>0-5</span>
                                </div>
                                <MuiNumberfield 
                                    label={'m'} 
                                    min={0} 
                                    max={5} 
                                    step={0.01}
                                    state={kleinLichtkuppelDistanzX} 
                                    setState={setKleinLichtkuppelDistanzX} 
                                />
                            </div> */}

                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "10px", 
                                justifyContent: 'space-between', 
                                marginRight: "10px",
                            }}>
                                <span className='text' style={{ fontWeight: 200 }}>Horizontale Ausrichtung</span>
                                <MuiSelect
                                    option1={'Links'}
                                    value1={'links'}
                                    option2={'Mittig'}
                                    value2={'mittig'}
                                    option3={'Rechts'}
                                    value3={'rechts'}
                                    label={'Ausrichtung'}
                                    state={kleinLichtkuppelHorizontaleAusrichtung}
                                    setState={setKleinLichtkuppelHorizontaleAusrichtung}
                                />
                            </div>

                            {/* <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "14px", 
                                justifyContent: 'space-between', 
                                marginRight: "10px"
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className='text' style={{ fontWeight: 200}}>Distanz +Y</span>
                                    <span className='text' style={{ fontSize: 12}}>0-5</span>
                                </div>
                                <MuiNumberfield 
                                    label={'m'} 
                                    min={0} 
                                    max={5} 
                                    step={0.01}
                                    state={kleinLichtkuppelDistanzY} 
                                    setState={setKleinLichtkuppelDistanzY} 
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
                                    <span className='text' style={{ fontWeight: 200}}>Breite X</span>
                                    <span className='text' style={{ fontSize: 12}}>0.2-{maxKleinLichtkuppelBreiteX}</span>
                                </div>
                                <MuiNumberfield 
                                    label={'m'} 
                                    min={0.2} 
                                    max={maxKleinLichtkuppelBreiteX} 
                                    step={0.01}
                                    state={kleinLichtkuppelBreiteX} 
                                    setState={setKleinLichtkuppelBreiteX} 
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
                                    <span className='text' style={{ fontWeight: 200}}>Breite Y</span>
                                    <span className='text' style={{ fontSize: 12}}>0.2-{maxKleinLichtkuppelBreiteY}</span>
                                </div>
                                <MuiNumberfield 
                                    label={'m'} 
                                    min={0.2} 
                                    max={maxKleinLichtkuppelBreiteY} 
                                    step={0.01}
                                    state={kleinLichtkuppelBreiteY} 
                                    setState={setKleinLichtkuppelBreiteY} 
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
                                    state={kleinLichtkuppelFarbe}
                                    setState={setKleinLichtkuppelFarbe}
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
                                    onClick={() => setSelectedType('')}
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
                                    Zurück
                                </button>
                                <button 
                                    onClick={() => {
                                        addObj(
                                            [kleinLichtkuppelBreiteX, kleinLichtkuppelBreiteY],
                                            'kleinlichtskuppel',
                                            newId,
                                            rechts,
                                            clickedButtonPos,
                                            lang,
                                            {
                                                posSegment: kleinLichtkuppelPosSegment,
                                                distanzX: kleinLichtkuppelDistanzX,
                                                horizontaleAusrichtung: kleinLichtkuppelHorizontaleAusrichtung,
                                                distanzY: kleinLichtkuppelDistanzY,
                                                farbe: kleinLichtkuppelFarbe
                                            }
                                        )
                                        setNewId(newId + 1)
                                        setSelectedType('')
                                        setEditMenü('Felder')
                                    }}
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
                                    Hinzufügen
                                </button>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </>
    )
}