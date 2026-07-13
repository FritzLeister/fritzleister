import { Canvas } from '@react-three/fiber'
import { Cloud, Clouds, GradientTexture } from '@react-three/drei'
import { BackSide } from 'three'
import "./styles.css"
import Halle from './Halle'
import SliderMui from "./Komp/SliderMui"
import { useMemo, useState, memo, useRef, useCallback } from 'react'
import Add from './Komp/Add'
import { useEffect } from 'react'
import ButtonMui from './Komp/ButtonMui'
import DarstellungUI from './Komp/DarstellungUI'
import FirstRunTutorial from './Komp/FirstRunTutorial'
import { registerProductSnapshotCapture } from './utils/productSnapshotRegistry'
import { useProductSnapshots } from './hooks/useProductSnapshots'
import { hasAnyOpeningCollision } from './Komp/openingUtils'

// Better seeded random number generator (Mulberry32)
function createSeededRandom(seed) {
    return function() {
        seed |= 0
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

const DEFAULT_CAMERA_POSITION = [0, 30, 50]
const TUTORIAL_UI_HIGHLIGHT_EVENT = 'tutorial-ui-highlight'
const HISTORY_LIMIT = 100
const CLOUD_LAYER_COUNT = 0.25
const CLOUD_SEGMENTS = 6
const CLOUD_HEIGHT_MULTIPLIER = 2
const CLOUD_HEIGHT_VARIATION = 60
const CLOUD_SIZE_MULTIPLIER = 2.4
const CLOUD_VOLUME = 26
const CLOUD_RING_CONFIG = [
    { position: [-260, 68, -60], bounds: [42, 10, 10], opacity: 0.48, speed: 0.06 },
    { position: [-230, 72, -170], bounds: [46, 11, 11], opacity: 0.5, speed: 0.07 },
    { position: [-150, 66, -250], bounds: [44, 10, 10], opacity: 0.47, speed: 0.08 },
    { position: [-20, 74, -280], bounds: [52, 12, 12], opacity: 0.5, speed: 0.06 },
    { position: [120, 70, -260], bounds: [46, 11, 11], opacity: 0.49, speed: 0.07 },
    { position: [230, 66, -190], bounds: [44, 10, 10], opacity: 0.48, speed: 0.08 },
    { position: [280, 72, -40], bounds: [50, 12, 12], opacity: 0.51, speed: 0.06 },
    { position: [250, 68, 110], bounds: [44, 10, 10], opacity: 0.48, speed: 0.07 },
    { position: [180, 74, 230], bounds: [48, 11, 11], opacity: 0.5, speed: 0.06 },
    { position: [30, 66, 280], bounds: [52, 12, 12], opacity: 0.49, speed: 0.07 },
    { position: [-120, 72, 260], bounds: [46, 11, 11], opacity: 0.48, speed: 0.08 },
    { position: [-230, 68, 180], bounds: [44, 10, 10], opacity: 0.47, speed: 0.07 },
    { position: [-280, 70, 40], bounds: [50, 12, 12], opacity: 0.5, speed: 0.06 },
    { position: [-190, 64, -5], bounds: [40, 9, 9], opacity: 0.46, speed: 0.08 },
    { position: [0, 78, -120], bounds: [42, 10, 10], opacity: 0.5, speed: 0.06 },
    { position: [150, 64, 20], bounds: [40, 9, 9], opacity: 0.47, speed: 0.08 },
]

const CLOUD_OVER_HALL_CONFIG = CLOUD_RING_CONFIG.map((cloud, index) => {
    const heightShift = 8 + (index % 4) * 2
    const inwardScale = 0.3

    return {
        position: [
            cloud.position[0] * inwardScale,
            cloud.position[1] + heightShift,
            cloud.position[2] * inwardScale,
        ],
        bounds: [
            cloud.bounds[0] * 1.08,
            cloud.bounds[1] * 1.15,
            cloud.bounds[2] * 1.08,
        ],
        opacity: Math.min(0.72, cloud.opacity + 0.14),
        speed: cloud.speed * 0.85,
    }
})

const CLOUD_CENTRAL_CONFIG = CLOUD_RING_CONFIG.map((cloud, index) => ({
    position: [
        (index % 4 - 1.5) * 34,
        72 + (index % 3) * 3,
        (Math.floor(index / 4) - 1.5) * 30,
    ],
    bounds: [
        cloud.bounds[0] * 0.95,
        cloud.bounds[1] * 1.05,
        cloud.bounds[2] * 0.95,
    ],
    opacity: 0.58 + (index % 4) * 0.02,
    speed: cloud.speed * 0.7,
}))

const OPENING_TYPES = new Set([
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
])

function countOpeningsByType(objs = []) {
    return (objs || []).reduce((acc, obj) => {
        const type = obj?.type
        if (!OPENING_TYPES.has(type)) {
            return acc
        }

        acc[type] = (acc[type] || 0) + 1
        return acc
    }, {})
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
    }
}

function cloneHistoryValue(value) {
    return JSON.parse(
        JSON.stringify(value, (_key, currentValue) =>
            typeof currentValue === 'function' ? undefined : currentValue
        )
    )
}

function SkyGradientBackground() {
    return (
        <mesh scale={800} renderOrder={-1000} frustumCulled={false}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial side={BackSide} toneMapped={false} depthWrite={false} fog={false}>
                <GradientTexture
                    stops={[0, 0.55, 1]}
                    colors={["#d3e0e5", "#BFE6FF", "#FFFFFF"]}
                    size={1024}
                />
            </meshBasicMaterial>
        </mesh>
    )
}

const SkyVolumetricClouds = memo(function SkyVolumetricClouds() {
    const cloudSeedConfig = useMemo(
        () => [...CLOUD_RING_CONFIG, ...CLOUD_OVER_HALL_CONFIG, ...CLOUD_CENTRAL_CONFIG],
        []
    )

    const randomizedClouds = useMemo(() => {
        const rng = createSeededRandom(42)
        const clouds = []
        const layerCount = CLOUD_LAYER_COUNT

        for (let layerIndex = 0; layerIndex < layerCount; layerIndex += 1) {
            for (const cloud of cloudSeedConfig) {
                clouds.push({
                    ...cloud,
                    bounds: [
                        cloud.bounds[0] * CLOUD_SIZE_MULTIPLIER,
                        cloud.bounds[1] * CLOUD_SIZE_MULTIPLIER,
                        cloud.bounds[2] * CLOUD_SIZE_MULTIPLIER,
                    ],
                    position: [
                        rng() * 600 - 300,
                        cloud.position[1] * CLOUD_HEIGHT_MULTIPLIER + (rng() * 2 - 1) * CLOUD_HEIGHT_VARIATION,
                        rng() * 600 - 300,
                    ],
                })
            }
        }

        return clouds
    }, [cloudSeedConfig])

    const cloudRenderLimit = useMemo(
        () => randomizedClouds.length * CLOUD_SEGMENTS,
        [randomizedClouds]
    )

    return (
        <group name="product-snapshot-clouds-root">
            <Clouds limit={cloudRenderLimit} frustumCulled={false}>
                {randomizedClouds.map((cloud, index) => (
                    <Cloud
                        key={index}
                        position={cloud.position}
                        bounds={cloud.bounds}
                        segments={CLOUD_SEGMENTS}
                        volume={CLOUD_VOLUME}
                        opacity={cloud.opacity}
                        color="#f6fbff"
                        fade={120}
                        speed={cloud.speed}
                    />
                ))}
            </Clouds>
        </group>
    )
})
function SnapshotCaptureBridge({ breite, länge, höhe }) {
    const captureSnapshots = useProductSnapshots({
        rootObjectName: 'product-snapshot-focus-root',
        hallWidthMeters: breite,
        hallLengthMeters: länge,
        hallHeightMeters: höhe,
    })

    useEffect(() => {
        registerProductSnapshotCapture(captureSnapshots)

        return () => {
            registerProductSnapshotCapture(null)
        }
    }, [captureSnapshots])

    return null
}

export default function App({ 
    setShowApp, 
    setShowApp2,
    setShowApp3,
    setShowAppKontakt,
    appSequence, 
    flach,
    länge,
    setLänge,
    breite,
    setBreite,
    höhe,
    setHöhe,
    setHallenSave,
    hallenartSelection,
    setHallenartSelection,
    dachSelection,
    setDachSelection,
    hallenSave,
    objs,
    setObjs,
    editMenü,
    setEditMenü
 }) {

     const canvasCamera = useMemo(() => ({ position: DEFAULT_CAMERA_POSITION }), [])
     const canvasGl = useMemo(() => ({ powerPreference: 'high-performance' }), [])

    /*
    const [bodenLänge, setBodenLänge] = useState(40) // max 40
    const [bodenBreite, setBodenBreite] = useState(25) // max 25
    const [gebäudeHöhe, setGebäudeHöhe] = useState(15)
    */
    
    const koordinate = useMemo(() => [0, 0.3, 0], [])

    // Abmessungs-States (aus UiButtonEdit)
    const [dachArt, setDachArt] = useState('satteldach')
    const [traufhöhe, setTraufhöhe] = useState(3)
    const [dachneigung, setDachneigung] = useState(5)
    const [sockelhöhe, setSockelhöhe] = useState(2)
    const [dachAusrichtung, setDachAusrichtung] = useState('Rechts')
    const [diffTraufFirst, setDiffTraufFirst] = useState(4)

    // "Arbeits" - States (Verkleidung) aus UiButtonEdit
    const [wandGeometrieVorgaben, setWandGeometrieVorgaben] = useState('verkleidete-wand-mit-sockel')
    const [isolierung, setIsolierung] = useState('isoliert')
    const [paneeltyp, setPaneeltyp] = useState('trapez')
    const [paneelBreiteMm, setPaneelBreiteMm] = useState(2500)
    const [wandOrientierung, setWandOrientierung] = useState('vertikal')
    const [farbSchema, setFarbSchema] = useState('einfarbig')
    const [außenFarbe, setAußenFarbe] = useState('white')
    const [außenFarbeMuster, setAußenFarbeMuster] = useState('white')
    const [musterVerortung, setMusterVerortung] = useState('4, 5')
    const [dachIsolierung, setDachIsolierung] = useState('isoliert')
    const [dachPaneeltyp, setDachPaneeltyp] = useState('trapez')
    const [dachPaneelBreiteMm, setDachPaneelBreiteMm] = useState(2500)
    const [dachAußenFarbe, setDachAußenFarbe] = useState('grey')
    const [dachPvcName, setDachPvcName] = useState('PVC-Folie')
    const [pvcName, setPvcName] = useState('PVC-Folie')

    // "Arbeits" - States (Öffnungen) aus UiButtonEdit
    const [fensterFarbe, setFensterFarbe] = useState('?')
    const [türFarbe, setTürFarbe] = useState('?')
    const [schiebeTorFarbe, setSchiebeTorFarbe] = useState('?')
    const [rollTorFarbe, setRollTorFarbe] = useState('?')
    const [sektionalTorFarbe, setSektionalTorFarbe] = useState('?')
    const [türFarbeInnen, setTürFarbeInnen] = useState('?')
    const [sektionalTorFarbeInnen, setSektionalTorFarbeInnen] = useState('?')

    // 'Arbeits' - States (Angebot) aus UiButtonEdit
    const [gebäudeZweck, setGebäudeZweck] = useState('Produktionshalle')
    const [bauBeginn, setBauBeginn] = useState(new Date().getFullYear())
    const [anwerbungKunden, setAnwerbungKunden] = useState('Soziale-Medien')
    const [größeGebäudeM2, setGrößeGebäudeM2] = useState(760)

    // 'Arbeits' - States (Konstruktion) aus UiButtonEdit
    const [bodenplatteFarbe, setBodenplatteFarbe] = useState('white')
    const [rahmenFarbe, setRahmenFarbe] = useState('lightblue')
    const [sekundärKonstruktionsFarbe, setSekundärKonstruktionsFarbe] = useState('grey')
    const [sekundärHolzKonstruktionsFarbe, setSekundärHolzKonstruktionsFarbe] = useState('?')

    // 'Arbeits' - States (Zubehör) aus UiButtonEdit
    const [zubehörFarbe, setZubehörFarbe] = useState('?')
    const [kantenFarbe, setKantenFarbe] = useState('?')
    const [kranKapazität, setKranKapazität] = useState(1)

    // Darstellungs-States
    const [kantenAnzeigen, setKantenAnzeigen] = useState(true); // fertig
    const [oberflächenAnzeigen, setOberflächenAnzeigen] = useState(true); // fertig
    const [abmessungenAnzeigen, setAbmessungenAnzeigen] = useState(true); // fertig
    const [plattenAnzeigen, setPlattenAnzeigen] = useState(true); // fertig
    const [massivwändeAnzeigen, setMassivwändeAnzeigen] = useState(true); // fertig
    const [öffnungenAnzeigen, setÖffnungenAnzeigen] = useState(true); // gibt ja noch keine lol
    const [rahmenAnzeigen, setRahmenAnzeigen] = useState(true); // fertig
    const [pfettenAnzeigen, setPfettenAnzeigen] = useState(true); // fertig
    const [wandriegelAnzeigen, setWandriegelAnzeigen] = useState(true); // fertig
    const [kantteileAnzeigen, setKantteileAnzeigen] = useState(true); // fertig
    const [zubehörAnzeigen, setZubehörAnzeigen] = useState(true); // idk
    const [bodenplatteAnzeigen, setBodenplatteAnzeigen] = useState(true); // fertig
    const [volumenAnzeigen, setVolumenAnzeigen] = useState(true); // idk
    const [straßenAnzeigen, setStraßenAnzeigen] = useState(true); // idk
    const [strukturelleKomponentenAnzeigen, setStrukturelleKomponentenAnzeigen] = useState(true); // idk
    const [dekorationenAnzeigen, setDekorationenAnzeigen] = useState(true); // idk
    const [gebäudeformAnzeigen, setGebäudeformAnzeigen] = useState(true);
    const [anschleppungenAnzeigen, setAnschleppungenAnzeigen] = useState(true);
    const [sekundärstrukturAnzeigen, setSekundärstrukturAnzeigen] = useState(true); // idk 
    const [kreuzverbändeAnzeigen, setKreuzverbändeAnzeigen] = useState(true); // idk
    const undoHistoryRef = useRef([])
    const redoHistoryRef = useRef([])
    const currentHistorySnapshotRef = useRef(null)
    const currentHistoryActionKeyRef = useRef('')
    const isApplyingHistoryRef = useRef(false)
    const hasInitializedHistoryRef = useRef(false)
    const [canUndo, setCanUndo] = useState(false)
    const [canRedo, setCanRedo] = useState(false)
    const [topActionsHighlight, setTopActionsHighlight] = useState(false)
    const topActionsHighlightTimeoutRef = useRef(null)

    // State für die geklickte Button-Position
    const [clickedButtonPos, setClickedButtonPos] = useState(null);

    const [türAttribute, setTürAttribute] = useState(false)
    const [selectedObject, setSelectedObject] = useState(null)

    // const [objs, setObjs] = useState([
        // value: [x,x,...] onChange: [x,x,...], type: , ggf.: rechts?
        /*
        {
            value: [16,9],
            onChange: [
                (newWidth) => setObjs(objs => objs.map(
                    obj => obj.type === "tür" 
                    ? { ...obj, value: [newWidth, obj.value[1]], onChange: obj.onChange}
                    : obj
                )), 
                (newHeight) => setObjs(objs => objs.map(
                    obj => obj.type === "tür" 
                    ? { ...obj, value: [obj.value[0], newHeight], onChange: obj.onChange}
                    : obj
                ))
            ],
            type: "tür",
            id: 0,
            rechts: false
        }, 
        */
        /*
        {
            value: [6,6],
            onChange:[
                (newWidth) => setObjs(objs => objs.map(
                    obj => obj.type === "dachfenster" 
                    ? { ...obj, value: [newWidth, obj.value[1]], onChange: obj.onChange}
                    : obj
                )), 
                (newHeight) => setObjs(objs => objs.map(
                    obj => obj.type === "dachfenster" 
                    ? { ...obj, value: [obj.value[0], newHeight], onChange: obj.onChange}
                    : obj
                ))
            ],
            type: "dachfenster",
            id: 1,
            rechts: true // WIEEESOOOOOOOOO
        }
        */
        /*
        {
            value: [5,5],
            onChange:[
                (newWidth) => setObjs(objs => objs.map(
                    obj => obj.type === "lüfter" 
                    ? { ...obj, value: [newWidth, obj.value[1]], onChange: obj.onChange}
                    : obj
                )), 
                (newHeight) => setObjs(objs => objs.map(
                    obj => obj.type === "lüfter" 
                    ? { ...obj, value: [obj.value[0], newHeight], onChange: obj.onChange}
                    : obj
                ))
            ],
            type: "lüfter",
            id: 2,
            rechts: false // "lang"
        },

        {
            value: [7,5],
            onChange:[
                (newWidth) => setObjs(objs => objs.map(
                    obj => obj.type === "lüfter" 
                    ? { ...obj, value: [newWidth, obj.value[1]], onChange: obj.onChange}
                    : obj
                )), 
                (newHeight) => setObjs(objs => objs.map(
                    obj => obj.type === "lüfter" 
                    ? { ...obj, value: [obj.value[0], newHeight], onChange: obj.onChange}
                    : obj
                ))
            ],
            type: "lüfter",
            id: 3,
            rechts: true // "lang"
        }
        */
    // ])

    /*
    function handleReset() {
        setShowResetLoading(true)
        setTimeout(() => {
            setShowResetLoading(false)
        }, 500); // 1 Sekunde LoadingPage anzeigen
    }
        */

    function handleOnChange(index, newValue) {
        setSelectedObject(prev => {
            if (!prev) return prev;
            const newObj = { ...prev, value: prev.value.map((v, i) => i === index ? newValue : v) };
            return newObj;
        });

        setObjs(objs => objs.map(obj =>
            obj.id === selectedObject.id
                ? { ...obj, value: obj.value.map((v, i) => i === index ? newValue : v) }
                : obj
        ));
    }

    function addObj(value, type, id, rechts, startPos = null, lang = true, extraData = {}) {
        const newObj = {
            value: value,
            onChange: [
                (newWidth) => setObjs(objs => objs.map(
                    obj => obj.type === type
                    ? { ...obj, value: [newWidth, obj.value[1]], onChange: obj.onChange}
                    : obj
                )), 
                (newHeight) => setObjs(objs => objs.map(
                    obj => obj.type === type 
                    ? { ...obj, value: [obj.value[0], newHeight], onChange: obj.onChange}
                    : obj
                ))
            ],
            type: type,
            id: id,
            rechts: rechts,
            startPos: startPos,
            lang: lang,
            vorne: startPos?.vorne ?? true,
            posSegment: 'mittig',
            ...extraData
        }
        setObjs(objs => [...objs, newObj])
    }

    function deleteObj(id) {

        let newArr = objs.filter(item => item.id !== id)
        setObjs(newArr)
        setTürAttribute(false)
    }

    function saveCurrentHalle() {
        setHallenSave(prev => {
            const newObj = {
                id: Date.now(),
                breite,
                höhe,
                länge,
                dachArt: (dachSelection === "" ? "satteldach" : dachSelection),
                hallenArt: (hallenartSelection === "" ? "industrie" : hallenartSelection),
                objs: Array.isArray(objs) ? objs.map(o => ({ ...o })) : [],
                name: ""
            };
            return [...prev, newObj];
        });
    }

    function buildAnfrageZusammenfassung() {
        const openingObjects = (objs || []).filter((obj) => OPENING_TYPES.has(obj?.type))
        const openingCounts = countOpeningsByType(openingObjects)
        const openingItems = openingObjects.map((obj, index) => mapOpeningSummaryItem(obj, index))

        return {
            abmessung: {
                breite,
                länge,
                höhe,
                dachArt,
                traufhöhe,
                dachneigung,
                dachAusrichtung,
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
                gesamt: openingItems.length,
                überlappung: hasAnyOpeningCollision(openingObjects),
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
        }
    }

    function syncHistoryAvailability() {
        setCanUndo(undoHistoryRef.current.length > 0)
        setCanRedo(redoHistoryRef.current.length > 0)
    }

    const buildHistorySnapshot = useCallback(() => {
        return cloneHistoryValue({
            breite,
            länge,
            höhe,
            dachArt,
            traufhöhe,
            dachneigung,
            sockelhöhe,
            dachAusrichtung,
            diffTraufFirst,
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
            pvcName,
            fensterFarbe,
            türFarbe,
            schiebeTorFarbe,
            rollTorFarbe,
            sektionalTorFarbe,
            türFarbeInnen,
            sektionalTorFarbeInnen,
            gebäudeZweck,
            bauBeginn,
            anwerbungKunden,
            größeGebäudeM2,
            bodenplatteFarbe,
            rahmenFarbe,
            sekundärKonstruktionsFarbe,
            sekundärHolzKonstruktionsFarbe,
            zubehörFarbe,
            kantenFarbe,
            kranKapazität,
            objs,
        })
    }, [
        anwerbungKunden,
        außenFarbe,
        außenFarbeMuster,
        bauBeginn,
        bodenplatteFarbe,
        breite,
        dachArt,
        dachAusrichtung,
        dachAußenFarbe,
        dachIsolierung,
        dachPaneelBreiteMm,
        dachPaneeltyp,
        dachPvcName,
        dachneigung,
        diffTraufFirst,
        fensterFarbe,
        farbSchema,
        gebäudeZweck,
        größeGebäudeM2,
        höhe,
        isolierung,
        kantenFarbe,
        kranKapazität,
        länge,
        musterVerortung,
        objs,
        paneelBreiteMm,
        paneeltyp,
        pvcName,
        rahmenFarbe,
        rollTorFarbe,
        schiebeTorFarbe,
        sektionalTorFarbe,
        sektionalTorFarbeInnen,
        sekundärHolzKonstruktionsFarbe,
        sekundärKonstruktionsFarbe,
        sockelhöhe,
        traufhöhe,
        türFarbe,
        türFarbeInnen,
        wandGeometrieVorgaben,
        wandOrientierung,
        zubehörFarbe,
    ])

    const buildHistoryActionKey = useCallback(() => {
        return JSON.stringify({
            breite,
            länge,
            höhe,
            dachArt,
            traufhöhe,
            dachneigung,
            sockelhöhe,
            dachAusrichtung,
            diffTraufFirst,
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
            pvcName,
            fensterFarbe,
            türFarbe,
            schiebeTorFarbe,
            rollTorFarbe,
            sektionalTorFarbe,
            türFarbeInnen,
            sektionalTorFarbeInnen,
            gebäudeZweck,
            bauBeginn,
            anwerbungKunden,
            größeGebäudeM2,
            bodenplatteFarbe,
            rahmenFarbe,
            sekundärKonstruktionsFarbe,
            sekundärHolzKonstruktionsFarbe,
            zubehörFarbe,
            kantenFarbe,
            kranKapazität,
            öffnungen: objs.map((obj) => ({
                id: obj.id,
                type: obj.type,
            })),
        })
    }, [
        anwerbungKunden,
        außenFarbe,
        außenFarbeMuster,
        bauBeginn,
        bodenplatteFarbe,
        breite,
        dachArt,
        dachAusrichtung,
        dachAußenFarbe,
        dachIsolierung,
        dachPaneelBreiteMm,
        dachPaneeltyp,
        dachPvcName,
        dachneigung,
        diffTraufFirst,
        fensterFarbe,
        farbSchema,
        gebäudeZweck,
        größeGebäudeM2,
        höhe,
        isolierung,
        kantenFarbe,
        kranKapazität,
        länge,
        musterVerortung,
        objs,
        paneelBreiteMm,
        paneeltyp,
        pvcName,
        rahmenFarbe,
        rollTorFarbe,
        schiebeTorFarbe,
        sektionalTorFarbe,
        sektionalTorFarbeInnen,
        sekundärHolzKonstruktionsFarbe,
        sekundärKonstruktionsFarbe,
        sockelhöhe,
        traufhöhe,
        türFarbe,
        türFarbeInnen,
        wandGeometrieVorgaben,
        wandOrientierung,
        zubehörFarbe,
    ])

    function applyHistorySnapshot(snapshot) {
        isApplyingHistoryRef.current = true
        setBreite(snapshot.breite)
        setLänge(snapshot.länge)
        setHöhe(snapshot.höhe)
        setDachArt(snapshot.dachArt)
        setTraufhöhe(snapshot.traufhöhe)
        setDachneigung(snapshot.dachneigung)
        setSockelhöhe(snapshot.sockelhöhe)
        setDachAusrichtung(snapshot.dachAusrichtung)
        setDiffTraufFirst(snapshot.diffTraufFirst)
        setWandGeometrieVorgaben(snapshot.wandGeometrieVorgaben)
        setIsolierung(snapshot.isolierung)
        setPaneeltyp(snapshot.paneeltyp)
        setPaneelBreiteMm(snapshot.paneelBreiteMm)
        setWandOrientierung(snapshot.wandOrientierung)
        setFarbSchema(snapshot.farbSchema)
        setAußenFarbe(snapshot.außenFarbe)
        setAußenFarbeMuster(snapshot.außenFarbeMuster)
        setMusterVerortung(snapshot.musterVerortung)
        setDachIsolierung(snapshot.dachIsolierung)
        setDachPaneeltyp(snapshot.dachPaneeltyp)
        setDachPaneelBreiteMm(snapshot.dachPaneelBreiteMm)
        setDachAußenFarbe(snapshot.dachAußenFarbe)
        setDachPvcName(snapshot.dachPvcName)
        setPvcName(snapshot.pvcName)
        setFensterFarbe(snapshot.fensterFarbe)
        setTürFarbe(snapshot.türFarbe)
        setSchiebeTorFarbe(snapshot.schiebeTorFarbe)
        setRollTorFarbe(snapshot.rollTorFarbe)
        setSektionalTorFarbe(snapshot.sektionalTorFarbe)
        setTürFarbeInnen(snapshot.türFarbeInnen)
        setSektionalTorFarbeInnen(snapshot.sektionalTorFarbeInnen)
        setGebäudeZweck(snapshot.gebäudeZweck)
        setBauBeginn(snapshot.bauBeginn)
        setAnwerbungKunden(snapshot.anwerbungKunden)
        setGrößeGebäudeM2(snapshot.größeGebäudeM2)
        setBodenplatteFarbe(snapshot.bodenplatteFarbe)
        setRahmenFarbe(snapshot.rahmenFarbe)
        setSekundärKonstruktionsFarbe(snapshot.sekundärKonstruktionsFarbe)
        setSekundärHolzKonstruktionsFarbe(snapshot.sekundärHolzKonstruktionsFarbe)
        setZubehörFarbe(snapshot.zubehörFarbe)
        setKantenFarbe(snapshot.kantenFarbe)
        setKranKapazität(snapshot.kranKapazität)
        setObjs(cloneHistoryValue(snapshot.objs))
        setSelectedObject(null)
        setTürAttribute(false)
        setClickedButtonPos(null)
    }

    function handleUndo() {
        if (undoHistoryRef.current.length === 0 || !currentHistorySnapshotRef.current) {
            return
        }

        const previousSnapshot = undoHistoryRef.current[undoHistoryRef.current.length - 1]
        undoHistoryRef.current = undoHistoryRef.current.slice(0, -1)
        redoHistoryRef.current = [...redoHistoryRef.current, currentHistorySnapshotRef.current].slice(-HISTORY_LIMIT)
        syncHistoryAvailability()
        applyHistorySnapshot(previousSnapshot)
    }

    function handleRedo() {
        if (redoHistoryRef.current.length === 0 || !currentHistorySnapshotRef.current) {
            return
        }

        const nextSnapshot = redoHistoryRef.current[redoHistoryRef.current.length - 1]
        redoHistoryRef.current = redoHistoryRef.current.slice(0, -1)
        undoHistoryRef.current = [...undoHistoryRef.current, currentHistorySnapshotRef.current].slice(-HISTORY_LIMIT)
        syncHistoryAvailability()
        applyHistorySnapshot(nextSnapshot)
    }


    const konstruktionFokusAktiv = editMenü === 'Konstruktion'
    const effektivePlattenAnzeigen = konstruktionFokusAktiv ? false : plattenAnzeigen
    const effektiveMassivwändeAnzeigen = konstruktionFokusAktiv ? false : massivwändeAnzeigen
    const effektiveKantteileAnzeigen = konstruktionFokusAktiv ? false : kantteileAnzeigen

    useEffect(() => {
        const handleTutorialUiHighlight = (event) => {
            if (event?.detail?.area !== 'top-actions') return

            setTopActionsHighlight(true)

            if (topActionsHighlightTimeoutRef.current) {
                clearTimeout(topActionsHighlightTimeoutRef.current)
            }

            topActionsHighlightTimeoutRef.current = setTimeout(() => {
                setTopActionsHighlight(false)
                topActionsHighlightTimeoutRef.current = null
            }, 850)
        }

        window.addEventListener(TUTORIAL_UI_HIGHLIGHT_EVENT, handleTutorialUiHighlight)

        return () => {
            window.removeEventListener(TUTORIAL_UI_HIGHLIGHT_EVENT, handleTutorialUiHighlight)
            if (topActionsHighlightTimeoutRef.current) {
                clearTimeout(topActionsHighlightTimeoutRef.current)
                topActionsHighlightTimeoutRef.current = null
            }
        }
    }, [])

    useEffect(() => {
        const nextSnapshot = buildHistorySnapshot()
        const nextActionKey = buildHistoryActionKey()

        if (!hasInitializedHistoryRef.current) {
            hasInitializedHistoryRef.current = true
            currentHistorySnapshotRef.current = nextSnapshot
            currentHistoryActionKeyRef.current = nextActionKey
            syncHistoryAvailability()
            return
        }

        if (isApplyingHistoryRef.current) {
            isApplyingHistoryRef.current = false
            currentHistorySnapshotRef.current = nextSnapshot
            currentHistoryActionKeyRef.current = nextActionKey
            syncHistoryAvailability()
            return
        }

        if (currentHistoryActionKeyRef.current === nextActionKey) {
            currentHistorySnapshotRef.current = nextSnapshot
            return
        }

        const snapshotToStore = currentHistorySnapshotRef.current

        if (snapshotToStore) {
            undoHistoryRef.current = [...undoHistoryRef.current, snapshotToStore].slice(-HISTORY_LIMIT)
        }

        redoHistoryRef.current = []
        currentHistorySnapshotRef.current = nextSnapshot
        currentHistoryActionKeyRef.current = nextActionKey
        syncHistoryAvailability()
    }, [buildHistoryActionKey, buildHistorySnapshot])

    return(
        <>
        <div style={{
            top: 20, 
            right: 20,
            position: "fixed",
            background: topActionsHighlight ? "rgba(255, 208, 90, 0.72)" : "rgba(255, 255, 255, 0.15)", // halbtransparent
            backdropFilter: "blur(10px)",             // Blur-Effekt
            WebkitBackdropFilter: "blur(10px)",       // Safari-Support
            padding: 18,
            boxShadow: topActionsHighlight ? "0 10px 28px rgba(235, 148, 0, 0.5)" : "0 4px 12px rgba(0,0,0,0.15)", // etwas stärkerer Schatten
            color: "#000000ff",                            // besserer Kontrast
            width: 480,
            height: 90,
            border: "1px solid rgba(255, 255, 255, 0.2)", // dezenter Rand
            zIndex: 999,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            transition: 'background-color 0.35s ease, box-shadow 0.35s ease'
        }}>
            <div 
            style={{
                top: 3.5,
                right: 84,
                position: 'fixed',
                borderRadius: 12,
                padding: "5px",
                border: "1px solid rgba(59, 44, 44, 0.2)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                height: 80,
                marginLeft: 20,
                color: "rgba(66, 39, 39, 0.2)",
                cursor: 'pointer',
                transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
            onClick={() => {
                setObjs([])
                setShowApp()
            }}
            title="Zur Startseite wechseln. Die aktuelle Konfiguration wird verlassen."
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(200, 200, 200, 0.25)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
            }}
            >
                <h2 className='navbar'>Home</h2>
            </div>

            <div style={{
                top: 3.5,
                right: 5,
                position: 'fixed',
                borderRadius: 12,
                padding: "5px",
                border: "1px solid rgba(12, 8, 8, 0.2)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                height: 80,
                width: 75,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
            onClick={() => {
                setShowApp2()
                setObjs([])
            }}
            title="Konfiguration zurücksetzen und neu starten."
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(200, 200, 200, 0.25)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            >
                <h2 className='navbar'>Reset</h2>
            </div>

            
            <div style={{
                top: 3.5,
                right: 164,
                position: 'fixed',
                borderRadius: 12,
                padding: "5px",
                border: "1px solid rgba(12, 8, 8, 0.2)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                height: 80,
                width: 75,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
            onClick={() => {
                saveCurrentHalle();

                setTimeout(() => {
                    setShowApp3(buildAnfrageZusammenfassung());
                }, 100);
            }}
            title="Aktuelle Halle speichern und zur Übersicht wechseln."
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(200, 200, 200, 0.25)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            >

                <h2 className='navbar'>Save</h2>
            </div>
            
            <div
                onClick={() => window.open("https://www.stahlbau-perthel.de", "_blank")}
                style={{ margin: 0, cursor: 'pointer' }}
            >
                <img 
                // src="/StartpunktDigitalLogo.png" 
                src='/LogoPerthel.png'
                alt="Logo"
                style={{ width: 200, zIndex: 1000 }}
                />
            </div>
        </div>
        

        <Canvas 
        camera={canvasCamera}
        dpr={[1, 1.5]}
        gl={canvasGl}
        frameloop="demand"
        performance={{ min: 0.6 }}
        shadows={false}
        className='canvasOverlay'
        // style={{backgroundImage: "url(/himmel.jpg)", backgroundSize: "cover", backgroundPosition: "center"}}
        >
            <SkyGradientBackground />
            {straßenAnzeigen && <SkyVolumetricClouds />}
            <directionalLight position={[5,5,5]} intensity={1} />
            <ambientLight intensity={0.9} />
            <SnapshotCaptureBridge breite={breite} länge={länge} höhe={höhe} />

            <group>
                <Halle 
                bodenLänge={länge*2.5} // +17
                bodenBreite={breite*2.5} // +15
                gebäudeHöhe={höhe*2.5} // +3
                koordinate={koordinate}
                selectedObj={selectedObject}
                setTürAttribute={setTürAttribute}
                setSelectedObject={setSelectedObject}
                setObjs={setObjs}
                objs={objs}
                flach={dachSelection === "flachdach" ? true : false}
                originalBreite={breite}
                setEditMenü={setEditMenü}
                editMenü={editMenü}
                setClickedButtonPos={setClickedButtonPos}

                kantenAnzeigen={kantenAnzeigen}
                oberflächenAnzeigen={oberflächenAnzeigen}
                abmessungenAnzeigen={abmessungenAnzeigen}
                plattenAnzeigen={effektivePlattenAnzeigen}
                massivwändeAnzeigen={effektiveMassivwändeAnzeigen}
                rahmenAnzeigen={rahmenAnzeigen}
                pfettenAnzeigen={pfettenAnzeigen}
                wandriegelAnzeigen={wandriegelAnzeigen}
                kantteileAnzeigen={effektiveKantteileAnzeigen}
                bodenplatteAnzeigen={bodenplatteAnzeigen}
                bodenplatteFarbe={bodenplatteFarbe}
                rahmenFarbe={rahmenFarbe}
                sekundärKonstruktionsFarbe={sekundärKonstruktionsFarbe}

                dachArt={dachArt}
                diffTraufFirst={diffTraufFirst * 2.5}
                pultdachHöheDifferenz={dachneigung * 2.5}
                sockelhöhe={sockelhöhe * 2.6}
                wandGeometrieVorgaben={wandGeometrieVorgaben}
                wandOrientierung={wandOrientierung}
                paneeltyp={paneeltyp}
                farbSchema={farbSchema}
                außenFarbeMuster={außenFarbeMuster}
                    musterVerortung={musterVerortung}
                   paneelBreiteMm={paneelBreiteMm}
                    dachIsolierung={dachIsolierung}
                    dachPaneeltyp={dachPaneeltyp}
                    dachPaneelBreiteMm={dachPaneelBreiteMm}
                außenFarbe={außenFarbe}
                dachAußenFarbe={dachAußenFarbe}
                />
            </group>
            

            {/* <OrbitControls /> */}
        </Canvas>

        <div style={{
            position: "fixed",
            top: 120,
            right: 20,
            background: "rgba(255, 255, 255, 0.15)", // halbtransparent
            backdropFilter: "blur(10px)",             // Blur-Effekt
            WebkitBackdropFilter: "blur(10px)",       // Safari-Support
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // etwas stärkerer Schatten
            color: "#000000ff",                            // besserer Kontrast
            width: 360,
            height: türAttribute ? 250 : 250, // 500 : 250
            border: "1px solid rgba(255, 255, 255, 0.2)", // dezenter Rand
            zIndex: 999,
            visibility: türAttribute ? "inherit" : "hidden"
        }}>
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                // Hier wieder sichtbar machen
                visibility: türAttribute ? "hidden" : "hidden"
            }}>
                <SliderMui
                    title={"Länge"} 
                    multiplier={3} 
                    value={länge} 
                    onChange={setLänge}
                    min={22}
                    max={40}
                />

                <SliderMui 
                    title={"Breite"} 
                    multiplier={4} 
                    value={breite} 
                    onChange={setBreite}
                    min={18}
                    max={25} 
                />

                <SliderMui 
                    title={"Höhe"} 
                    multiplier={5} 
                    value={höhe} 
                    onChange={setHöhe}
                    min={7}
                    max={20} 
                />
            </div>

        {türAttribute && (
            <>
                <ButtonMui multiplier={2} title={"Löschen"} onClick={() => deleteObj(selectedObject.id)} />
                
                <SliderMui 
                title={"Objekt Breite"}
                multiplier={0}
                value={selectedObject.value[0]}
                onChange={newValue => handleOnChange(0, newValue)}
                min={2}
                max={selectedObject.type === "lüfter" ? 5 : (selectedObject.type === "tür" ? breite+10 : breite+5)}
                />

                <SliderMui 
                title={"Objekt Höhe"}
                multiplier={1}
                value={selectedObject.value[1]}
                onChange={newValue => handleOnChange(1, newValue)}
                min={3}
                max={Math.round((selectedObject.type === "lüfter" ? 5 : (selectedObject.type === "tür" ? höhe-2 : breite+2)))}
                />
            </>
        )}
        </div>

        {/* Ui Innen */}
        
        <Add
        addObj={addObj} 
        canUndo={canUndo}
        canRedo={canRedo}
        editMenü={editMenü} 
        onUndo={handleUndo}
        onRedo={handleRedo}
        setEditMenü={setEditMenü}
        setShowApp3={setShowApp3}
        setShowAppKontakt={setShowAppKontakt}
        clickedButtonPos={clickedButtonPos}
        selectedObject={selectedObject}
        objs={objs}
        setObjs={setObjs}
        breite={breite}
        setBreite={setBreite}
        länge={länge}
        setLänge={setLänge}
        höhe={höhe}
        setHöhe={setHöhe}
        dachArt={dachArt}
        setDachArt={setDachArt}
        traufhöhe={traufhöhe}
        setTraufhöhe={setTraufhöhe}
        dachneigung={dachneigung}
        setDachneigung={setDachneigung}
        sockelhöhe={sockelhöhe}
        setSockelhöhe={setSockelhöhe}
        dachAusrichtung={dachAusrichtung}
        setDachAusrichtung={setDachAusrichtung}
        diffTraufFirst={diffTraufFirst}
        setDiffTraufFirst={setDiffTraufFirst}
        wandGeometrieVorgaben={wandGeometrieVorgaben}
        setWandGeometrieVorgaben={setWandGeometrieVorgaben}
        isolierung={isolierung}
        setIsolierung={setIsolierung}
        paneeltyp={paneeltyp}
        setPaneeltyp={setPaneeltyp}
        paneelBreiteMm={paneelBreiteMm}
        setPaneelBreiteMm={setPaneelBreiteMm}
        wandOrientierung={wandOrientierung}
        setWandOrientierung={setWandOrientierung}
        farbSchema={farbSchema}
        setFarbSchema={setFarbSchema}
        außenFarbe={außenFarbe}
        setAußenFarbe={setAußenFarbe}
        außenFarbeMuster={außenFarbeMuster}
        setAußenFarbeMuster={setAußenFarbeMuster}
        musterVerortung={musterVerortung}
        setMusterVerortung={setMusterVerortung}
        dachIsolierung={dachIsolierung}
        setDachIsolierung={setDachIsolierung}
        dachPaneeltyp={dachPaneeltyp}
        setDachPaneeltyp={setDachPaneeltyp}
        dachPaneelBreiteMm={dachPaneelBreiteMm}
        setDachPaneelBreiteMm={setDachPaneelBreiteMm}
        dachAußenFarbe={dachAußenFarbe}
        setDachAußenFarbe={setDachAußenFarbe}
        dachPvcName={dachPvcName}
        setDachPvcName={setDachPvcName}
        pvcName={pvcName}
        setPvcName={setPvcName}
        fensterFarbe={fensterFarbe}
        setFensterFarbe={setFensterFarbe}
        türFarbe={türFarbe}
        setTürFarbe={setTürFarbe}
        schiebeTorFarbe={schiebeTorFarbe}
        setSchiebeTorFarbe={setSchiebeTorFarbe}
        rollTorFarbe={rollTorFarbe}
        setRollTorFarbe={setRollTorFarbe}
        sektionalTorFarbe={sektionalTorFarbe}
        setSektionalTorFarbe={setSektionalTorFarbe}
        türFarbeInnen={türFarbeInnen}
        setTürFarbeInnen={setTürFarbeInnen}
        sektionalTorFarbeInnen={sektionalTorFarbeInnen}
        setSektionalTorFarbeInnen={setSektionalTorFarbeInnen}
        gebäudeZweck={gebäudeZweck}
        setGebäudeZweck={setGebäudeZweck}
        bauBeginn={bauBeginn}
        setBauBeginn={setBauBeginn}
        anwerbungKunden={anwerbungKunden}
        setAnwerbungKunden={setAnwerbungKunden}
        größeGebäudeM2={größeGebäudeM2}
        setGrößeGebäudeM2={setGrößeGebäudeM2}
        bodenplatteFarbe={bodenplatteFarbe}
        setBodenplatteFarbe={setBodenplatteFarbe}
        rahmenFarbe={rahmenFarbe}
        setRahmenFarbe={setRahmenFarbe}
        sekundärKonstruktionsFarbe={sekundärKonstruktionsFarbe}
        setSekundärKonstruktionsFarbe={setSekundärKonstruktionsFarbe}
        sekundärHolzKonstruktionsFarbe={sekundärHolzKonstruktionsFarbe}
        setSekundärHolzKonstruktionsFarbe={setSekundärHolzKonstruktionsFarbe}
        zubehörFarbe={zubehörFarbe}
        setZubehörFarbe={setZubehörFarbe}
        kantenFarbe={kantenFarbe}
        setKantenFarbe={setKantenFarbe}
        kranKapazität={kranKapazität}
        setKranKapazität={setKranKapazität}
        abmessungenAnzeigen={abmessungenAnzeigen}
        setAbmessungenAnzeigen={setAbmessungenAnzeigen}
        />

        <DarstellungUI
            editMenü={editMenü}
            setEditMenü={setEditMenü}
            kantenAnzeigen={kantenAnzeigen}
            setKantenAnzeigen={setKantenAnzeigen}
            oberflächenAnzeigen={oberflächenAnzeigen}
            setOberflächenAnzeigen={setOberflächenAnzeigen}
            abmessungenAnzeigen={abmessungenAnzeigen}
            setAbmessungenAnzeigen={setAbmessungenAnzeigen}
            plattenAnzeigen={plattenAnzeigen}
            setPlattenAnzeigen={setPlattenAnzeigen}
            massivwändeAnzeigen={massivwändeAnzeigen}
            setMassivwändeAnzeigen={setMassivwändeAnzeigen}
            öffnungenAnzeigen={öffnungenAnzeigen}
            setÖffnungenAnzeigen={setÖffnungenAnzeigen}
            rahmenAnzeigen={rahmenAnzeigen}
            setRahmenAnzeigen={setRahmenAnzeigen}
            pfettenAnzeigen={pfettenAnzeigen}
            setPfettenAnzeigen={setPfettenAnzeigen}
            wandriegelAnzeigen={wandriegelAnzeigen}
            setWandriegelAnzeigen={setWandriegelAnzeigen}
            kantteileAnzeigen={kantteileAnzeigen}
            setKantteileAnzeigen={setKantteileAnzeigen}
            zubehörAnzeigen={zubehörAnzeigen}
            setZubehörAnzeigen={setZubehörAnzeigen}
            bodenplatteAnzeigen={bodenplatteAnzeigen}
            setBodenplatteAnzeigen={setBodenplatteAnzeigen}
            volumenAnzeigen={volumenAnzeigen}
            setVolumenAnzeigen={setVolumenAnzeigen}
            straßenAnzeigen={straßenAnzeigen}
            setStraßenAnzeigen={setStraßenAnzeigen}
            strukturelleKomponentenAnzeigen={strukturelleKomponentenAnzeigen}
            setStrukturelleKomponentenAnzeigen={setStrukturelleKomponentenAnzeigen}
            dekorationenAnzeigen={dekorationenAnzeigen}
            setDekorationenAnzeigen={setDekorationenAnzeigen}
            gebäudeformAnzeigen={gebäudeformAnzeigen}
            setGebäudeformAnzeigen={setGebäudeformAnzeigen}
            anschleppungenAnzeigen={anschleppungenAnzeigen}
            setAnschleppungenAnzeigen={setAnschleppungenAnzeigen}
            sekundärstrukturAnzeigen={sekundärstrukturAnzeigen}
            setSekundärstrukturAnzeigen={setSekundärstrukturAnzeigen}
            kreuzverbändeAnzeigen={kreuzverbändeAnzeigen}
            setKreuzverbändeAnzeigen={setKreuzverbändeAnzeigen}
        />

        <FirstRunTutorial setEditMenü={setEditMenü} editMenü={editMenü} />
        

        </>
    )
}