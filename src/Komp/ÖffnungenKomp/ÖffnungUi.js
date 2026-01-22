import { useState } from "react"
import MuiTextfeld from "../MuiTextfeld"


export default function ÖffnungUi({ wand }) {

    // Arbeits - State:
    const [öffnungsName, setÖffnungsName] = useState('Neues Objekt')

    const [showUi, setShowUi] = useState('')

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

    return(
        <>
            <div style={{
                position: "fixed",
                top: 455,
                right: 20,
                background: "rgba(255, 255, 255, 0.15)", // halbtransparent
                backdropFilter: "blur(10px)",             // Blur-Effekt
                WebkitBackdropFilter: "blur(10px)",       // Safari-Support
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // etwas stärkerer Schatten
                color: "#000000ff",                            // besserer Kontrast
                width: 310,
                // Dynamische Höhe: passt sich dem Inhalt an
                maxHeight: '80vh',
                overflowY: 'auto',
                border: "1px solid rgba(255, 255, 255, 0.2)", // dezenter Rand
                zIndex: 999,
                // visibility: türAttribute ? "inherit" : "hidden"
            }}>
                <div style={{
                    margin: "8px",
                    paddingBottom: "4px",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                }}>
                    <p className='text' style={{ fontSize: 17 }}>
                        Neue Öffnung
                    </p>
                </div>

                <div style={{ margin: '5px'}}>
                    <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        alignItems: 'center', 
                        marginBottom: "8px", 
                        justifyContent: 'space-between', 
                        marginRight: "15px",
                        marginLeft: '5px'
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
                        gap: '10px',
                        marginTop: '15px',
                        marginRight: "10px",
                        marginLeft: '10px'
                    }}>
                        {[...Array(wand ? 8 : 3)].map((_, index) => (
                            <div 
                                key={index}
                                style={{
                                    width: '100%',
                                    height: '75px',
                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                    borderRadius: '8px',
                                    //border: '2px dashed rgba(0, 0, 0, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    //transition: 'all 0.1s'
                                }}
                                
                                /* 
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(200, 200, 200, 0.5)';
                                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 1)';
                                }}
                                */
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
            </div>
        </>
    )
}