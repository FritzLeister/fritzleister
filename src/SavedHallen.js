import "./styles.css";
import GespeicherteHallen from "./Komp/GespeicherteHallen";
import "./styles.css";
//import GespeicherteHallen from "./Komp/GespeicherteHallen";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useState } from "react";

export default function SavedHallen({ 
    hallenSave, 
    setShowApp,
    setLänge,
    setBreite,
    setHöhe,
    setHallenartSelection,
    setDachSelection,
    deleteHalle,
    setHallenSave,
    objs,
    setObjs
      ,
      hydrateObjs
}) {

  // Verwende slice nach Index: die ersten 4 Elemente oben, der Rest unten
  const topItems = Array.isArray(hallenSave) ? hallenSave.slice(0, 4) : [];
  const bottomItems = Array.isArray(hallenSave) ? hallenSave.slice(4, 8) : [];

  const [nameEdit, setNameEdit] = useState(false)

  function editNameHalle(id, newName) {
    setHallenSave(prev => prev.map(item =>
      item.id === id ? { ...item, name: typeof newName === 'string' ? newName.trim() : newName } : item
    ));
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 18,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          color: "#000000",
          width: "90%",
          height: "80%",
          maxWidth: 900,
          maxHeight: "80vh",
          border: "1px solid rgba(0, 0, 0, 0.2)",
          zIndex: 1000,
          borderRadius: 12,
          boxSizing: "border-box",
          overflow: "auto",
          background: "#ffffff",
          position: "relative",
        }}
      >
        <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        cursor: "pointer",
        }}
        onClick={() => setShowApp("landing")}
        >
            <ArrowBackIcon fontSize="large" />
        </div>
        <img src="/StartpunktDigitalLogo.png" alt="Logo" style={{ width: 200, marginBottom: 20 }} />
        <h1 style={{ fontSize: 50 }}>Gespeicherte Hallen</h1>


        {Array.isArray(hallenSave) && hallenSave.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
            {/* obere Reihe: bis zu 4 Elemente */}
            <div style={{ display: "flex", flexDirection: "row", gap: 20, flexWrap: "nowrap", justifyContent: "center" }}>
              {topItems.map((halle, index) => (
                <GespeicherteHallen 
                key={halle.id ?? index} 
                halle={halle} 
                index={index} 
                setShowApp={setShowApp}
                setLänge={setLänge}
                setBreite={setBreite}
                setHöhe={setHöhe}
                setHallenartSelection={setHallenartSelection}
                setDachSelection={setDachSelection}
                deleteHalle={deleteHalle}
                editNameHalle={editNameHalle}
                nameEdit={nameEdit}
                setNameEdit={setNameEdit}
                objs={objs}
                setObjs={setObjs}
                hydrateObjs={hydrateObjs}
                hallenCount={Array.isArray(hallenSave) ? hallenSave.length : 0}
                />
              ))}
            </div>

            {/* untere Reihe: nur anzeigen, wenn es mehr als 4 Elemente gibt */}
            {bottomItems.length > 0 && (
              <div style={{ display: "flex", flexDirection: "row", gap: 20, flexWrap: "nowrap", justifyContent: "center" }}>
                {bottomItems.map((halle, idx) => (
                  // index weiterzählen, optional: globalIndex = 4 + idx
                  <GespeicherteHallen 
                    key={halle.id ?? 4 + idx} 
                    halle={halle} 
                    index={4 + idx} 
                    setShowApp={setShowApp} 
                    setLänge={setLänge}
                    setBreite={setBreite}
                    setHöhe={setHöhe}
                    setHallenartSelection={setHallenartSelection}
                    setDachSelection={setDachSelection}
                    deleteHalle={deleteHalle}
                    editNameHalle={editNameHalle}
                    nameEdit={nameEdit}
                    setNameEdit={setNameEdit}
                    objs={objs}
                    setObjs={setObjs}
                    hydrateObjs={hydrateObjs}
                    hallenCount={Array.isArray(hallenSave) ? hallenSave.length : 0}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text">Keine Hallen gespeichert</p>
        )}

      </div>
    </div>
  );
}
