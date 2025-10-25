import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";
import AbfragePage from "./AbfragePage";
import LandingPage from "./LandingPage";
import LoadingPage from "./LoadingPage"; // falls du eine eigene Lade-Seite hast
import CustomPage from "./CustomPage";



function CustomPageFunc({ setShowApp, setFlach, setLänge, länge, breite, setBreite, höhe, setHöhe }) {
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
      setShowApp={() => setShowApp("app")} 
      setFlach={setFlach} 
      länge={länge} 
      setLänge={setLänge} 
      breite={breite} 
      setBreite={setBreite}
      höhe={höhe}
      setHöhe={setHöhe}
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
      {loading ? <LoadingPage /> : <LandingPage openAbfrage={() => setShowApp("custom")} />}
    </>
  )
}

function AppPageFunc({ setShowApp, flach, länge, setLänge, breite, setBreite, höhe, setHöhe }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer)
  }, []);

  return (
    <>
      {loading ? <LoadingPage /> : <App 
        setShowApp={() => setShowApp("landing")} 
        setShowApp2={() => setShowApp("custom")} 
        flach={flach}
        länge={länge}
        setLänge={setLänge}
        breite={breite}
        setBreite={setBreite}
        höhe={höhe}
        setHöhe={setHöhe}
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
        />
      )}
    </StrictMode>
  );
}

const root = createRoot(document.getElementById("root"))
root.render(<Root />);
