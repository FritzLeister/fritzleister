import { useEffect } from "react";
import "./styles.css";

export default function LandingPage({ 
    setShowApp
}) {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow
        const previousOverflowX = document.body.style.overflowX
        const previousOverflowY = document.body.style.overflowY

        // Scope scrolling to the landing page instead of locking the whole app globally.
        document.body.style.overflow = 'auto'
        document.body.style.overflowX = 'hidden'
        document.body.style.overflowY = 'auto'

        return () => {
            document.body.style.overflow = previousOverflow
            document.body.style.overflowX = previousOverflowX
            document.body.style.overflowY = previousOverflowY
        }
    }, [])


    return(
        <>
            <div className="landingPage">
                <div className="landingAmbientOrbs" aria-hidden="true">
                    <span className="landingOrb landingOrbOne" />
                    <span className="landingOrb landingOrbTwo" />
                </div>

                <section className="landingStage">
                    <img src="/LogoPerthel.png" alt="Logo" className="landingLogo" />

                    <p className="landingEyebrow">3D Planung in Echtzeit</p>
                    <h1 className="landingTitle">Hallenkonfigurator</h1>
                    <p className="landingSubtitle">
                        Plane Geometrie, Konstruktion und Öffnungen in einem klaren, geführten Workflow.
                    </p>

                    <div className="landingActions">
                        <button className="button landingButton landingButtonSecondary" onClick={() => setShowApp("saved")}>
                            Gespeichert
                        </button>
                        <button className="button landingButton landingButtonSecondary" onClick={() => setShowApp("faq")}>
                            FAQ
                        </button>
                        <button className="button landingButton landingButtonPrimary" onClick={() => setShowApp("app")}>
                            Konfiguration starten
                        </button>
                    </div>
                </section>

                <p className="landingFootnote">
                    Desktop optimiert für präzise Hallenplanung.
                </p>
                
                </div>
        </>
    )
}