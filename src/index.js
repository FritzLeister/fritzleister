import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";
import AbfragePage from "./AbfragePage";
import LandingPage from "./LandingPage";
import LoadingPage from "./LoadingPage"; // falls du eine eigene Lade-Seite hast
import CustomPage from "./CustomPage";


/*
function AppSequence({ setShowAppC }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer)
  }, []);

  return (
    <>
      {loading ? <App setShowApp={setShowAppC} /> : <App setShowApp={setShowAppC} />}
    </>
  )
  // <CustomPage openApp={() => setShowAppC(true)} />
  // <App appSequence={nextSide} setShowApp={setShowAppC} />
}


function AppFalseSequence({ setShowAppC }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer)
  }, []);

  return (
    <>
      {loading ? <LandingPage openApp={() => setShowAppC(true)} /> : <LandingPage openApp={() => setShowAppC(true)} />}
    </>
  )
}
*/

function Root() {
  const [showApp, setShowApp] = useState(false)

  const [länge, setLänge] = useState(15)
  const [breite, setBreite] = useState(7)
  const [höhe, setHöhe] = useState(13)

  return (
    <StrictMode>
      {showApp ? (
        // <AppSequence setShowAppC={setShowApp} />
        <App setShowApp={setShowApp} />
      ) : (
        // <AppFalseSequence setShowAppC={setShowApp} />
        <AbfragePage />
      )}
    </StrictMode>
  );
}

const root = createRoot(document.getElementById("root"))
root.render(<Root />);
