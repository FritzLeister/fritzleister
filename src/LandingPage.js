import { Center } from "@react-three/drei";
import "./styles.css";

export default function LandingPage({ openApp }) {

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
                <img src="/StartpunktDigitalLogo.png" alt="Logo" style={{ width: 200, marginBottom: 20 }} />
                
                <h1>Hallenkonfigurator</h1>
                
                <button className="button" onClick={openApp}>
                    Los Geht´s!
                </button>
                
            </div>
        </>
    )
}