import "./styles.css";
import Checkbox from '@mui/material/Checkbox';
import { useState } from "react";
import MuiProgress from "./Komp/MuiProgress"

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function LandingPage({}) {

    const [actionState, setActionState] = useState(1)

    const forwardArrow = () => {

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
                        width: "80%",
                        height: 100,
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
                        width: "80%",
                        height: 100,
                        background: actionState === 2 ? "#ccccccff" : "#ffffff",
                        padding: 15,
                        borderRadius: 12,
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        cursor: 'pointer'
                    }}
                    onClick={() => setActionState(2)}
                    >
                        <h2>Nutzung</h2>
                    </div>

                    <div style={{
                        marginBottom: 20,
                        width: "80%",
                        height: 100,
                        background: actionState === 3 ? "#ccccccff" : "#ffffff",
                        padding: 15,
                        borderRadius: 12,
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        cursor: 'pointer'
                    }}
                    onClick={() => setActionState(3)}
                    >
                        <h2>Bauweise</h2>
                    </div>

                    <div style={{
                        marginBottom: 20,
                        width: "80%",
                        height: 100,
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

                            <h2 style={{ fontWeight: 50, marginBottom: 20 }} >Welche Halle möchten sie bauen?</h2>

                            <p style={{ marginBottom: 0 }} className="label">
                                <Checkbox {...label} color="secondary" defaultChecked />
                                Industrie / Gewerbe
                            </p>
                            <p style={{ marginBottom: 0 }} className="label">
                                <Checkbox {...label} color="secondary" />
                                Lager / Logistik
                            </p>
                            <p style={{ marginBottom: 0 }} className="label">
                                <Checkbox {...label} color="secondary" />
                                Produktion / Werk
                            </p>
                            <p style={{ marginBottom: 0 }} className="label">
                                <Checkbox {...label} color="secondary" />
                                Sport / Ausstellung
                            </p>
                            <p style={{ marginBottom: 0 }} className="label">
                                <Checkbox {...label} color="secondary" />
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

                            <h2 style={{ fontWeight: 50, marginBottom: 20 }} >Wofür soll die Halle hauptsächlich genutzt werden?</h2>

                            <p style={{ marginBottom: 0 }} className="label">
                                <Checkbox {...label} color="secondary" defaultChecked />
                                Produktion
                            </p>
                            <p style={{ marginBottom: 0 }} className="label">
                                <Checkbox {...label} color="secondary" />
                                Lagerung
                            </p>
                            <p style={{ marginBottom: 0 }} className="label">
                                <Checkbox {...label} color="secondary" />
                                Verkauf / Ausstellung
                            </p>
                            <p style={{ marginBottom: 0 }} className="label">
                                <Checkbox {...label} color="secondary" />
                                Sport / Freizeit
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

                            <h2 style={{ fontWeight: 50, marginBottom: 20 }} >Haben Sie schon eine Vorstellung zur Bauweise</h2>

                            <p style={{ marginBottom: 0 }} className="label">
                                <Checkbox {...label} color="secondary" defaultChecked />
                                Gedämmt
                            </p>
                            <p style={{ marginBottom: 0 }} className="label">
                                <Checkbox {...label} color="secondary" />
                                Ungedämmt
                            </p>
                            <p style={{ marginBottom: 0 }} className="label">
                                <Checkbox {...label} color="secondary" />
                                Noch unklar
                            </p>

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