import { Center } from "@react-three/drei";
import "./styles.css";
import AbfragePage from "./AbfragePage";

export default function LandingPage({ openAbfrage }) {


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
                
                <button className="button" onClick={openAbfrage}>
                    Los Geht´s!
                </button>
                
            </div>
        </>
    )
}