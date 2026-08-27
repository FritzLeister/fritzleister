import "./styles.css";
import GespeicherteHallen from "./Komp/GespeicherteHallen";
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
    setFlach,
    setAppearanceConfig,
    deleteHalle,
    setHallenSave,
    objs,
    setObjs,
    hydrateObjs
}) {

  const topItems = Array.isArray(hallenSave) ? hallenSave.slice(0, 4) : [];
  const bottomItems = Array.isArray(hallenSave) ? hallenSave.slice(4, 8) : [];

  const [nameEdit, setNameEdit] = useState(false)

  function editNameHalle(id, newName) {
    setHallenSave(prev => prev.map(item =>
      item.id === id ? { ...item, name: typeof newName === 'string' ? newName.trim() : newName } : item
    ));
  }

  return (
    <div className="savedHallenPage">
      <div className="savedHallenAmbientOrbs" aria-hidden="true">
        <span className="savedHallenOrb savedHallenOrbOne" />
        <span className="savedHallenOrb savedHallenOrbTwo" />
      </div>

      <div className="savedHallenStage">
        <button
          className="savedHallenBackButton"
          onClick={() => setShowApp("landing")}
          aria-label="Zurück zur Landingpage"
          type="button"
        >
          <ArrowBackIcon />
        </button>

        <div className="savedHallenHeader">
          <div className="savedHallenHeaderText">
            <p className="landingEyebrow">Übersicht</p>
          </div>
          <img src="/LogoPerthel.png" alt="Logo" className="savedHallenLogo" />
        </div>
        <h1 className="savedHallenTitle">Gespeicherte Hallen</h1>
        <p className="savedHallenIntro">
          Öffne eine frühere Konfiguration direkt wieder oder starte eine neue Planung.
        </p>

        {Array.isArray(hallenSave) && hallenSave.length > 0 ? (
          <div className="savedHallenGrid">
            <div className="savedHallenRow">
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
                  setFlach={setFlach}
                  setAppearanceConfig={setAppearanceConfig}
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

            {bottomItems.length > 0 && (
              <div className="savedHallenRow">
                {bottomItems.map((halle, idx) => (
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
                    setFlach={setFlach}
                    setAppearanceConfig={setAppearanceConfig}
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
          <div className="savedHallenEmptyState">
            <p className="savedHallenEmptyText">Noch keine Hallen gespeichert.</p>
          </div>
        )}
      </div>
    </div>
  );
}
