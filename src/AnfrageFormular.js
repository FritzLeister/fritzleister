

import { useState } from "react";
import { generateOrderPdf } from "./utils/generateOrderPdf";
import { captureRegisteredProductSnapshots } from "./utils/productSnapshotRegistry";

export default function AnfrageFormular({
    setSchirm,
    setShowApp,
    onSubmitSuccess,
    setBreite,
    setLänge,
    setHöhe,
    setDachSelection,
    setHallenartSelection
}) {
    const [hasSubmitted, setHasSubmitted] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (hasSubmitted) {
            return;
        }

        setHasSubmitted(true);

        let snapshots = [];

        try {
            snapshots = await captureRegisteredProductSnapshots();
        } catch (snapshotError) {
            console.error("Snapshot-Serie konnte nicht vollständig erzeugt werden.", snapshotError);
        }

        try {
            await generateOrderPdf({ snapshots });
        } catch (pdfError) {
            console.error("PDF-Dokumentation konnte nicht erstellt werden.", pdfError);
        }

        if (typeof onSubmitSuccess === "function") {
            onSubmitSuccess();
        }

        setSchirm("ende");
        setBreite(30);
        setLänge(70);
        setHöhe(6);
        setDachSelection("");
        setHallenartSelection("");
    }

    return(
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", padding: "20px", background: "#ffffff", position: "fixed", inset: 0, zIndex: 2000 }}>
                    <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        padding: "30px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        color: "#000000ff",
                        width: "100%",
                        height: "80%",
                        maxWidth: 900,
                        maxHeight: "80vh",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        zIndex: 1000,
                        borderRadius: 12,
                        boxSizing: "border-box",
                        overflowY: "auto",
                        overflowX: "hidden",
                        background: "#ffffff",
                        position: "relative",
                    }}
                    >
                        <button
                            type="button"
                            className="buttonDark"
                            onClick={() => setShowApp("app")}
                            style={{
                                position: "absolute",
                                top: 18,
                                left: 18,
                                minHeight: "auto",
                                padding: "10px 16px",
                                fontSize: 14,
                                lineHeight: 1,
                                zIndex: 1,
                            }}
                        >
                            Zur Halle
                        </button>
                        <img src="/LogoPerthel.png" alt="Logo" style={{ width: 200, marginBottom: 0 }} />
                        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        
                        <h2 style={{ fontSize: 40, marginBottom: 20 }}>Kontaktformular</h2>

                        <h3 className="text" style={{ fontSize: 28, marginBottom: 10, marginTop: 30, alignSelf: 'flex-start', width: '100%' }}>
                            Kunde
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', width: '100%' }}>
                            <p style={{ marginTop: 0 }}>
                                <p className="label">Firma</p>
                                <input type="text" required style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>

                            <p style={{ marginTop: 0 }}>
                                <p className="label">USt.-IdNr.</p>
                                <input type="text" required style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>

                            <p style={{ marginTop: 0 }}>
                                <p className="label">Ansprechpartner</p>
                                <input type="text" required style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>

                            <p style={{ marginTop: 0 }}>
                                <p className="label">E-Mail</p>
                                <input type="email" required style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>

                            <p style={{ marginTop: 0 }}>
                                <p className="label">Telefon</p>
                                <input type="tel" required style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>
                        </div>

                        <h3 className="text" style={{ fontSize: 28, marginBottom: 10, marginTop: 30, alignSelf: 'flex-start', width: '100%' }}>Standort des Projektes</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', width: '100%' }}>
                            <p style={{ marginTop: 0 }}>
                                <p className="label">Straße</p>
                                <input type="text" required style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>

                            <p style={{ marginTop: 0 }}>
                                <p className="label">Stadt</p>
                                <input type="text" required style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>

                            <p style={{ marginTop: 0 }}>
                                <p className="label">GPS-Koordinaten</p>
                                <input type="text" required style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>

                            <p style={{ marginTop: 0 }}>
                                <p className="label">Land</p>
                                <input type="text" required style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>

                            <p style={{ marginTop: 0 }}>
                                <p className="label">PLZ</p>
                                <input type="text" required style={{ width: '100%', boxSizing: 'border-box' }}></input>
                            </p>
                        </div>

                        <h3 className="text" style={{ fontSize: 28, marginBottom: 10, marginTop: 30, alignSelf: 'flex-start', width: '100%' }}>Bemerkungen</h3>

                        <p style={{ marginTop: 0, width: '100%' }}>
                            <textarea 
                                style={{ 
                                    width: '100%', 
                                    minHeight: '100px', 
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(0, 0, 0, 0.2)',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="Ihre Bemerkungen..."
                            ></textarea>
                        </p>

                        <button
                            type="submit"
                            className="buttonDark"
                            disabled={hasSubmitted}
                            style={{
                                height: 10,
                                opacity: hasSubmitted ? 0.6 : 1,
                                cursor: hasSubmitted ? "not-allowed" : "pointer"
                            }}
                        >
                            {hasSubmitted ? "Anfrage wird erstellt..." : "Anfrage senden"}
                        </button>
                        </form>

                    </div>
                </div>
        </>
    )
}