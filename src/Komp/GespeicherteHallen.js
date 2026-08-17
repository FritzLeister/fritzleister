
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';

export default function GespeicherteHallen({ 
    halle, 
    index, 
    setShowApp,
    setLänge,
    setBreite,
    setHöhe,
    setHallenartSelection,
    setDachSelection,
    deleteHalle,
    editNameHalle,
    setNameEdit,
    objs,
    setObjs,
    hydrateObjs,
    hallenCount
}) {

    function handleClick() {

        // Aktuelle State Werte in Werte vom Objekt ändern
        setDachSelection(halle.dachArt)
        setLänge(halle.länge)
        setBreite(halle.breite)
        setHöhe(halle.höhe)
        setHallenartSelection(halle.hallenArt)
        if (typeof setObjs === 'function') {
            if (typeof hydrateObjs === 'function') {
                setObjs(hydrateObjs(halle.objs))
            } else {
                setObjs(Array.isArray(halle.objs) ? halle.objs.map(o => ({ ...o })) : [])
            }
        }
        // Wieder App anzeigen
        setShowApp("app")
    }

    const [inputValue, setInputValue] = useState(halle.name || "")

    function handleInputEnter() {
        editNameHalle(halle.id, inputValue)
        setOutput(false)
    }

    function handleInputChange(e) {
        setInputValue(e.target.value)
    }

    const [output, setOutput] = useState(false)

    function getWidthInput() {
        if (hallenCount >= 4) {
            return "80px"
        } else if (hallenCount === 3) {
            return "120px"
        } else if (hallenCount === 2) {
            return "160px"
        } else if (hallenCount === 1) {
            return "200px"
        }
    }

    return (
        <div className="savedHalleCard">
            <div className="savedHalleActionBar">
                <button
                    className="savedHalleActionButton"
                    onClick={() => setOutput(!output)}
                    aria-label="Bezeichnung bearbeiten"
                    type="button"
                >
                    <EditIcon fontSize="small" />
                </button>

                <button
                    className="savedHalleActionButton"
                    onClick={handleClick}
                    aria-label="Halle öffnen"
                    type="button"
                >
                    <OpenInNewIcon fontSize="small" />
                </button>

                <button
                    className="savedHalleActionButton"
                    onClick={(e) => { e.stopPropagation(); deleteHalle(halle.id); }}
                    aria-label="Halle löschen"
                    type="button"
                >
                    <RemoveCircleOutlineIcon fontSize="small" />
                </button>
            </div>

            {output ? (
                <div className="savedHalleNameWrapper">
                    <input
                        className="savedHalleInput"
                        style={{ width: getWidthInput() }}
                        placeholder='Titel...'
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleInputEnter();
                        }}
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                </div>
            ) : (
                <h3 className="savedHalleTitle">{halle.name === "" ? `Halle ${index + 1}` : halle.name}</h3>
            )}

            <div className="savedHalleMeta">
                <p>
                    <span>Länge</span>
                    <strong>{halle.savedHalleLänge || halle.länge}m</strong>
                </p>
                <p>
                    <span>Breite</span>
                    <strong>{halle.savedHalleBreite || halle.breite}m</strong>
                </p>
                <p>
                    <span>Höhe</span>
                    <strong>{halle.savedHalleHöhe || halle.höhe}m</strong>
                </p>
                <p>
                    <span>Dachart</span>
                    <strong>{halle.savedHalleDachArt || halle.dachArt}</strong>
                </p>
                <p>
                    <span>Hallenart</span>
                    <strong>{halle.savedHalleArt || halle.hallenArt}</strong>
                </p>
            </div>
        </div>
    )
}