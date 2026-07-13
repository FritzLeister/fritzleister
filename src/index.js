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
  setEditMenü
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

  // länge: ; breite: ; höhe: ; flach: ; dachSelection: ; hallenartSelection: ;
  const [hallenSave, setHallenSave] = useState([])
  const [objs, setObjs] = useState([
  ])
  
  useEffect(() => {
        console.log("hallenSave updated:", hallenSave);
    }, [hallenSave]);


  function deleteHalle(id) {
    console.log("deleteHalle called with id:", id);
    setHallenSave(prev => {
      const next = prev.filter(item => item.id !== id);
      // console.log("hallenSave after delete:", next);
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
        deleteHalle={deleteHalle}
        objs={objs}
        setObjs={setObjs}
        hydrateObjs={hydrateObjs}
        />
      )}
    </StrictMode>
  );
}

const root = createRoot(document.getElementById("root"))
root.render(<Root />);
