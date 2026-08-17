import React, { useEffect, useMemo, useRef } from 'react';
import '../styles.css';
import MuiNumberfield from './MuiNumberfield';
import MuiSelect from './MuiSelect';
import MuiTextfeld from './MuiTextfeld';
import { hasAnyOpeningCollision } from './openingUtils';

const HOLZ_FARBE = '#9f764e';
const PANEL_ANIMATION_OPEN_MS = 260;
const PANEL_ANIMATION_CLOSE_MS = 170;
const PANEL_ANIMATION_EASING = 'cubic-bezier(0.2, 0.65, 0.3, 1)';

function countOpeningsByType(objs = []) {
    const openingTypes = new Set([
        'leeröffnung',
        'fenster',
        'tür-öffnung',
        'schiebetür',
        'rolltor',
        'sektionaltor',
        'transparentespaneel',
        'laderampe',
        'kleinlichtskuppel',
        'photovoltaik'
    ]);

    return (objs || []).reduce((acc, obj) => {
        const type = obj?.type;
        if (!openingTypes.has(type)) {
            return acc;
        }

        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});
}

function mapOpeningSummaryItem(obj, index) {
    return {
        id: obj?.id ?? `opening-${index}`,
        type: obj?.type ?? 'unbekannt',
        bereich: obj?.bereich === 'dach' ? 'dach' : 'wand',
        seite: obj?.lang ? 'längswand' : 'stirnwand',
        richtung: obj?.rechts ? 'rechts' : 'links',
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

export default function UiButtonEdit({ 
    height, 
    name,
    isVisible = true,
    enablePanelAnimation = false,
    setShowApp3,
    setShowAppKontakt,
    // Abmessungs-Props (aus App.js)
    breite,
    setBreite,
    länge,
    setLänge,
    höhe,
    setHöhe,
    dachArt,
    setDachArt,
    traufhöhe,
    setTraufhöhe,
    dachneigung,
    setDachneigung,
    sockelhöhe,
    setSockelhöhe,
    dachAusrichtung,
    setDachAusrichtung,
    diffTraufFirst,
    setDiffTraufFirst,
    // Verkleidungs-Props (aus App.js)
    wandGeometrieVorgaben,
    setWandGeometrieVorgaben,
    isolierung,
    setIsolierung,
    paneeltyp,
    setPaneeltyp,
        paneelBreiteMm,
        setPaneelBreiteMm,
    wandOrientierung,
    setWandOrientierung,
    farbSchema,
    setFarbSchema,
    außenFarbe,
    setAußenFarbe,
    außenFarbeMuster,
    setAußenFarbeMuster,
    musterVerortung,
    setMusterVerortung,
    dachIsolierung,
    setDachIsolierung,
    dachPaneeltyp,
    setDachPaneeltyp,
    dachPaneelBreiteMm,
    setDachPaneelBreiteMm,
    dachAußenFarbe,
    setDachAußenFarbe,
    dachPvcName,
    setDachPvcName,
    pvcName,
    setPvcName,
    // Öffnungs-Props (aus App.js)
    fensterFarbe,
    setFensterFarbe,
    türFarbe,
    setTürFarbe,
    schiebeTorFarbe,
    setSchiebeTorFarbe,
    rollTorFarbe,
    setRollTorFarbe,
    sektionalTorFarbe,
    setSektionalTorFarbe,
    türFarbeInnen,
    setTürFarbeInnen,
    sektionalTorFarbeInnen,
    setSektionalTorFarbeInnen,
    // Angebots-Props (aus App.js)
    gebäudeZweck,
    setGebäudeZweck,
    bauBeginn,
    setBauBeginn,
    anwerbungKunden,
    setAnwerbungKunden,
    größeGebäudeM2,
    setGrößeGebäudeM2,
    // Konstruktions-Props (aus App.js)
    bodenplatteFarbe,
    setBodenplatteFarbe,
    rahmenFarbe,
    setRahmenFarbe,
    sekundärKonstruktionsFarbe,
    setSekundärKonstruktionsFarbe,
    sekundärHolzKonstruktionsFarbe,
    setSekundärHolzKonstruktionsFarbe,
    // Zubehör-Props (aus App.js)
    zubehörFarbe,
    setZubehörFarbe,
    kantenFarbe,
    setKantenFarbe,
    kranKapazität,
    setKranKapazität,
    objs = [],
    // Darstellungs-Props (aus App.js)
    abmessungenAnzeigen,
    setAbmessungenAnzeigen,
}) {
    const hasMountedRef = useRef(false);
    const refreshTimeoutRef = useRef(null);
    const previousDimensionsRef = useRef({ breite, länge, höhe, dachArt });

    // Bei echten Änderungen im Abmessungen-Menü die Maßlinien kurz aus/an schalten,
    // damit die Darstellung sauber neu aufgebaut wird.
    useEffect(() => {
        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            previousDimensionsRef.current = { breite, länge, höhe, dachArt };
            return;
        }

        const prev = previousDimensionsRef.current;
        const hasDimensionChange = (
            prev.breite !== breite
            || prev.länge !== länge
            || prev.höhe !== höhe
            || prev.dachArt !== dachArt
        );

        previousDimensionsRef.current = { breite, länge, höhe, dachArt };

        if (name !== 'Abmessungen' || !hasDimensionChange || !abmessungenAnzeigen) {
            return;
        }

        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
        }

        setAbmessungenAnzeigen(false);
        refreshTimeoutRef.current = setTimeout(() => {
            setAbmessungenAnzeigen(true);
            refreshTimeoutRef.current = null;
        }, 10);
    }, [abmessungenAnzeigen, breite, dachArt, höhe, länge, name, setAbmessungenAnzeigen]);

    useEffect(() => {
        return () => {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
                refreshTimeoutRef.current = null;
                setAbmessungenAnzeigen(true);
            }
        };
    }, [setAbmessungenAnzeigen]);

    // Setze sockelhöhe auf 0, wenn "Verkleidete Wand" ohne Sockel gewählt wird
    useEffect(() => {
        if (wandGeometrieVorgaben === 'verkleidete-wand') {
            setSockelhöhe(0);
        }
    }, [setSockelhöhe, wandGeometrieVorgaben]);

    // Holzverkleidung soll keinen alten Muster-/Streifen-Zustand behalten.
    useEffect(() => {
        if (paneeltyp === 'holzverkleidung') {
            setFarbSchema('einfarbig');
            setAußenFarbe(HOLZ_FARBE);
            setAußenFarbeMuster(HOLZ_FARBE);
            return;
        }
        setAußenFarbe('white');
    }, [paneeltyp, setAußenFarbe, setAußenFarbeMuster, setFarbSchema]);

    const hasOpeningOverlap = useMemo(() => {
        const openingTypes = new Set([
            'leeröffnung',
            'fenster',
            'tür-öffnung',
            'schiebetür',
            'rolltor',
            'sektionaltor',
            'transparentespaneel',
            'laderampe',
            'kleinlichtskuppel',
            'photovoltaik'
        ]);

        const openingObjs = (objs || []).filter((obj) => openingTypes.has(obj?.type));
        return hasAnyOpeningCollision(openingObjs);
    }, [objs]);

    function buildAnfrageZusammenfassung() {
        const openingTypes = new Set([
            'leeröffnung',
            'fenster',
            'tür-öffnung',
            'schiebetür',
            'rolltor',
            'sektionaltor',
            'transparentespaneel',
            'laderampe',
            'kleinlichtskuppel',
            'photovoltaik'
        ]);
        const openingObjects = (objs || []).filter((obj) => openingTypes.has(obj?.type));
        const openingCounts = countOpeningsByType(openingObjects);
        const openingItems = openingObjects.map((obj, index) => mapOpeningSummaryItem(obj, index));
        const openingTotal = openingItems.length;
        const relevanteDachAusrichtung = dachArt === 'pultdach' ? dachAusrichtung : null;

        return {
            abmessung: {
                breite,
                länge,
                höhe,
                dachArt,
                traufhöhe,
                dachneigung,
                dachAusrichtung: relevanteDachAusrichtung,
                diffTraufFirst
            },
            verkleidung: {
                wandGeometrieVorgaben,
                isolierung,
                paneeltyp,
                paneelBreiteMm,
                wandOrientierung,
                farbSchema,
                außenFarbe,
                außenFarbeMuster,
                musterVerortung,
                dachIsolierung,
                dachPaneeltyp,
                dachPaneelBreiteMm,
                dachAußenFarbe,
                dachPvcName,
                pvcName
            },
            öffnungen: {
                gesamt: openingTotal,
                überlappung: hasOpeningOverlap,
                countsByType: openingCounts,
                items: openingItems,
                fensterFarbe,
                türFarbe,
                türFarbeInnen,
                schiebeTorFarbe,
                rollTorFarbe,
                sektionalTorFarbe,
                sektionalTorFarbeInnen
            },
            konstruktion: {
                bodenplatteFarbe,
                rahmenFarbe,
                sekundärKonstruktionsFarbe,
                sekundärHolzKonstruktionsFarbe,
                zubehörFarbe,
                kantenFarbe,
                kranKapazität
            }
        };
    }

    function abmessungsUI() {
        return(
            <>
                {/* Abmessungen */}
                <div style={{marginLeft: '15px'}}>
                    <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        alignItems: 'center', 
                        marginBottom: "8px", 
                        justifyContent: 'space-between', 
                        marginRight: "15px"
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className='text' style={{ fontWeight: 200}}>Breite</span>
                            <span className='text' style={{ fontSize: 12}}>3-100</span>
                        </div>
                        <MuiNumberfield label={'Meter'} min={3} max={100} state={breite} setState={setBreite} />
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        alignItems: 'center', 
                        marginBottom: "8px", 
                        justifyContent: 'space-between',
                        marginRight: "15px" 
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className='text' style={{ fontWeight: 200}}>Länge</span>
                            <span className='text' style={{ fontSize: 12 }}>6-200</span>
                        </div>
                        <MuiNumberfield label={'Meter'} min={6} max={200} state={länge} setState={setLänge} />
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        alignItems: 'center', 
                        marginBottom: "15px", 
                        justifyContent: 'space-between',
                        marginRight: "15px"
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className='text' style={{ fontWeight: 200}}>Traufhöhe</span>
                            <span className='text' style={{ fontSize: 12 }}>3-30</span>
                        </div>
                        <MuiNumberfield label={'Meter'} min={3} max={30} state={höhe} setState={setHöhe} />
                    </div>
                </div>

                {/* Dach */}
                <div style={{
                    margin: "8px",
                    paddingBottom: "4px",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                }}>
                    <p className='text' style={{ fontSize: 17, }}>
                        Dach
                    </p>
                </div>
                <div style={{marginLeft: '15px'}}>
                    <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        alignItems: 'center', 
                        marginBottom: "8px", 
                        justifyContent: 'space-between', 
                        marginRight: "15px"
                    }}>
                        <p className='text' style={{ fontWeight: 200}}>Dachart</p>
                        <MuiSelect
                            option1={'Flachdach'}
                            value1={'flachdach'}
                            option2={'Satteldach'}
                            value2={'satteldach'}
                            option3={'Pultdach'}
                            value3={'pultdach'}
                            state={dachArt}
                            setState={setDachArt}
                        />
                    </div>
                    
                    {dachArt === 'pultdach' && (
                        <>
                            {/*
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "8px", 
                                justifyContent: 'space-between', 
                                marginRight: "15px"
                            }}>
                                <p className='text' style={{ fontWeight: 200}}>Dachausrichtung</p>
                                <MuiSelect
                                    option1={'Links'}
                                    value1={'Links'}
                                    option2={'Rechts'}
                                    value2={'Rechts'}
                                    state={dachAusrichtung}
                                    setState={setDachAusrichtung}
                                />
                            </div>
                            */}
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "8px", 
                                justifyContent: 'space-between',
                                marginRight: "15px" 
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className='text' style={{ fontWeight: 200}}>Differenz aus First- und Traufhöhe</span>
                                    <span className='text' style={{ fontSize: 12 }}>1-20</span>
                                </div>
                                <MuiNumberfield label={'m'} min={0} max={20} state={dachneigung} setState={setDachneigung} />
                            </div>
                        </>
                    )}

                    {dachArt === 'satteldach' && (
                        <>
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "8px", 
                                justifyContent: 'space-between',
                                marginRight: "15px" 
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className='text' style={{ fontWeight: 200}}>Differenz aus First- und Traufhöhe</span>
                                    <span className='text' style={{ fontSize: 12 }}>1-20</span>
                                </div>
                                <MuiNumberfield label={'m'} min={1} max={20} state={diffTraufFirst} setState={setDiffTraufFirst} />
                            </div>
                        </>
                    )}

                </div>
            </>
        )
    }

    function verkleidungUI() {

        return(

            <div style={{ margin: '15px' }}>
                <div>
                    <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Wandgeometrie-Vorgaben:</p>
                    <div style={{ margin: '5px'}}>
                        <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            alignItems: 'center', 
                            marginBottom: "12px", 
                            justifyContent: 'space-between', 
                            marginRight: "15px",
                        }}>
                            <span className='text' style={{ fontWeight: 200}}>Einstellung</span>
                            <MuiSelect
                                option1={'Verkleidete Wand'}
                                value1={'verkleidete-wand'}
                                option2={'Verkleidete Wand mit Sockel'}
                                value2={'verkleidete-wand-mit-sockel'}
                                label={'Wand'}
                                state={wandGeometrieVorgaben}
                                setState={setWandGeometrieVorgaben}
                            />
                        </div>

                        {wandGeometrieVorgaben === 'verkleidete-wand-mit-sockel' && (
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "12px", 
                                justifyContent: 'space-between',
                                marginRight: "15px" 
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className='text' style={{ fontWeight: 200}}>Sockelhöhe</span>
                                    <span className='text' style={{ fontSize: 12 }}>1-3</span>
                                </div>
                                <MuiNumberfield label={'Meter'} min={1} max={3} state={sockelhöhe} setState={setSockelhöhe} />
                            </div>
                        )}
                    </div>

                    {/* Wandverkleidungs-Vorgaben */}
                    <p className='text' style={{ fontSize: 13, marginBottom: "6px", marginTop: '8px' }}>Wandverkleidungs-Vorgaben:</p>
                    <div style={{ margin: '5px'}}>
                        <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            alignItems: 'center', 
                            marginBottom: "8px", 
                            justifyContent: 'space-between', 
                            marginRight: "15px",
                        }}>
                            <span className='text' style={{ fontWeight: 200}}>Isolierung</span>
                            <MuiSelect
                                option1={'Isoliert'}
                                value1={'isoliert'}
                                option2={'Nicht Isoliert'}
                                value2={'nicht-isoliert'}
                                label={'Wand'}
                                state={isolierung}
                                setState={setIsolierung}
                            />
                        </div>
                        
                        {isolierung === "nicht-isoliert" && (
                            <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            alignItems: 'center', 
                            marginBottom: "8px", 
                            justifyContent: 'space-between', 
                            marginRight: "15px",
                            }}>
                                <span className='text' style={{ fontWeight: 200}}>Paneeltyp</span>
                                <MuiSelect
                                    option1={'Trapez'}
                                    value1={'trapez'}
                                    option2={'Wellplatte'}
                                    value2={'wellplatte'}
                                    option3={'PVC-Folie'}
                                    value3={'pvc-folie'}
                                    option4={'Holzverkleidung'}
                                    value4={'holzverkleidung'}
                                    label={'Wand'}
                                    state={paneeltyp}
                                    setState={setPaneeltyp}
                                />
                            </div>
                        )}
                        
                        {/* Gebäudeverkleidung */}
                        <p className='text' style={{ fontSize: 12, marginBottom: "6px", marginTop: '8px' }}>Gebäudeverkleidung:</p>

                        {(paneeltyp === 'pvc-folie' && isolierung === 'nicht-isoliert') && (
                            <>

                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "8px", 
                                justifyContent: 'space-between', 
                                marginRight: "15px",
                                marginLeft: '5px'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className='text' style={{ fontWeight: 200}}>Name</span>
                                </div>
                                <MuiTextfeld
                                label={'Muster'}
                                state={pvcName}
                                setState={setPvcName}
                                />
                            </div>


                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "8px", 
                                justifyContent: 'space-between', 
                                marginRight: "15px",
                                marginLeft: '5px'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className='text' style={{ fontWeight: 200}}>Breite</span>
                                    <span className='text' style={{ fontSize: 12}}>500-2500</span>
                                </div>
                                    <MuiNumberfield label={'mm'} min={500} max={2500} state={paneelBreiteMm} setState={setPaneelBreiteMm} />
                            </div>

                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "8px", 
                                justifyContent: 'space-between', 
                                marginRight: "15px",
                                marginLeft: '5px'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className='text' style={{ fontWeight: 200}}>Dicke</span>
                                    <span className='text' style={{ fontSize: 12}}>1-10</span>
                                </div>
                                <MuiNumberfield label={'mm'} min={1} max={10} />
                            </div>

                            </>

                        )}

                        <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            alignItems: 'center', 
                            marginBottom: "8px", 
                            justifyContent: 'space-between', 
                            marginRight: "15px",
                            marginLeft: '5px'
                        }}>
                            <span className='text' style={{ fontWeight: 200}}>Orientierung</span>
                            <MuiSelect
                            option1={'Vertikal'}
                            value1={'vertikal'}
                            option2={'Horizontal'}
                            value2={'horizontal'}
                            label={'Wand'}
                            state={wandOrientierung}
                            setState={setWandOrientierung}
                            />
                        </div>

                        {paneeltyp !== 'holzverkleidung' && (
                            <p className='text' style={{ fontSize: 12, marginBottom: "6px", marginTop: '8px', marginLeft: '10px' }}>Farbschema:</p>
                        )}

                        {(isolierung === "nicht-isoliert" && paneeltyp !== "holzverkleidung") && (
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "8px", 
                                justifyContent: 'space-between', 
                                marginRight: "15px",
                                marginLeft: '10px'
                            }}>
                                <span className='text' style={{ fontWeight: 200}}>Farbschema</span>
                                <MuiSelect
                                option1={'Einfarbig'}
                                value1={'einfarbig'}
                                option2={'Musterfsrbe'}
                                value2={'musterfarbe'}
                                option3={'Musterfarbe bei'}
                                value3={'musterfarbe-bei'}
                                option4={'Gleichmäßige Streifen'}
                                value4={'gleichmäßige-streifen'}
                                option5={'Jede zweite Platte'}
                                value5={'jede-zweite-platte'}
                                label={'Farbe'}
                                state={farbSchema}
                                setState={setFarbSchema}
                                />
                            </div>
                        )}

                        {farbSchema === 'musterfarbe-bei' && (
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "8px", 
                                justifyContent: 'space-between', 
                                marginRight: "15px",
                                marginLeft: '10px'
                            }}>
                                <span className='text' style={{ fontWeight: 200, marginLeft: '6px', fontSize: 12, marginRight: '28px' }}>Farbe Außenseite Muster</span>
                                <MuiTextfeld
                                label={'Muster'}
                                state={musterVerortung}
                                setState={setMusterVerortung}
                                />
                            </div>
                        )}

                        {paneeltyp !== 'holzverkleidung' && (
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "8px", 
                                justifyContent: 'space-between', 
                                marginRight: "15px",
                                marginLeft: '10px'
                            }}>
                                <span className='text' style={{ fontWeight: 200, marginLeft: '6px', fontSize: 12, marginRight: '25px' }}>Außenfarbe</span>
                                <MuiSelect
                                option1={'Grau'}
                                value1={'grey'}
                                option2={'Weiß'}
                                value2={'white'}
                                option3={'Grün'}
                                value3={'green'}
                                label={'Farbe'}
                                state={außenFarbe}
                                setState={setAußenFarbe}
                                />
                            </div>
                        )}

                        {(farbSchema === 'musterfarbe'
                        || 
                        farbSchema === 'musterfarbe-bei' 
                        ||
                        farbSchema === 'gleichmäßige-streifen' 
                        ||
                        farbSchema === 'jede-zweite-platte') && paneeltyp !== 'holzverkleidung' && (
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "8px", 
                                justifyContent: 'space-between', 
                                marginRight: "15px",
                                marginLeft: '10px'
                            }}>
                                <span className='text' style={{ fontWeight: 200, marginLeft: '6px', fontSize: 12, marginRight: '28px' }}>Farbe Außenseite Muster</span>
                                <MuiSelect
                                option1={'Grau'}
                                value1={'grey'}
                                option2={'Weiß'}
                                value2={'white'}
                                option3={'Grün'}
                                value3={'green'}
                                label={'Farbe'}
                                state={außenFarbeMuster}
                                setState={setAußenFarbeMuster}
                                />
                            </div>
                        )}
                    
                    {/* Dachverkleidungsvorgaben */}
                    <p className='text' style={{ fontSize: 13, marginBottom: "6px", marginTop: '12px' }}>Dachverkleidungsvorgaben:</p>
                    <div style={{ margin: '5px' }}>

                        <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            alignItems: 'center', 
                            marginBottom: "8px", 
                            justifyContent: 'space-between', 
                            marginRight: "15px",
                        }}>
                            <span className='text' style={{ fontWeight: 200}}>Isolierung</span>
                            <MuiSelect
                                option1={'Isoliert'}
                                value1={'isoliert'}
                                option2={'Nicht Isoliert'}
                                value2={'nicht-isoliert'}
                                label={'Wand'}
                                state={dachIsolierung}
                                setState={setDachIsolierung}
                            />
                        </div>

                        {dachIsolierung === "nicht-isoliert" && (
                            <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            alignItems: 'center', 
                            marginBottom: "8px", 
                            justifyContent: 'space-between', 
                            marginRight: "15px",
                            }}>
                                <span className='text' style={{ fontWeight: 200}}>Paneeltyp</span>
                                <MuiSelect
                                    option1={'Trapez'}
                                    value1={'trapez'}
                                    option2={'Wellplatte'}
                                    value2={'wellplatte'}
                                    option3={'PVC-Folie'}
                                    value3={'pvc-folie'}
                                    label={'Wand'}
                                    state={dachPaneeltyp}
                                    setState={setDachPaneeltyp}
                                />
                            </div>
                        )}

                        {/* Gebäudeverkleidung Dach */}
                        <p className='text' style={{ fontSize: 12, marginBottom: "6px", marginTop: '8px' }}>Gebäudeverkleidung:</p>

                        {dachPaneeltyp === 'pvc-folie' && dachIsolierung === 'nicht-isoliert' && (
                            <>

                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "8px", 
                                justifyContent: 'space-between', 
                                marginRight: "15px",
                                marginLeft: '5px'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className='text' style={{ fontWeight: 200}}>Name</span>
                                </div>
                                <MuiTextfeld
                                label={'Muster'}
                                state={dachPvcName}
                                setState={setDachPvcName}
                                />
                            </div>


                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "8px", 
                                justifyContent: 'space-between', 
                                marginRight: "15px",
                                marginLeft: '5px'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className='text' style={{ fontWeight: 200}}>Breite</span>
                                    <span className='text' style={{ fontSize: 12}}>500-6000</span>
                                </div>
                                <MuiNumberfield label={'mm'} min={500} max={6000} state={dachPaneelBreiteMm} setState={setDachPaneelBreiteMm} />
                            </div>

                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "8px", 
                                justifyContent: 'space-between', 
                                marginRight: "15px",
                                marginLeft: '5px'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className='text' style={{ fontWeight: 200}}>Dicke</span>
                                    <span className='text' style={{ fontSize: 12}}>1-10</span>
                                </div>
                                <MuiNumberfield label={'mm'} min={1} max={10} />
                            </div>

                            </>

                        )}

                        <div style={{ margin: '5px' }}>
                            <p className='text' style={{ fontSize: 12, marginBottom: "6px", marginTop: '8px' }}>Farbschema:</p>
                        
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center', 
                                marginBottom: "8px", 
                                justifyContent: 'space-between', 
                                marginRight: "15px",
                                marginLeft: '10px'
                            }}>
                                <span className='text' style={{ fontWeight: 200, marginLeft: '6px', fontSize: 12, marginRight: '25px' }}>Außenfarbe</span>
                                <MuiSelect
                                option1={'Grau'}
                                value1={'grey'}
                                option2={'Weiß'}
                                value2={'white'}
                                option3={'Grün'}
                                value3={'green'}
                                label={'Farbe'}
                                state={dachAußenFarbe}
                                setState={setDachAußenFarbe}
                                />
                            </div>
                        </div>


                    </div>
                    </div>
                </div>
            </div>
        )
    }

    function öffnungenUI() {
        return(
            <div style={{marginLeft: '15px'}}>
                <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Farbe der Öffnung:</p>

                <div style={{ margin: '5px'}}>
                    <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        alignItems: 'center', 
                        marginBottom: "12px", 
                        justifyContent: 'space-between', 
                        marginRight: "15px",
                    }}>
                        <span className='text' style={{ fontWeight: 200}}>Fensterfarbe</span>
                        <MuiSelect
                            option1={'!'}
                            value1={'!'}
                            option2={'?'}
                            value2={'?'}
                            label={'Farbe'}
                            state={fensterFarbe}
                            setState={setFensterFarbe}
                            />
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        alignItems: 'center', 
                        marginBottom: "12px", 
                        justifyContent: 'space-between', 
                        marginRight: "15px",
                    }}>
                        <span className='text' style={{ fontWeight: 200}}>Türfarbe</span>
                        <MuiSelect
                            option1={'!'}
                            value1={'!'}
                            option2={'?'}
                            value2={'?'}
                            label={'Farbe'}
                            state={türFarbe}
                            setState={setTürFarbe}
                        />
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        alignItems: 'center', 
                        marginBottom: "12px", 
                        justifyContent: 'space-between', 
                        marginRight: "15px",
                    }}>
                        <span className='text' style={{ fontWeight: 200}}>Schiebetorfarbe</span>
                        <MuiSelect
                            option1={'!'}
                            value1={'!'}
                            option2={'?'}
                            value2={'?'}
                            label={'Farbe'}
                            state={schiebeTorFarbe}
                            setState={setSchiebeTorFarbe}
                        />
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        alignItems: 'center', 
                        marginBottom: "12px", 
                        justifyContent: 'space-between', 
                        marginRight: "15px",
                    }}>
                        <span className='text' style={{ fontWeight: 200}}>Rolltorfarbe</span>
                        <MuiSelect
                            option1={'!'}
                            value1={'!'}
                            option2={'?'}
                            value2={'?'}
                            label={'Farbe'}
                            state={rollTorFarbe}
                            setState={setRollTorFarbe}
                        />
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        alignItems: 'center', 
                        marginBottom: "12px", 
                        justifyContent: 'space-between', 
                        marginRight: "15px",
                    }}>
                        <span className='text' style={{ fontWeight: 200}}>Sektionaltorfarbe</span>
                        <MuiSelect
                            option1={'!'}
                            value1={'!'}
                            option2={'?'}
                            value2={'?'}
                            label={'Farbe'}
                            state={sektionalTorFarbe}
                            setState={setSektionalTorFarbe}
                        />
                    </div>

                </div>

                <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Farbe der Öffnung (innen):</p>
                <div style={{ margin: '5px'}}>
                    <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        alignItems: 'center', 
                        marginBottom: "12px", 
                        justifyContent: 'space-between', 
                        marginRight: "15px",
                    }}>
                        <span className='text' style={{ fontWeight: 200}}>Türfarbe</span>
                        <MuiSelect
                            option1={'!'}
                            value1={'!'}
                            option2={'?'}
                            value2={'?'}
                            label={'Farbe'}
                            state={türFarbeInnen}
                            setState={setTürFarbeInnen}
                        />
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        alignItems: 'center', 
                        marginBottom: "12px", 
                        justifyContent: 'space-between', 
                        marginRight: "15px",
                    }}>
                        <span className='text' style={{ fontWeight: 200}}>Sektionaltorfarbe</span>
                        <MuiSelect
                            option1={'!'}
                            value1={'!'}
                            option2={'?'}
                            value2={'?'}
                            label={'Farbe'}
                            state={sektionalTorFarbeInnen}
                            setState={setSektionalTorFarbeInnen}
                        />
                    </div>

                </div>

            </div>
        )
    }

    function angebotUI() {

        return(
            <>
                <div style={{marginLeft: '15px'}}>
                    <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Anfrage senden:</p>

                    <div style={{ margin: '5px'}}>

                        <div style={{
                            display: 'flex', 
                            gap: '10px', 
                            alignItems: 'center', 
                            marginBottom: "12px", 
                            justifyContent: 'space-between', 
                            marginRight: "15px",
                        }}>
                            <span className='text' style={{ fontWeight: 200}}>Gebäudezweck</span>
                            <MuiSelect
                                option1={'Produktionshalle'}
                                value1={'Produktionshalle'}
                                option2={'Landwirtschaftliche Halle'}
                                value2={'Landwirtschaftliche-Halle'}
                                option3={'Verwaltungshalle'}
                                value3={'Verwaltungshalle'}
                                option4={'Lagerhalle'}
                                value4={'Lagerhalle'}
                                option5={'Sporthalle'}
                                value5={'Sporthalle'}
                                option6={'Automobilsalon'}
                                value6={'Automobilsalon'}
                                label={'Zweck'}
                                state={gebäudeZweck}
                                setState={setGebäudeZweck}
                            />
                        </div>

                        <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            alignItems: 'center', 
                            marginBottom: "12px", 
                            justifyContent: 'space-between', 
                            marginRight: "15px",
                        }}>
                            <span className='text' style={{ fontWeight: 200}}>Beginn der Bauarbeiten</span>
                            <MuiSelect
                                option1={new Date().getFullYear()}
                                value1={new Date().getFullYear()}
                                option2={new Date().getFullYear()+1}
                                value2={new Date().getFullYear()+1}
                                option3={new Date().getFullYear()+2}
                                value3={new Date().getFullYear()+2}
                                option4={new Date().getFullYear()+3}
                                value4={new Date().getFullYear()+3}
                                label={'Jahr'}
                                state={bauBeginn}
                                setState={setBauBeginn}
                            />
                        </div>

                        <div style={{ 
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                            marginBottom: "12px",
                            justifyContent: 'space-between',
                            marginRight: "15px",
                        }}>
                            <span className='text' style={{ fontWeight: 200 }}>Woher kennen Sie uns?</span>
                            <MuiSelect
                                option1={'Soziale Medien'}
                                value1={'Soziale-Medien'}
                                option2={'Google'}
                                value2={'Google'}
                                option3={'Radio'}
                                value3={'Radio'}
                                option4={'Presse'}
                                value4={'Presse'}
                                option5={'Ich kenne Sie!'}
                                value5={'Ich-kenne-Sie'}
                                option6={'Empfehlung'}
                                value6={'Empfehlung'}
                                option7={'Andere'}
                                value7={'Andere'}
                                label={'Bitte wählen'}
                                state={anwerbungKunden}
                                setState={setAnwerbungKunden}
                            />
                        </div>

                        {(größeGebäudeM2 < 750 || größeGebäudeM2 === '?') && (
                            <>
                                <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Mind. Größe des Gebäudes muss 750m² betragen.</p>
                                <div style={{ 
                                    display: 'flex', 
                                    gap: '10px', 
                                    alignItems: 'center', 
                                    marginBottom: "12px", 
                                    justifyContent: 'space-between', 
                                    marginRight: "15px",
                                }}>
                                    <span className='text' style={{ fontWeight: 200 }}>Aktuelle Größe in m²: </span>
                                    <p className='text' style={{ fontWeight: 200 }}>{größeGebäudeM2}</p>
                                </div>
                            </>
                        )}

                        {hasOpeningOverlap && (
                            <p className='text' style={{
                                fontSize: 12,
                                marginBottom: '10px',
                                marginRight: '15px',
                                color: '#b42318'
                            }}>
                                Bitte überlappende Öffnungen korrigieren. Solange ist keine Anfrage möglich.
                            </p>
                        )}

                        {größeGebäudeM2 >= 750 && (
                            <>
                                <div 
                                    style={{
                                        borderRadius: 12,
                                        padding: "5px",
                                        border: "1px solid rgba(59, 44, 44, 0.2)",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                        height: 70,
                                        margin: 20,
                                        marginRight: 35,
                                        color: "rgba(66, 39, 39, 0.2)",
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: hasOpeningOverlap
                                            ? 'rgba(211, 211, 211, 0.75)'
                                            : 'rgba(252, 238, 79, 0.8)',
                                        cursor: hasOpeningOverlap ? 'not-allowed' : 'pointer',
                                        opacity: hasOpeningOverlap ? 0.75 : 1
                                    }}
                                    onClick={() => {
                                        if (hasOpeningOverlap) {
                                            return;
                                        }
                                        const anfrageZusammenfassung = buildAnfrageZusammenfassung();
                                        if (setShowAppKontakt) {
                                            setShowAppKontakt(anfrageZusammenfassung);
                                            return;
                                        }
                                        if (setShowApp3) {
                                            setShowApp3(anfrageZusammenfassung);
                                        }
                                    }}
                                >

                                    <h2 className='navbar' style={{ marginTop: 40 }}>
                                        {hasOpeningOverlap ? 'Überlappung beheben' : 'Anfrage senden!'}
                                    </h2>

                                </div>
                            </>
                        )}
                    </div>
                </div>
            </>
        )
    }

    function konstruktionUI() {

        return(
            <>
                <div style={{marginLeft: '15px'}}>
                    <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Farben Konfiguration:</p>

                    <div style={{ margin: '5px'}}>

                        <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            alignItems: 'center', 
                            marginBottom: "12px", 
                            justifyContent: 'space-between', 
                            marginRight: "15px",
                        }}>
                            <span className='text' style={{ fontWeight: 200, fontSize: 13 }}>Bodenplatte</span>
                            <MuiSelect
                                option1={'Weiß'}
                                value1={'white'}
                                option2={'Grau'}
                                value2={'grey'}
                                option3={'Grün'}
                                value3={'green'}
                                label={'Farbe'}
                                state={bodenplatteFarbe}
                                setState={setBodenplatteFarbe}
                            />
                        </div>

                        <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            alignItems: 'center', 
                            marginBottom: "12px", 
                            justifyContent: 'space-between', 
                            marginRight: "15px",
                        }}>
                            <span className='text' style={{ fontWeight: 200, fontSize: 13 }}>Rahmenfarbe</span>
                            <MuiSelect
                                option1={'Blau'}
                                value1={'lightblue'}
                                option2={'Weiß'}
                                value2={'white'}
                                option3={'Grau'}
                                value3={'grey'}
                                option4={'Grün'}
                                value4={'green'}
                                label={'Farbe'}
                                state={rahmenFarbe}
                                setState={setRahmenFarbe}
                            />
                        </div>

                        <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            alignItems: 'center', 
                            marginBottom: "12px", 
                            justifyContent: 'space-between', 
                            marginRight: "15px",
                        }}>
                            <span className='text' style={{ fontWeight: 200, fontSize: 13 }}>Sekundärkonstruktionsfarbe</span>
                            <MuiSelect
                                option1={'Weiß'}
                                value1={'white'}
                                option2={'Grau'}
                                value2={'grey'}
                                option3={'Grün'}
                                value3={'green'}
                                label={'Farbe'}
                                state={sekundärKonstruktionsFarbe}
                                setState={setSekundärKonstruktionsFarbe}
                            />
                        </div>

                        {/* <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            alignItems: 'center', 
                            marginBottom: "12px", 
                            justifyContent: 'space-between', 
                            marginRight: "15px",
                        }}>
                            <span className='text' style={{ fontWeight: 200, fontSize: 13 }}>Sekundärholzkonstruktionfarbe</span>
                            <MuiSelect
                                option1={'?'}
                                value1={'?'}
                                option2={'!'}
                                value2={'!'}
                                label={'Farbe'}
                                state={sekundärHolzKonstruktionsFarbe}
                                setState={setSekundärHolzKonstruktionsFarbe}
                            />
                        </div> */}

                    </div>

                </div>
            </>
        )
    }

    function zubehörUI() {

        return(
            <>
                {/* Zubehör aktuell nicht nötig deswegen auskommentiert */}
                
                <div style={{marginLeft: '15px'}}>

                    <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Zubehör:</p>
                    <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            alignItems: 'center', 
                            marginBottom: "12px", 
                            justifyContent: 'space-between', 
                            marginRight: "15px",
                        }}>
                            <span className='text' style={{ fontWeight: 200 }}>Farbe des Zubehörs</span>
                            <MuiSelect
                                option1={'?'}
                                value1={'?'}
                                option2={'!'}
                                value2={'!'}
                                label={'Farbe'}
                                state={zubehörFarbe}
                                setState={setZubehörFarbe}
                            />
                    </div>

                    <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Kante:</p>
                    <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            alignItems: 'center', 
                            marginBottom: "12px", 
                            justifyContent: 'space-between', 
                            marginRight: "15px",
                        }}>
                            <span className='text' style={{ fontWeight: 200 }}>Kantenfarbe</span>
                            <MuiSelect
                                option1={'?'}
                                value1={'?'}
                                option2={'!'}
                                value2={'!'}
                                label={'Farbe'}
                                state={kantenFarbe}
                                setState={setKantenFarbe}
                            />
                    </div>

                    <p className='text' style={{ fontSize: 13, marginBottom: "6px" }}>Hallenkran:</p>
                    <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            alignItems: 'center', 
                            marginBottom: "12px", 
                            justifyContent: 'space-between', 
                            marginRight: "15px",
                        }}>
                            <span className='text' style={{ fontWeight: 200 }}>Kapazität der Kranstrecke 0 - </span>
                            <MuiNumberfield 
                            state={kranKapazität}
                            setState={setKranKapazität}
                            min={1}
                            max={99}
                            label='Tonnen'
                            />
                    </div>

                </div>

            </>
        )
    }

    return(
        <>
            <div style={{
            position: "fixed",
            top: 20 + (69*height),
            left: 280,
            background: "rgba(255, 255, 255, 0.15)", // halbtransparent
            backdropFilter: "blur(10px)",             // Blur-Effekt
            WebkitBackdropFilter: "blur(10px)",       // Safari-Support
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // etwas stärkerer Schatten
            color: "#000000ff",                            // besserer Kontrast
            width: 440,
            // Dynamische Höhe: passt sich dem Inhalt an
            maxHeight: '80vh',
            overflowY: 'auto',
            border: "1px solid rgba(255, 255, 255, 0.2)", // dezenter Rand
            zIndex: 999,
            opacity: enablePanelAnimation ? (isVisible ? 1 : 0) : 1,
            transform: enablePanelAnimation
                ? (isVisible ? 'translateY(0px) scale(1)' : 'translateY(12px) scale(0.97)')
                : 'translateY(0px) scale(1)',
            transition: enablePanelAnimation
                ? `opacity ${isVisible ? PANEL_ANIMATION_OPEN_MS : PANEL_ANIMATION_CLOSE_MS}ms ${PANEL_ANIMATION_EASING}, transform ${isVisible ? PANEL_ANIMATION_OPEN_MS : PANEL_ANIMATION_CLOSE_MS}ms ${PANEL_ANIMATION_EASING}`
                : undefined,
            pointerEvents: enablePanelAnimation && !isVisible ? 'none' : 'auto',
            // visibility: türAttribute ? "inherit" : "hidden"
            }}
            id="ui-button-edit-panel"
            >
                <div style={{
                    margin: "8px",
                    paddingBottom: "4px",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                }}>
                    <p className='text' style={{ fontSize: 17 }}>
                        {name}
                    </p>
                </div>
                <div style={{ marginTop: "10px" }}>
                    {name === "Abmessungen" && (
                        abmessungsUI()
                    )}
                    {name === 'Verkleidung' && (
                        verkleidungUI()
                    )}
                    {name === 'Öffnungen' && (
                        öffnungenUI()
                    )}
                    {name === 'Angebot' && (
                        angebotUI()
                    )}
                    {name === 'Konstruktion' && (
                        konstruktionUI()
                    )}
                    {name === 'Zubehör' && (
                        zubehörUI()
                    )}
                </div>
            </div>
        </>
    )
}