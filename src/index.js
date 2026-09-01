import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import AbfragePage from "./AbfragePage";
import DesktopApplication from "./DesktopApplication";
import DeviceGate from "./DeviceGate";
import LandingPage from "./LandingPage";
import LoadingPage from "./LoadingPage";
import MobileBlockScreen from "./MobileBlockScreen";
import SavePage from "./SavePage";
import SavedHallen from "./SavedHallen";
import FAQPage from "./FAQPage";

const SAVED_HALLEN_STORAGE_KEY = "ersteHalle.savedHallen";
const SHARE_QUERY_PARAM = "share";

function decodeSharePayload(value) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const normalized = value.replace(/ /g, "+");
    const binary = window.atob(normalized);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

    if (typeof TextDecoder !== "undefined") {
      return JSON.parse(new TextDecoder().decode(bytes));
    }

    return JSON.parse(decodeURIComponent(binary));
  } catch (error) {
    try {
      return JSON.parse(decodeURIComponent(value));
    } catch (fallbackError) {
      return null;
    }
  }
}

function loadSavedHallen() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(SAVED_HALLEN_STORAGE_KEY);
    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.warn("Konnte gespeicherte Hallen nicht laden:", error);
    return [];
  }
}

const DEMO_HALL_CONFIGURATION = {
  länge: 50,
  breite: 22,
  höhe: 5,
  flach: false,
  hallenArt: "industrie",
  dachArt: "satteldach",
  appearance: {},
  objs: [
    {
      abstandLinks: 39.375,
      abstandRechts: 75.625,
      abstandUnten: 0.625,
      fensterFarbe: "Weiß",
      id: 1,
      lang: true,
      posSegment: "mittig",
      rechts: false,
      reflektor: "keine",
      reflektorFarbe: "Weiß",
      sprossenX: 0,
      sprossenY: 0,
      startPos: { x: -13.025, z: 27.5, rechts: false, lang: true, y: 1.175 },
      type: "fenster",
      value: [4, 3],
      vorne: true
    },
    {
      abstandLinks: 75,
      abstandRechts: 40,
      abstandUnten: 0.625,
      fensterFarbe: "Weiß",
      id: 2,
      lang: true,
      posSegment: "mittig",
      rechts: false,
      reflektor: "keine",
      reflektorFarbe: "Weiß",
      sprossenX: 0,
      sprossenY: 0,
      startPos: { x: 17.6, z: 27.5, rechts: false, lang: true, y: 1.175 },
      type: "fenster",
      value: [4, 3],
      vorne: true
    },
    {
      abstandLinks: 110.625,
      abstandRechts: 4.375,
      abstandUnten: 0.625,
      fensterFarbe: "Weiß",
      id: 3,
      lang: true,
      posSegment: "mittig",
      rechts: false,
      reflektor: "keine",
      reflektorFarbe: "Weiß",
      sprossenX: 0,
      sprossenY: 0,
      startPos: { x: 53.225, z: 27.5, rechts: false, lang: true, y: 1.175 },
      type: "fenster",
      value: [4, 3],
      vorne: true
    },
    {
      abstandLinks: 3.75,
      abstandRechts: 111.25,
      abstandUnten: 0.625,
      fensterFarbe: "Weiß",
      id: 4,
      lang: true,
      posSegment: "mittig",
      rechts: false,
      reflektor: "keine",
      reflektorFarbe: "Weiß",
      sprossenX: 0,
      sprossenY: 0,
      startPos: { x: -53.65, z: 27.5, rechts: false, lang: true, y: 1.175 },
      type: "fenster",
      value: [4, 3],
      vorne: true
    },
    {
      abstandLinks: 18.125,
      abstandRechts: 17.5,
      abstandUnten: 0,
      fensterstreifenHöhe: null,
      id: 5,
      lang: false,
      posSegment: "mittig",
      rechts: true,
      reflektor: "keine",
      schlupftür: "nein",
      schlupftürBreite: null,
      schlupftürDistanzX: null,
      schlupftürHöhe: null,
      schlupftürOrientierung: null,
      sektionalTorFarbe: "Weiß",
      sektionalTorFüllFarbe: "Grau",
      sektionalTorFüllFarbeInnen: "Grau",
      sektionalTorReflektorFarbe: "Weiß",
      startPos: { x: -63.2, z: 0.1, rechts: true, lang: false, y: 0.8999999999999999 },
      transparenteFüllung: "nein",
      transparentePaneele: null,
      type: "sektionaltor",
      value: [7, 3],
      vorne: true
    },
    {
      farbe: "Weiß",
      fensterstreifenHöhe: null,
      füllFarbe: "Weiß",
      id: 6,
      lang: true,
      länge: 3,
      posSegment: "mittig",
      rampenhöhe: 0.8,
      rechts: true,
      reflektor: "keine",
      schlupftür: "nein",
      schlupftürBreite: null,
      schlupftürDistanzX: null,
      schlupftürHöhe: null,
      schlupftürOrientierung: null,
      startPos: { x: 35.51785714285715, z: -28.2, rechts: true, lang: true },
      transparenteFüllung: "nein",
      transparentePaneele: null,
      typ: "ladehaus",
      type: "laderampe",
      value: [3.5, 4.2],
      verkleidungFarbe: "Weiß",
      vorne: true
    },
    {
      farbe: "Weiß",
      fensterstreifenHöhe: null,
      füllFarbe: "Weiß",
      id: 7,
      lang: true,
      länge: 3,
      posSegment: "mittig",
      rampenhöhe: 0.8,
      rechts: true,
      reflektor: "keine",
      schlupftür: "nein",
      schlupftürBreite: null,
      schlupftürDistanzX: null,
      schlupftürHöhe: null,
      schlupftürOrientierung: null,
      startPos: { x: -0.1249999999999929, z: -28.2, rechts: true, lang: true },
      transparenteFüllung: "nein",
      transparentePaneele: null,
      typ: "ladehaus",
      type: "laderampe",
      value: [3.5, 4.2],
      verkleidungFarbe: "Weiß",
      vorne: true
    },
    {
      abstandLinks: 21.25,
      abstandRechts: 93.125,
      farbe: "Weiß",
      fensterstreifenHöhe: null,
      füllFarbe: "Weiß",
      id: 8,
      lang: true,
      länge: 3,
      posSegment: "mittig",
      rampenhöhe: 0.8,
      rechts: true,
      reflektor: "keine",
      schlupftür: "nein",
      schlupftürBreite: null,
      schlupftürDistanzX: null,
      schlupftürHöhe: null,
      schlupftürOrientierung: null,
      startPos: { x: -36.025, z: -28.2, rechts: true, lang: true, y: 2.775 },
      transparenteFüllung: "nein",
      transparentePaneele: null,
      typ: "ladehaus",
      type: "laderampe",
      value: [3.5, 4.2],
      verkleidungFarbe: "Weiß",
      vorne: true
    },
    {
      abstandLinks: 75,
      abstandRechts: 40,
      abstandUnten: 0.625,
      fensterFarbe: "Weiß",
      id: 9,
      lang: true,
      posSegment: "mittig",
      rechts: true,
      reflektor: "keine",
      reflektorFarbe: "Weiß",
      sprossenX: 0,
      sprossenY: 0,
      startPos: { x: 17.6, z: -27.5, rechts: true, lang: true, y: 1.175 },
      type: "fenster",
      value: [4, 3],
      vorne: true
    },
    {
      abstandLinks: 39.375,
      abstandRechts: 75.625,
      abstandUnten: 0.625,
      fensterFarbe: "Weiß",
      id: 10,
      lang: true,
      posSegment: "mittig",
      rechts: true,
      reflektor: "keine",
      reflektorFarbe: "Weiß",
      sprossenX: 0,
      sprossenY: 0,
      startPos: { x: -18.65, z: -27.5, rechts: true, lang: true, y: 1.175 },
      type: "fenster",
      value: [4, 3],
      vorne: true
    },
    {
      id: 11,
      lang: false,
      posSegment: "mittig",
      rechts: false,
      reflektor: "keine",
      schiebeseite: "beide",
      schiebetürFüllFarbe: "Weiß",
      schiebetürFüllFarbeInnen: "Weiß",
      schiebetürSchienenFarbe: "Grau",
      schlupftür: "nein",
      schlupftürBreite: null,
      schlupftürDistanz: null,
      schlupftürHöhe: null,
      schlupftürOrientierung: null,
      schlupftürTransparent: null,
      startPos: { x: 63.2, z: -0.07499999999999574, rechts: false, lang: false },
      type: "schiebetür",
      value: [3, 3],
      vorne: true,
      öffnet: "außen"
    }
  ]
};

function CustomPageFunc({ 
  setShowApp, 
  setFlach, 
  setLänge, 
  länge, 
  breite, 
  setBreite, 
  höhe, 
  setHöhe,
  hallenartSelection,
  setHallenartSelection,
  dachSelection,
  setDachSelection,
  setHallenSave,
  hallenSave
}) {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer)
  }, []);

  return (
    <>
      {loading ? <LoadingPage /> : 
      <AbfragePage 
      setShowApp={setShowApp}
      setFlach={setFlach} 
      länge={länge} 
      setLänge={setLänge} 
      breite={breite} 
      setBreite={setBreite}
      höhe={höhe}
      setHöhe={setHöhe}
      hallenartSelection={hallenartSelection}
      setHallenartSelection={setHallenartSelection}
      dachSelection={dachSelection}
      setDachSelection={setDachSelection}
      setHallenSave={setHallenSave}
      hallenSave={hallenSave}
      />}
    </>
  )
  // <CustomPage openApp={() => setShowAppC(true)} />
  // <App appSequence={nextSide} setShowApp={setShowAppC} />
}



function LandingPagefunc({ setShowApp }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer)
  }, []);

  return (
    <>
      {loading ? <LoadingPage /> : <LandingPage setShowApp={setShowApp} />}
    </>
  )
}

function AppPageFunc({ 
  setShowApp, 
  setAnfrageSummary,
  flach,
  setFlach,
  länge, 
  setLänge, 
  breite, 
  setBreite, 
  höhe, 
  setHöhe,
  setHallenSave,
  hallenSave,
  hallenartSelection,
  setHallenartSelection,
  dachSelection,
  setDachSelection,
  objs,
  setObjs,
  editMenü,
  setEditMenü,
  appearanceConfig,
  setAppearanceConfig
}) {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer)
  }, []);

  return (
    <>
      {loading ? <LoadingPage /> : <DeviceGate fallback={<MobileBlockScreen />}>
      <DesktopApplication 
        setShowApp={() => setShowApp("landing")} 
        setShowApp2={() => setShowApp("custom")} 
        setShowApp3={(summaryPayload) => {
          if (summaryPayload) {
            setAnfrageSummary(summaryPayload)
          }
          setShowApp("preis")
        }}
        setShowAppKontakt={(summaryPayload) => {
          if (summaryPayload) {
            setAnfrageSummary(summaryPayload)
          }
          setShowApp("kontakt")
        }}
        flach={flach}
        setFlach={setFlach}
        länge={länge}
        setLänge={setLänge}
        breite={breite}
        setBreite={setBreite}
        höhe={höhe}
        setHöhe={setHöhe}
        setHallenSave={setHallenSave}
        hallenartSelection={hallenartSelection}
        setHallenartSelection={setHallenartSelection}
        dachSelection={dachSelection}
        setDachSelection={setDachSelection}
        objs={objs}
        setObjs={setObjs}
        editMenü={editMenü}
        setEditMenü={setEditMenü}
        appearanceConfig={appearanceConfig}
        setAppearanceConfig={setAppearanceConfig}
      />
      </DeviceGate>}
    </>
  )
}


function Root() {
  const [showApp, setShowApp] = useState("landing")

  const [editMenü, setEditMenü] = useState('')

  const [länge, setLänge] = useState(70)
  const [breite, setBreite] = useState(30)
  const [höhe, setHöhe] = useState(6)

  const [flach, setFlach] = useState(false)
  const [hallenartSelection, setHallenartSelection] = useState("")
  const [dachSelection, setDachSelection] = useState("")
  const [anfrageSummary, setAnfrageSummary] = useState(null)
  const [appearanceConfig, setAppearanceConfig] = useState({})

  // länge: ; breite: ; höhe: ; flach: ; dachSelection: ; hallenartSelection: ;
  const [hallenSave, setHallenSave] = useState(loadSavedHallen)
  const [objs, setObjs] = useState([
  ])

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(SAVED_HALLEN_STORAGE_KEY, JSON.stringify(hallenSave));
    } catch (error) {
      console.warn("Konnte gespeicherte Hallen nicht speichern:", error);
    }
  }, [hallenSave]);
  
  function deleteHalle(id) {
    setHallenSave(prev => {
      const next = prev.filter(item => item.id !== id);
      return next;
    })
  }

  function saveKontaktHalle() {
    setHallenSave(prev => {
      const newObj = {
        id: Date.now(),
        breite,
        höhe,
        länge,
        dachArt: (dachSelection === "" ? "satteldach" : dachSelection),
        hallenArt: (hallenartSelection === "" ? "industrie" : hallenartSelection),
        flach,
        appearance: appearanceConfig || {},
        objs: Array.isArray(objs) ? objs.map(obj => ({ ...obj })) : [],
        name: ""
      };

      return [...prev, newObj];
    })
  }

  // Hydrate saved objects into runtime-ready objects with handlers that use the
  // root `setObjs`. This recreates `onChange` handlers so loaded objects are
  // editable after being restored from a saved hall.
  function hydrateObjs(savedArr) {
    if (!Array.isArray(savedArr)) return [];
    return savedArr.map(obj => {
      const id = obj.id;
      const value = Array.isArray(obj.value) ? [...obj.value] : obj.value;
      return {
        ...obj,
        value,
        onChange: [
          (newWidth) => setObjs(current => current.map(o => o.id === id ? { ...o, value: [newWidth, o.value[1]] } : o)),
          (newHeight) => setObjs(current => current.map(o => o.id === id ? { ...o, value: [o.value[0], newHeight] } : o))
        ]
      }
    })
  }

  function handleOpenDemo() {
    const demoHall = DEMO_HALL_CONFIGURATION;

    setLänge(demoHall.länge ?? 70);
    setBreite(demoHall.breite ?? 30);
    setHöhe(demoHall.höhe ?? 6);
    setFlach(Boolean(demoHall.flach ?? false));
    setHallenartSelection(demoHall.hallenArt ?? "");
    setDachSelection(demoHall.dachArt ?? "");
    setAppearanceConfig(demoHall.appearance ?? {});
    setEditMenü("");
    setObjs(hydrateObjs(Array.isArray(demoHall.objs) ? demoHall.objs : []));
    setShowApp("app");
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const encodedShare = new URLSearchParams(window.location.search).get(SHARE_QUERY_PARAM);
    if (!encodedShare) {
      return;
    }

    try {
      const decodedPayload = decodeSharePayload(encodedShare);
      if (!decodedPayload || decodedPayload.version !== 1 || !decodedPayload.hall) {
        return;
      }

      const sharedHall = decodedPayload.hall;
      setLänge(sharedHall.länge ?? 70);
      setBreite(sharedHall.breite ?? 30);
      setHöhe(sharedHall.höhe ?? 6);
      setFlach(Boolean(sharedHall.flach ?? false));
      setHallenartSelection(sharedHall.hallenArt ?? "");
      setDachSelection(sharedHall.dachArt ?? "");
      setAppearanceConfig(sharedHall.appearance ?? {});

      setHallenSave(prev => {
        const normalizedHall = {
          id: sharedHall.id ?? Date.now(),
          breite: sharedHall.breite ?? 30,
          höhe: sharedHall.höhe ?? 6,
          länge: sharedHall.länge ?? 70,
          dachArt: sharedHall.dachArt ?? "satteldach",
          hallenArt: sharedHall.hallenArt ?? "industrie",
          flach: Boolean(sharedHall.flach ?? false),
          appearance: sharedHall.appearance ?? {},
          objs: Array.isArray(sharedHall.objs) ? sharedHall.objs.map(obj => ({ ...obj })) : [],
          name: typeof sharedHall.name === "string" ? sharedHall.name : ""
        };

        const alreadyExists = prev.some(item => item.id === normalizedHall.id);
        if (alreadyExists) {
          return prev;
        }

        return [normalizedHall, ...prev];
      });

      setObjs(hydrateObjs(Array.isArray(sharedHall.objs) ? sharedHall.objs : []));
      setShowApp("app");

      if (typeof window !== "undefined" && window.history?.replaceState) {
        const cleanUrl = `${window.location.pathname}${window.location.hash}`;
        window.history.replaceState({}, "", cleanUrl);
      }
    } catch (error) {
      console.warn("Konnte freigegebene Halle nicht laden:", error);
    }
  }, []);
  

  return (
    <StrictMode>
      {showApp === "landing"  && (
        // <AppSequence setShowAppC={setShowApp} />
        // <App setShowApp={setShowApp} />
        <LandingPagefunc setShowApp={setShowApp} />
      )}

      {showApp === "custom" && (
        <CustomPageFunc 
        setShowApp={setShowApp} 
        setFlach={setFlach} 
        länge={länge} 
        setLänge={setLänge} 
        breite={breite} 
        setBreite={setBreite} 
        höhe={höhe} 
        setHöhe={setHöhe}
        hallenartSelection={hallenartSelection}
        setHallenartSelection={setHallenartSelection}
        dachSelection={dachSelection}
        setDachSelection={setDachSelection}
        setHallenSave={setHallenSave}
        hallenSave={hallenSave}
        />
      )}

      {/* Kontakt lässt die konfigurierte Halle im Hintergrund gemountet, damit Snapshots den echten Live-Zustand erfassen. */}
      {(showApp === "app" || showApp === "kontakt") && (
        <AppPageFunc 
        setShowApp={setShowApp} 
        setAnfrageSummary={setAnfrageSummary}
        flach={flach}
        setFlach={setFlach}
        länge={länge} 
        setLänge={setLänge} 
        breite={breite} 
        setBreite={setBreite} 
        höhe={höhe} 
        setHöhe={setHöhe}
        hallenartSelection={hallenartSelection}
        setHallenartSelection={setHallenartSelection}
        dachSelection={dachSelection}
        setDachSelection={setDachSelection}
        setHallenSave={setHallenSave}
        hallenSave={hallenSave}
        objs={objs}
        setObjs={setObjs}
        editMenü={editMenü}
        setEditMenü={setEditMenü}
        appearanceConfig={appearanceConfig}
        setAppearanceConfig={setAppearanceConfig}
        />
      )}

      {showApp === "preis" && (
        <SavePage 
        key="save-preis"
        setShowApp={setShowApp}
        setLänge={setLänge}
        setBreite={setBreite}
        setHöhe={setHöhe}
        setHallenartSelection={setHallenartSelection}
        setDachSelection={setDachSelection}
        hallenSave={hallenSave}
        onKontaktSubmit={saveKontaktHalle}
        summaryData={anfrageSummary}
        objs={objs}
        />
      )}

      {showApp === "kontakt" && (
        <SavePage 
        key="save-kontakt"
        setShowApp={setShowApp}
        setLänge={setLänge}
        setBreite={setBreite}
        setHöhe={setHöhe}
        setHallenartSelection={setHallenartSelection}
        setDachSelection={setDachSelection}
        hallenSave={hallenSave}
        onKontaktSubmit={saveKontaktHalle}
        initialSchirm="kontakt"
        summaryData={anfrageSummary}
        objs={objs}
        />
      )}

      {showApp === "saved" && (
        <SavedHallen 
        hallenSave={hallenSave}
        setHallenSave={setHallenSave}
        setShowApp={setShowApp}
        setLänge={setLänge}
        setBreite={setBreite}
        setHöhe={setHöhe}
        setHallenartSelection={setHallenartSelection}
        setDachSelection={setDachSelection}
        setFlach={setFlach}
        setAppearanceConfig={setAppearanceConfig}
        deleteHalle={deleteHalle}
        objs={objs}
        setObjs={setObjs}
        hydrateObjs={hydrateObjs}
        />
      )}

      {showApp === "faq" && (
        <FAQPage setShowApp={setShowApp} onOpenDemo={handleOpenDemo} />
      )}
    </StrictMode>
  );
}

const root = createRoot(document.getElementById("root"))
root.render(<Root />);
