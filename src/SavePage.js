
import { useEffect, useState } from "react";
import "./styles.css";
import AnfrageFormular from "./AnfrageFormular";
import KonfigurationsZusammenfassung from "./KonfigurationsZusammenfassung";

export default function SavePage({ 
    setShowApp,
    setLänge,
    setBreite,
    setHöhe,
    setHallenartSelection,
    setDachSelection,
    onKontaktSubmit,
    initialSchirm = "preis",
    summaryData,
    objs
}) {

    const [schirm, setSchirm] = useState(initialSchirm === "kontakt" ? "zusammenfassung" : initialSchirm)

    const actionButtonBaseStyle = {
        width: 230,
        height: 92,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        lineHeight: 1.25,
        whiteSpace: "normal"
    }
    const preisScreenActions = [
        {
            key: "summary",
            label: "Preis Anfordern",
            style: {},
            onClick: () => setSchirm("zusammenfassung")
        },
        {
            key: "edit",
            label: "Erneut Überarbeiten",
            style: {},
            onClick: () => setShowApp("app")
        }
    ]

    useEffect(() => {
        setSchirm(initialSchirm === "kontakt" ? "zusammenfassung" : initialSchirm)
    }, [initialSchirm])

    return(
        <>
            {schirm === "preis" && (
                <div className="savePageShell">
                    <div className="savePageAmbientOrbs" aria-hidden="true">
                        <span className="savePageOrb savePageOrbOne" />
                        <span className="savePageOrb savePageOrbTwo" />
                    </div>

                    <div className="savePageCard">
                        <img src="/LogoPerthel.png" alt="Logo" className="savePageLogo" />
                        <p className="landingEyebrow">Speichern abgeschlossen</p>
                        <h2 className="savePageTitle">Ihr Entwurf wurde gespeichert.</h2>
                        <p className="savePageSubtitle">Sie haben nun zwei Möglichkeiten:</p>

                        <div className="savePageActions">
                            {preisScreenActions.map((action) => (
                                <button
                                    key={action.key}
                                    className="button savePageButton"
                                    style={{ ...actionButtonBaseStyle, ...action.style }}
                                    onClick={action.onClick}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {schirm === "zusammenfassung" && (
                <KonfigurationsZusammenfassung
                setSchirm={setSchirm}
                setShowApp={setShowApp}
                summaryData={summaryData}
                liveObjs={objs}
                />
            )}
            
            {schirm === "kontakt" && (
                <AnfrageFormular
                setSchirm={setSchirm}
                setShowApp={setShowApp}
                onSubmitSuccess={onKontaktSubmit}
                setBreite={setBreite}
                setLänge={setLänge}
                setHöhe={setHöhe}
                setDachSelection={setDachSelection}
                setHallenartSelection={setHallenartSelection}
                />
            )}

            {schirm === "ende" && (
                <div className="savePageShell">
                    <div className="savePageAmbientOrbs" aria-hidden="true">
                        <span className="savePageOrb savePageOrbOne" />
                        <span className="savePageOrb savePageOrbTwo" />
                    </div>

                    <div className="savePageCard savePageCardCompact">
                        <img src="/LogoPerthel.png" alt="Logo" className="savePageLogo" />
                        <p className="landingEyebrow">Kontakt</p>
                        <h1 className="savePageTitle savePageTitleCompact">Wir melden uns so schnell wie möglich.</h1>

                        <button className="button savePageButton" onClick={() => setShowApp("landing")}>Zurück zur Startseite</button>
                    </div>
                </div>
            )}
        </>
    )
}