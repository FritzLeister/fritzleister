import "./styles.css";
import Checkbox from '@mui/material/Checkbox';
import { useState } from "react";
import MuiProgress from "./Komp/MuiProgress"

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function AbfragePage({ setShowApp, setFlach, länge, setLänge, breite, setBreite, höhe, setHöhe }) {

    const [actionState, setActionState] = useState(1)
    const [hallenartSelection, setHallenartSelection] = useState("")
    const [dachSelection, setDachSelection] = useState("")
    const [bauweiseSelection, setBauweiseSelection] = useState("")

    function handleAbschluss() {
        setHallenartSelection("industrie")
        setDachSelection("satteldach")
        setBauweiseSelection("gedaemt")
        setShowApp(true)
    }

    return(
        <>

            <MuiProgress state={actionState} />
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 0,
                    zIndex: 999,
                }}
            >
                {/* Linke */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 18,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        color: "#000000ff",
                        width: "20%",
                        height: "70%",
                        maxWidth: 900,
                        maxHeight: "80vh",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        zIndex: 1000,
                        borderRadius: 12,
                        boxSizing: "border-box",
                        overflow: "auto", // allow scrolling inside card if content grows
                        background: "#ffffff",
                    }}
                >
                    <div style={{
                        marginBottom: 20,
                        width: "90%",
                        height: 80,
                        background: actionState === 1 ? "#ccccccff" : "#ffffff",
                        padding: 15,
                        borderRadius: 12,
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        cursor: 'pointer'
                    }}
                    onClick={() => setActionState(1)}
                    >
                        <h2>Hallenart</h2>
                    </div>

                    <div style={{
                        marginBottom: 20,
                        width: "90%",
                        height: 80,
                        background: actionState === 2 ? "#ccccccff" : "#ffffff",
                        padding: 15,
                        borderRadius: 12,
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        cursor: 'pointer'
                    }}
                    onClick={() => setActionState(2)}
                    >
                        <h2>Dach</h2>
                    </div>

                    <div style={{
                        marginBottom: 20,
                        width: "90%",
                        height: 80,
                        background: actionState === 3 ? "#ccccccff" : "#ffffff",
                        padding: 15,
                        borderRadius: 12,
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        cursor: 'pointer'
                    }}
                    onClick={() => setActionState(3)}
                    >
                        <h2>Hallengröße</h2>
                    </div>

                    <div style={{
                        marginBottom: 20,
                        width: "90%",
                        height: 80,
                        background: actionState === 4 ? "#ccccccff" : "#ffffff",
                        padding: 15,
                        borderRadius: 12,
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        cursor: 'pointer'
                    }}
                    onClick={() => setActionState(4)}
                    >
                        <h2>Abschluss</h2>
                    </div>

                </div>
                
                {/* Rechte */}
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

                    {actionState === 1 && (
                        <>
                            <h1 style={{ fontSize: 40, marginBottom: 0 }}>Schritt 1</h1>

                            <h2 style={{ fontWeight: 50, marginBottom: 20 }} >Welche Halle möchten Sie bauen?</h2>

                            <p style={{ marginBottom: 0 }} className="label">
                                <Checkbox 
                                    {...label} 
                                    color="secondary" 
                                    checked={hallenartSelection === "industrie"}
                                    onChange={() => setHallenartSelection("industrie")}
                                />
                                Industrie / Gewerbe
                            </p>
                            <p style={{ marginBottom: 0 }} className="label">
                                <Checkbox 
                                    {...label} 
                                    color="secondary"
                                    checked={hallenartSelection === "lager"}
                                    onChange={() => setHallenartSelection("lager")}
                                />
                                Lager / Logistik
                            </p>
                            <p style={{ marginBottom: 0 }} className="label">
                                <Checkbox 
                                    {...label} 
                                    color="secondary"
                                    checked={hallenartSelection === "produktion"}
                                    onChange={() => setHallenartSelection("produktion")}
                                />
                                Produktion / Werk
                            </p>
                            <p style={{ marginBottom: 0 }} className="label">
                                <Checkbox 
                                    {...label} 
                                    color="secondary"
                                    checked={hallenartSelection === "sport"}
                                    onChange={() => setHallenartSelection("sport")}
                                />
                                Sport / Ausstellung
                            </p>
                            <p style={{ marginBottom: 0 }} className="label">
                                <Checkbox 
                                    {...label} 
                                    color="secondary"
                                    checked={hallenartSelection === "sonstiges"}
                                    onChange={() => setHallenartSelection("sonstiges")}
                                />
                                Sonstiges
                            </p>

                            <div style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            cursor: "pointer",
                            }}
                            onClick={() => setActionState(2)}
                            >
                                <ArrowForwardIcon fontSize="large" />
                            </div>
                            </>
                        )
                    }

                    {actionState === 2 && (
                        <>
                            <h1 style={{ fontSize: 40, marginBottom: 0 }}>Schritt 2</h1>

                            <h2 style={{ fontWeight: 50, marginBottom: 20 }} >Welches Dach soll Ihre Halle haben?</h2>

                            <p style={{ marginBottom: 0 }} className="label">
                                <Checkbox 
                                    {...label} 
                                    color="secondary"
                                    checked={dachSelection === "satteldach"}
                                    onChange={() => setDachSelection("satteldach")}
                                />
                                Satteldach
                            </p>
                            <p style={{ marginBottom: 0 }} className="label">
                                <Checkbox 
                                    {...label} 
                                    color="secondary"
                                    checked={dachSelection === "flachdach"}
                                    onChange={() => setDachSelection("flachdach")}
                                />
                                Flachdach
                            </p>
        

                            <div style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            cursor: "pointer",
                            }}
                            onClick={() => setActionState(3)}
                            >
                                <ArrowForwardIcon fontSize="large" />
                            </div>

                            <div style={{
                                position: 'absolute',
                                top: 10,
                                left: 10,
                                cursor: "pointer",
                            }}
                            onClick={() => setActionState(1)}
                            >
                                <ArrowBackIcon fontSize="large" />
                                
                            </div>
                        </>
                        )
                    }

                    {actionState === 3 && (
                        <>
                            <h1 style={{ fontSize: 40, marginBottom: 0 }}>Schritt 3</h1>

                            <h2 style={{ fontWeight: 50, marginBottom: 20 }} >Wie groß soll Ihre Halle werden?</h2>

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

                            <div style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            cursor: "pointer",
                            }}
                            onClick={() => setActionState(4)}
                            >
                                <ArrowForwardIcon fontSize="large" />
                            </div>

                            <div style={{
                                position: 'absolute',
                                top: 10,
                                left: 10,
                                cursor: "pointer",
                            }}
                            onClick={() => setActionState(2)}
                            >
                                <ArrowBackIcon fontSize="large" />
                                
                            </div>
                            </>
                        )
                    }

                    {actionState === 4 && (
                        <>
                            <h1 style={{ fontSize: 40, marginBottom: 0 }}>Schritt 4</h1>

                            <h2 style={{ fontWeight: 50, marginBottom: 20 }} >Super, vielen Dank!</h2>

                            <h2 style={{ fontWeight: 30, fontSize: 20 }}>Ihre Angaben helfen uns, die Konfiguration vorzubereiten.</h2>

                            <button className="buttonDark" onClick={() => {
                                if (dachSelection === "") setDachSelection("satteldach");
                                if (hallenartSelection === "") setHallenartSelection("industrie");
                                if (dachSelection === "flachdach") setFlach(true);
                                if (dachSelection === "satteldach") setFlach(false);
                                setShowApp("app");
                            }}>Konfiguration abschließen!</button>

                            <div style={{
                                position: 'absolute',
                                top: 10,
                                left: 10,
                                cursor: "pointer",
                            }}
                            onClick={() => setActionState(3)}
                            >
                                <ArrowBackIcon fontSize="large" />
                            </div>
                            </>
                        )
                    }
                </div>
            </div>
        </>
    )
}