

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
            <div className="savePageShell">
                <div className="savePageAmbientOrbs" aria-hidden="true">
                    <span className="savePageOrb savePageOrbOne" />
                    <span className="savePageOrb savePageOrbTwo" />
                </div>

                <div className="savePageCard summaryCard">
                    <button
                        type="button"
                        className="savePageBackButton"
                        onClick={() => setShowApp("app")}
                    >
                        Zur Halle
                    </button>

                    <img src="/LogoPerthel.png" alt="Logo" className="savePageLogo" />
                    <p className="landingEyebrow">Kontakt</p>
                    <h2 className="savePageTitle">Kontaktformular</h2>

                    <form onSubmit={handleSubmit} className="contactForm">
                        <h3 className="contactSectionTitle">Kunde</h3>

                        <div className="contactGrid">
                            <label className="contactField">
                                <span>Firma</span>
                                <input type="text" required />
                            </label>

                            <label className="contactField">
                                <span>USt.-IdNr.</span>
                                <input type="text" required />
                            </label>

                            <label className="contactField">
                                <span>Ansprechpartner</span>
                                <input type="text" required />
                            </label>

                            <label className="contactField">
                                <span>E-Mail</span>
                                <input type="email" required />
                            </label>

                            <label className="contactField">
                                <span>Telefon</span>
                                <input type="tel" required />
                            </label>
                        </div>

                        <h3 className="contactSectionTitle">Standort des Projektes</h3>

                        <div className="contactGrid">
                            <label className="contactField">
                                <span>Straße</span>
                                <input type="text" required />
                            </label>

                            <label className="contactField">
                                <span>Stadt</span>
                                <input type="text" required />
                            </label>

                            <label className="contactField">
                                <span>GPS-Koordinaten</span>
                                <input type="text" required />
                            </label>

                            <label className="contactField">
                                <span>Land</span>
                                <input type="text" required />
                            </label>

                            <label className="contactField">
                                <span>PLZ</span>
                                <input type="text" required />
                            </label>
                        </div>

                        <h3 className="contactSectionTitle">Bemerkungen</h3>

                        <label className="contactField contactFieldFull">
                            <span>Ihre Bemerkungen</span>
                            <textarea
                                placeholder="Ihre Bemerkungen..."
                            />
                        </label>

                        <button
                            type="submit"
                            className="button savePageButton contactSubmitButton"
                            disabled={hasSubmitted}
                        >
                            {hasSubmitted ? "Anfrage wird erstellt..." : "Anfrage senden"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}