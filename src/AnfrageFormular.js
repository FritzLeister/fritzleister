

export default function AnfrageFormular({
    setSchirm,
    setBreite,
    setLänge,
    setHöhe,
    setDachSelection,
    setHallenartSelection
}) {

    return(
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", padding: "20px" }}>
                    <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        padding: "30px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        color: "#000000ff",
                        width: "100%",
                        height: "80%",
                        maxWidth: 900,
                        maxHeight: "80vh",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        zIndex: 1000,
                        borderRadius: 12,
                        boxSizing: "border-box",
                        overflowY: "auto",
                        overflowX: "hidden",
                        background: "#ffffff",
                        position: "relative",
                    }}
                    >
                        <img src="/LogoPerthel.png" alt="Logo" style={{ width: 200, marginBottom: 0 }} />
                        
                        <h2 style={{ fontSize: 40, marginBottom: 20 }}>Kontaktformular</h2>

                        <h3 className="text" style={{ fontSize: 28, marginBottom: 10, marginTop: 30, alignSelf: 'flex-start', width: '100%' }}>
                            Kunde
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', width: '100%' }}>
                            <p style={{ marginTop: 0 }}>
                                <p className="label">Firma</p>
                                <input type="text" required style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>

                            <p style={{ marginTop: 0 }}>
                                <p className="label">USt.-IdNr.</p>
                                <input type="text" style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>

                            <p style={{ marginTop: 0 }}>
                                <p className="label">Ansprechpartner</p>
                                <input type="text" required style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>

                            <p style={{ marginTop: 0 }}>
                                <p className="label">E-Mail</p>
                                <input type="email" required style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>

                            <p style={{ marginTop: 0 }}>
                                <p className="label">Telefon</p>
                                <input type="tel" required style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>
                        </div>

                        <h3 className="text" style={{ fontSize: 28, marginBottom: 10, marginTop: 30, alignSelf: 'flex-start', width: '100%' }}>Standort des Projektes</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', width: '100%' }}>
                            <p style={{ marginTop: 0 }}>
                                <p className="label">Straße</p>
                                <input type="text" required style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>

                            <p style={{ marginTop: 0 }}>
                                <p className="label">Stadt</p>
                                <input type="text" required style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>

                            <p style={{ marginTop: 0 }}>
                                <p className="label">GPS-Koordinaten</p>
                                <input type="text" style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>

                            <p style={{ marginTop: 0 }}>
                                <p className="label">Land</p>
                                <input type="text" required style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>

                            <p style={{ marginTop: 0 }}>
                                <p className="label">PLZ</p>
                                <input type="text" required style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>
                        </div>

                        <h3 className="text" style={{ fontSize: 28, marginBottom: 10, marginTop: 30, alignSelf: 'flex-start', width: '100%' }}>Bemerkungen</h3>

                        <p style={{ marginTop: 0, width: '100%' }}>
                            <textarea 
                                style={{ 
                                    width: '100%', 
                                    minHeight: '100px', 
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(0, 0, 0, 0.2)',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="Ihre Bemerkungen..."
                            ></textarea>
                        </p>

                        <button type="submit" className="buttonDark" onClick={() => (
                            setSchirm("ende"),
                            setBreite(7),
                            setLänge(15),
                            setHöhe(13),
                            setDachSelection(""),
                            setHallenartSelection("")
                            )} style={{ height: 10 }}>
                            Anfrage senden
                        </button>

                    </div>
                </div>
        </>
    )
}