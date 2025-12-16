import "./styles.css";

export default function LandingPage({ 
    setShowApp
}) {


    return(
        <>
            <div
                style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                }}
            >
                <img src="/LogoPerthel.png" alt="Logo" style={{ width: 200, marginBottom: 20 }} />
                
                <h1>Hallenkonfigurator</h1>
                
                <div>
                    <button className="button" onClick={() => setShowApp("saved")}>
                        Gespeichert
                    </button>
                    <button className="button" onClick={() => setShowApp("custom")}>
                        Los Geht´s!
                    </button>
                </div>
                
            </div>
        </>
    )
}