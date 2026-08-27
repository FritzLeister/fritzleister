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
        <FAQPage setShowApp={setShowApp} />
      )}
    </StrictMode>
  );
}

const root = createRoot(document.getElementById("root"))
root.render(<Root />);
