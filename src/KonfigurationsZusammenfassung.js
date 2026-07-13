import { useEffect, useMemo, useState } from "react";

const OPENING_LABELS = {
    "leeröffnung": "Leeröffnung",
    fenster: "Fenster",
    "tür-öffnung": "Tür",
    schiebetür: "Schiebetür",
    rolltor: "Rolltor",
    sektionaltor: "Sektionaltor",
    transparentespaneel: "Transparentes Paneel",
    laderampe: "Laderampe",
    kleinlichtskuppel: "Lichtkuppel",
    photovoltaik: "Photovoltaik"
};

const OPENING_TYPES = new Set([
    "leeröffnung",
    "fenster",
    "tür-öffnung",
    "schiebetür",
    "rolltor",
    "sektionaltor",
    "transparentespaneel",
    "laderampe",
    "kleinlichtskuppel",
    "photovoltaik"
]);

const VALUE_MAPS = {
    dachArt: {
        satteldach: "Satteldach",
        pultdach: "Pultdach",
        flachdach: "Flachdach"
    },
    dachAusrichtung: {
        Rechts: "Rechte Seite höher",
        Links: "Linke Seite höher"
    },
    wandGeometrieVorgaben: {
        "verkleidete-wand-mit-sockel": "Verkleidete Wand mit Sockel",
        "verkleidete-wand": "Verkleidete Wand ohne Sockel",
        "massivwand": "Massivwand"
    },
    isolierung: {
        isoliert: "Isoliert",
        nichtisoliert: "Nicht isoliert"
    },
    paneeltyp: {
        trapez: "Trapezpaneel",
        sandwichelemente: "Sandwichelement",
        holzverkleidung: "Holzverkleidung"
    },
    wandOrientierung: {
        vertikal: "Vertikal",
        horizontal: "Horizontal"
    },
    farbSchema: {
        einfarbig: "Einfarbig",
        zweifarbig: "Zweifarbig",
        streifen: "Streifen"
    },
    dachPaneeltyp: {
        trapez: "Trapezpaneel",
        sandwichelemente: "Sandwichelement"
    },
    bereich: {
        wand: "Wand",
        dach: "Dach"
    },
    seite: {
        längswand: "Längswand",
        stirnwand: "Stirnwand"
    },
    richtung: {
        links: "Links",
        rechts: "Rechts"
    }
};

function isMeaningful(value) {
    if (value === null || value === undefined) {
        return false;
    }

    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        return normalized !== "" && normalized !== "?" && normalized !== "-" && normalized !== "unbekannt";
    }

    return true;
}

function prettify(value, mapKey) {
    if (!isMeaningful(value)) {
        return null;
    }

    if (mapKey && VALUE_MAPS[mapKey]) {
        return VALUE_MAPS[mapKey][value] || String(value);
    }

    return String(value);
}

function row(label, value, options = {}) {
    const { mapKey, suffix = "", precision = null, hideWhenZero = false } = options;

    if (!isMeaningful(value)) {
        return null;
    }

    if (hideWhenZero && Number(value) === 0) {
        return null;
    }

    let displayValue;

    if (typeof value === "number") {
        displayValue = precision === null ? String(value) : Number(value).toFixed(precision);
    } else {
        displayValue = prettify(value, mapKey);
    }

    if (!isMeaningful(displayValue)) {
        return null;
    }

    return {
        label,
        value: `${displayValue}${suffix}`
    };
}

function toMetersDistance(opening, rawValue) {
    if (!isMeaningful(rawValue)) {
        return null;
    }

    const numeric = Number(rawValue);
    if (!Number.isFinite(numeric)) {
        return null;
    }

    // Fenster-Bearbeitung zeigt Abstände in Welt-Einheiten an und rechnet dort /2.5 in Meter um.
    if (opening?.type === "fenster") {
        return numeric / 2.5;
    }

    return numeric;
}

function getOpeningDistances(opening, abmessung = {}) {
    if (opening?.bereich !== "wand") {
        return { bodenAbstand: null, linksAbstand: null, rechtsAbstand: null };
    }

    const hallLength = Number(abmessung?.länge);
    const hallWidth = Number(abmessung?.breite);
    const openingWidth = Number(opening?.breite);
    const openingHeight = Number(opening?.höhe);

    const wallSpanMeters = opening?.seite === "längswand" ? hallLength : hallWidth;

    const rightFromObj = toMetersDistance(opening, opening?.abstandRechts);
    const leftFromObj = toMetersDistance(opening, opening?.abstandLinks);
    const bottomFromObj = toMetersDistance(opening, opening?.abstandUnten);

    let rechtsAbstand = null;
    let linksAbstand = null;
    let bodenAbstand = null;

    if (Number.isFinite(leftFromObj) && Number.isFinite(wallSpanMeters) && Number.isFinite(openingWidth)) {
        linksAbstand = Math.max(0, leftFromObj);
        rechtsAbstand = Math.max(0, wallSpanMeters - openingWidth - linksAbstand);
    } else if (Number.isFinite(rightFromObj) && Number.isFinite(wallSpanMeters) && Number.isFinite(openingWidth)) {
        rechtsAbstand = Math.max(0, rightFromObj);
        linksAbstand = Math.max(0, wallSpanMeters - openingWidth - rechtsAbstand);
    } else if (Number.isFinite(wallSpanMeters) && Number.isFinite(openingWidth)) {
        const axisCoord = opening?.seite === "längswand"
            ? Number(opening?.startPos?.x)
            : Number(opening?.startPos?.z);

        if (Number.isFinite(axisCoord)) {
            const halfSpanWorld = ((wallSpanMeters * 2.5) - 2) / 2;
            const widthWorld = openingWidth * 2.5;
            const leftEdge = -halfSpanWorld;
            const rightEdge = halfSpanWorld;
            const openingLeft = axisCoord - (widthWorld / 2);
            const openingRight = axisCoord + (widthWorld / 2);

            linksAbstand = Math.max(0, (openingLeft - leftEdge) / 2.5);
            rechtsAbstand = Math.max(0, (rightEdge - openingRight) / 2.5);
        }
    }

    if (Number.isFinite(bottomFromObj)) {
        bodenAbstand = Math.max(0, bottomFromObj);
    } else if (Number.isFinite(openingHeight)) {
        const rawY = Number(opening?.startPos?.y);
        if (Number.isFinite(rawY)) {
            const centerYWorld = opening?.type === "fenster" ? rawY + 4 : rawY;
            const openingBottomWorld = centerYWorld - ((openingHeight * 2.5) / 2);
            bodenAbstand = Math.max(0, openingBottomWorld / 2.5);
        }
    }

    return { bodenAbstand, linksAbstand, rechtsAbstand };
}

function openingCard(opening, index, abmessung) {
    const titleBase = OPENING_LABELS[opening?.type] || "Öffnung";
    const distances = getOpeningDistances(opening, abmessung);
    const details = [
        row("Bereich", opening?.bereich, { mapKey: "bereich" }),
        row("Wand", opening?.seite, { mapKey: "seite" }),
        row("Richtung", opening?.richtung, { mapKey: "richtung" }),
        row("Breite", opening?.breite, { suffix: " m" }),
        row("Höhe", opening?.höhe, { suffix: " m" }),
        row("Farbe", opening?.farbe),
        row("Abstand zum Boden", distances.bodenAbstand, { suffix: " m", precision: 2 }),
        row("Abstand linker Rand", distances.linksAbstand, { suffix: " m", precision: 2 }),
        row("Abstand rechter Rand", distances.rechtsAbstand, { suffix: " m", precision: 2 })
    ].filter(Boolean);

    if (details.length === 0) {
        return null;
    }

    return {
        title: `${titleBase} #${index + 1}`,
        details
    };
}

function mapLiveOpeningItem(obj, index) {
    return {
        id: obj?.id ?? `opening-${index}`,
        type: obj?.type ?? "unbekannt",
        bereich: obj?.bereich === "dach" ? "dach" : "wand",
        seite: obj?.lang ? "längswand" : "stirnwand",
        richtung: obj?.rechts ? "rechts" : "links",
        breite: obj?.value?.[0],
        höhe: obj?.value?.[1],
        abstandLinks: obj?.abstandLinks,
        abstandRechts: obj?.abstandRechts,
        abstandUnten: obj?.abstandUnten,
        farbe: obj?.farbe ?? obj?.fensterFarbe ?? obj?.rahmenFarbe ?? null,
        startPos: {
            x: obj?.startPos?.x,
            y: obj?.startPos?.y,
            z: obj?.startPos?.z
        }
    };
}

export default function KonfigurationsZusammenfassung({ setSchirm, setShowApp, summaryData, liveObjs = [] }) {
    const abmessung = summaryData?.abmessung || {};
    const verkleidung = summaryData?.verkleidung || {};
    const oeffnungen = summaryData?.öffnungen || {};
    const konstruktion = summaryData?.konstruktion || {};

    const openingItems = Array.isArray(liveObjs) && liveObjs.length > 0
        ? liveObjs
            .filter((obj) => OPENING_TYPES.has(obj?.type))
            .map((obj, index) => mapLiveOpeningItem(obj, index))
        : (Array.isArray(oeffnungen.items) ? oeffnungen.items : []);

    const openingCards = openingItems
        .map((opening, index) => openingCard(opening, index, abmessung))
        .filter(Boolean);

    const openingRows = [
        row("Gesamtanzahl", openingItems.length, { hideWhenZero: true }),
        oeffnungen.überlappung ? { label: "Hinweis", value: "Überlappung erkannt" } : null
    ].filter(Boolean);

    const baseSections = [
        {
            title: "Abmessung",
            rows: [
                row("Breite", abmessung.breite, { suffix: " m" }),
                row("Länge", abmessung.länge, { suffix: " m" }),
                row("Traufhöhe", abmessung.höhe, { suffix: " m" }),
                row("Dachart", abmessung.dachArt, { mapKey: "dachArt" }),
                row("Dachneigung", abmessung.dachneigung, { suffix: "°" }),
                row("Dachausrichtung", abmessung.dachAusrichtung, { mapKey: "dachAusrichtung" })
            ].filter(Boolean),
            cards: []
        },
        {
            title: "Verkleidung",
            rows: [
                row("Wandausführung", verkleidung.wandGeometrieVorgaben, { mapKey: "wandGeometrieVorgaben" }),
                row("Wand-Isolierung", verkleidung.isolierung, { mapKey: "isolierung" }),
                row("Wand-Paneeltyp", verkleidung.paneeltyp, { mapKey: "paneeltyp" }),
                row("Wand-Paneelbreite", verkleidung.paneelBreiteMm, { suffix: " mm" }),
                row("Wand-Ausrichtung", verkleidung.wandOrientierung, { mapKey: "wandOrientierung" }),
                row("Farbkonzept", verkleidung.farbSchema, { mapKey: "farbSchema" }),
                row("Außenfarbe", verkleidung.außenFarbe),
                row("Dach-Isolierung", verkleidung.dachIsolierung, { mapKey: "isolierung" }),
                row("Dach-Paneeltyp", verkleidung.dachPaneeltyp, { mapKey: "dachPaneeltyp" }),
                row("Dachfarbe", verkleidung.dachAußenFarbe)
            ].filter(Boolean),
            cards: []
        },
        {
            title: "Öffnungen",
            rows: openingRows,
            cards: openingCards
        },
        {
            title: "Konstruktion",
            rows: [
                row("Bodenplatte", konstruktion.bodenplatteFarbe),
                row("Rahmen", konstruktion.rahmenFarbe),
                row("Sekundärstruktur", konstruktion.sekundärKonstruktionsFarbe),
                row("Sekundärstruktur Holz", konstruktion.sekundärHolzKonstruktionsFarbe),
                row("Zubehör", konstruktion.zubehörFarbe),
                row("Kantteile", konstruktion.kantenFarbe),
                row("Kransystem", konstruktion.kranKapazität)
            ].filter(Boolean),
            cards: []
        }
    ];

    const sections = baseSections.filter((section) => section.rows.length > 0 || section.cards.length > 0);

    const revealOrder = useMemo(() => {
        let cursor = 0;
        return sections.map((section) => {
            const headingIndex = cursor;
            cursor += 1;
            const rows = section.rows.map((row) => {
                const rowWithIndex = {
                    ...row,
                    revealIndex: cursor
                };
                cursor += 1;
                return rowWithIndex;
            });

            const cards = (section.cards || []).map((card) => {
                const cardWithIndex = {
                    ...card,
                    revealIndex: cursor
                };
                cursor += 1;
                return cardWithIndex;
            });

            return {
                ...section,
                headingIndex,
                rows,
                cards
            };
        });
    }, [sections]);

    const totalRevealItems = useMemo(() => {
        return revealOrder.reduce((sum, section) => sum + 1 + section.rows.length + section.cards.length, 0);
    }, [revealOrder]);

    const [visibleItems, setVisibleItems] = useState(0);

    useEffect(() => {
        setVisibleItems(0);

        const intervalId = window.setInterval(() => {
            setVisibleItems((current) => {
                if (current >= totalRevealItems) {
                    window.clearInterval(intervalId);
                    return current;
                }
                return current + 1;
            });
        }, 95);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [totalRevealItems]);

    return (
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
                    position: "relative"
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
                        zIndex: 1
                    }}
                >
                    Zur Halle
                </button>

                <img src="/LogoPerthel.png" alt="Logo" style={{ width: 200, marginBottom: 0 }} />

                <h2 style={{ fontSize: 40, marginBottom: 8 }}>Konfigurations-Check</h2>
                <p className="text" style={{ marginTop: 0, marginBottom: 24, textAlign: "center", maxWidth: 640 }}>
                    Prüfen Sie jetzt Ihre Auswahl Schritt für Schritt. Erst danach geht es ins Kontaktformular.
                </p>

                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 18 }}>
                    {revealOrder.map((section) => (
                        <div
                            key={section.title}
                            style={{
                                border: "1px solid rgba(0, 0, 0, 0.12)",
                                borderRadius: 12,
                                padding: "12px 14px",
                                background: "rgba(247, 247, 247, 0.65)",
                                opacity: visibleItems > section.headingIndex ? 1 : 0,
                                transform: visibleItems > section.headingIndex ? "translateY(0)" : "translateY(8px)",
                                transition: "opacity 280ms ease, transform 280ms ease"
                            }}
                        >
                            <h3 className="text" style={{ margin: "4px 0 12px", fontSize: 22 }}>{section.title}</h3>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 14px" }}>
                                {section.rows.map((row) => (
                                    <div
                                        key={`${section.title}-${row.label}`}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            gap: 12,
                                            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                                            paddingBottom: 5,
                                            opacity: visibleItems > row.revealIndex ? 1 : 0,
                                            transform: visibleItems > row.revealIndex ? "translateY(0)" : "translateY(6px)",
                                            transition: "opacity 240ms ease, transform 240ms ease"
                                        }}
                                    >
                                        <span className="text" style={{ opacity: 0.7 }}>{row.label}</span>
                                        <span className="text" style={{ fontWeight: 600, textAlign: "right" }}>{row.value}</span>
                                    </div>
                                ))}
                            </div>

                            {section.cards.length > 0 && (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginTop: section.rows.length > 0 ? 12 : 0 }}>
                                    {section.cards.map((card) => (
                                        <div
                                            key={`${section.title}-${card.title}`}
                                            style={{
                                                border: "1px solid rgba(0, 0, 0, 0.1)",
                                                borderRadius: 10,
                                                background: "#ffffff",
                                                padding: "10px 12px",
                                                opacity: visibleItems > card.revealIndex ? 1 : 0,
                                                transform: visibleItems > card.revealIndex ? "translateY(0)" : "translateY(8px)",
                                                transition: "opacity 260ms ease, transform 260ms ease"
                                            }}
                                        >
                                            <h4 className="text" style={{ margin: "0 0 8px", fontSize: 15 }}>{card.title}</h4>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                                {card.details.map((detail) => (
                                                    <div key={`${card.title}-${detail.label}`} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                                                        <span className="text" style={{ opacity: 0.65, fontSize: 12 }}>{detail.label}</span>
                                                        <span className="text" style={{ fontSize: 12, fontWeight: 600, textAlign: "right" }}>{detail.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    className="buttonDark"
                    onClick={() => setSchirm("kontakt")}
                    style={{ marginTop: 26, width: "100%", maxWidth: 420 }}
                >
                    Weiter zum Kontaktformular
                </button>
            </div>
        </div>
    );
}
