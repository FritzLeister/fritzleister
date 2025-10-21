
import "./styles.css"

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useState } from "react";

export default function CustomPage({ openApp }) {

    const [länge, setLänge] = useState(15)
    const [breite, setBreite] = useState(7)
    const [höhe, setHöhe] = useState(13)

    return(
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                <div
                    style={{
                        border: "3px solid rgba(12, 8, 8, 0.2)",
                        borderRadius: 12,
                        width: "80%",
                        maxWidth: 900,
                        height: "90%",
                        padding: 24,
                        boxSizing: "border-box",
                        textAlign: "center"
                    }}
                >
                    <img src="/StartpunktDigitalLogo.png" alt="Logo" style={{ width: 200, marginBottom: 0, marginTop: 10 }} />
                    <h1 style={{ marginBottom: 0 }}>Eckdaten</h1>
                    
                    <div id="sachen">
                        <h3 className="text">Gebe hier nun die Werte deiner Halle an!</h3>

                        {/* Länge */}
                        <div>
                            <Box sx={{ width: 300, marginTop: 0 }}>
                                <Typography sx={{ marginBottom: 0 }} >Länge (m)</Typography>
                                <Slider 
                                defaultValue={50} 
                                aria-label="Default" 
                                valueLabelDisplay="auto"
                                min={5} // Default Value 5 meter == value 22
                                max={23} // Max Value 23 Meter == value 40
                                value={länge} 
                                onChange={(e, newValue) => setLänge(newValue)} />
                            </Box>
                        </div>

                        {/* Breite */}
                        <div>
                            <Box sx={{ width: 300 }}>
                                <Typography sx={{ marginBottom: 0 }} >Breite (m)</Typography>
                                <Slider 
                                defaultValue={50} 
                                aria-label="Default" 
                                valueLabelDisplay="auto" 
                                value={breite}
                                min={3} // Min Value 3 == value 18
                                max={10} // Max Value 10 == value 25
                                onChange={(e, newValue) => setBreite(newValue)} />
                            </Box>
                        </div>

                        {/* Höhe */}
                        <div>
                            <Box sx={{ width: 300 }}>
                                <Typography sx={{ marginBottom: 0 }} >Höhe (m)</Typography>
                                <Slider 
                                defaultValue={50} 
                                aria-label="Default" 
                                valueLabelDisplay="auto" 
                                value={höhe}
                                min={4} // Min Value 4 == value 7
                                max={17} // Max Value 17 == value 20
                                onChange={(e, newValue) => setHöhe(newValue)} />
                            </Box>
                        </div>

                        <button className="button" onClick={openApp}>
                            Confirm
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}