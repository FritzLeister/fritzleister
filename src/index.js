import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";
import AbfragePage from "./AbfragePage";
import LandingPage from "./LandingPage";
import LoadingPage from "./LoadingPage";
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
  setDachSelection
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
      {loading ? <LoadingPage /> : <App 
        setShowApp={() => setShowApp("landing")} 
        setShowApp2={() => setShowApp("custom")} 
        setShowApp3={() => setShowApp("preis")}
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
      />}
    </>
  )
}


function Root() {
  const [showApp, setShowApp] = useState("landing")

  const [länge, setLänge] = useState(15)
  const [breite, setBreite] = useState(7)
  const [höhe, setHöhe] = useState(13)

  const [flach, setFlach] = useState(false)
  const [hallenartSelection, setHallenartSelection] = useState("")
  const [dachSelection, setDachSelection] = useState("")
  
  // länge: ; breite: ; höhe: ; flach: ; dachSelection: ; hallenartSelection: ;
  const [hallenSave, setHallenSave] = useState([])
  
  useEffect(() => {
        console.log("hallenSave updated:", hallenSave);
    }, [hallenSave]);


  function deleteHalle(id) {
    let newArr = hallenSave.filter(item => item.id !== id)
    setHallenSave(newArr)
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

      {showApp === "app" && (
        <AppPageFunc 
        setShowApp={setShowApp} 
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
        />
      )}

      {showApp === "preis" && (
        <SavePage 
        setShowApp={setShowApp}
        setLänge={setLänge}
        setBreite={setBreite}
        setHöhe={setHöhe}
        setHallenartSelection={setHallenartSelection}
        setDachSelection={setDachSelection}
        hallenSave={hallenSave}
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
        />
      )}
    </StrictMode>
  );
}

const root = createRoot(document.getElementById("root"))
root.render(<Root />);
