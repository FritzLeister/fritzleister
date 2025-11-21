
import { useState } from "react";
import "./styles.css";

export default function SavePage({ 
    setShowApp,
    setLänge,
    setBreite,
    setHöhe,
    setHallenartSelection,
    setDachSelection,
    hallenSave,
    setObjs
}) {

    const [schirm, setSchirm] = useState("preis")

    return(
        <>
            {schirm === "preis" && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                    <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 18,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        color: "#000000ff",
                        width: "60%",
                        height: "70%",
                        maxWidth: 900,
                        maxHeight: "80vh",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        zIndex: 1000,
                        borderRadius: 12,
                        boxSizing: "border-box",
                        overflow: "auto", // allow scrolling inside card if content grows
                        background: "#ffffff",
                        position: "relative"
                    }}
                    >
                        <img src="/StartpunktDigitalLogo.png" alt="Logo" style={{ width: 200, marginBottom: 20 }} />
                        <h2>Puuhh...geschafft! Ihr Entwurf wurde gespeichert.</h2>
                        <h4 style={{
                            fontWeight: 0,
                            marginTop: 0
                        }}>Sie haben nun zwei Möglichkeiten:
                        </h4>

                        <div>
                            <button className="buttonDark" style={{ marginRight: "2.5px", width: 230 }} onClick={() => {
                                setObjs([])
                                setSchirm("kontakt")
                            }} >
                                Preis Anfordern
                            </button>

                            <button className="buttonDark" onClick={() => setShowApp("custom")} style={{ marginLeft: "2.5px", width: 230 }} >
                                Erneut Überarbeiten
                            </button>
                        </div>

                    </div>
                </div>
            )}
            
            {schirm === "kontakt" && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                    <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 18,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        color: "#000000ff",
                        width: "60%",
                        height: "80%",
                        maxWidth: 900,
                        maxHeight: "80vh",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        zIndex: 1000,
                        borderRadius: 12,
                        boxSizing: "border-box",
                        overflow: "auto", // allow scrolling inside card if content grows
                        background: "#ffffff",
                        position: "relative"
                    }}
                    >
                        <img src="/StartpunktDigitalLogo.png" alt="Logo" style={{ width: 200, marginBottom: 0 }} />
                        
                        <h2 style={{ fontSize: 40, marginBottom: 20 }}>Kontaktformular</h2>

                        <p style={{ marginTop: 0 }}>
                            <p className="label">Name</p>
                            <input type="name" required></input>
                        </p>

                        <p style={{ marginTop: 0 }}>
                            <p className="label">E-Mail</p>
                            <input type="email" required></input>
                        </p>

                        <p style={{ marginTop: 0 }}>
                            <p className="label">Adresse</p>
                            <input type="text" required></input>
                        </p>

                        <p style={{ marginTop: 0 }}>
                            <p className="label">Telefon</p>
                            <input type="tel" required></input>
                        </p>

                        <button type="submit" className="buttonDark" onClick={() => (
                            setSchirm("ende"),
                            setBreite(7),
                            setLänge(15),
                            setHöhe(13),
                            setDachSelection(""),
                            setHallenartSelection("")
                            )} style={{ height: 10 }}>
                            Abschicken
                        </button>

                    </div>
                </div>
            )}

            {schirm === "ende" && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                    <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 18,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        color: "#000000ff",
                        width: "60%",
                        height: "70%",
                        maxWidth: 900,
                        maxHeight: "80vh",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        zIndex: 1000,
                        borderRadius: 12,
                        boxSizing: "border-box",
                        overflow: "auto", // allow scrolling inside card if content grows
                        background: "#ffffff",
                        position: "relative"
                    }}
                    >
                        <img src="/StartpunktDigitalLogo.png" alt="Logo" style={{ width: 200, marginBottom: 20 }} />
                        <h1 style={{ fontSize: 40 }}>Wir Melden uns so schnell wie möglich.</h1>

                        <button className="buttonDark" onClick={() => setShowApp("landing")}>Zurück zur Startseite</button>
                    </div>
                </div>
            )}
        </>
    )
}