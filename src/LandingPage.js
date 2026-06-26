import "./styles.css";

export default function LandingPage({ 
    setShowApp
}) {


    return(
        <>
            <div className="landingPage">
                <img src="/LogoPerthel.png" alt="Logo" className="landingLogo" />
                
                <h1 className="landingTitle">Hallenkonfigurator</h1>
                
                <div className="landingActions">
                    <button className="button landingButton" onClick={() => setShowApp("saved")}>
                        Gespeichert
                    </button>
                    <button className="button landingButton" onClick={() => setShowApp("app")}>
                        Los Geht´s!
                    </button>
                </div>
                
            </div>
        </>
    )
}