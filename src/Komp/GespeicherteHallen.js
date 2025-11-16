
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
    setNameEdit
}) {

    function handleClick() {

        // Aktuelle State Werte in Werte vom Objekt ändern
        setDachSelection(halle.dachArt)
        setLänge(halle.länge)
        setBreite(halle.breite)
        setHöhe(halle.höhe)
        setHallenartSelection(halle.hallenArt)
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

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                padding: 18,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                color: "#000000ff",
                width: "100%",
                minHeight: "100px",
                maxWidth: 900,
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderRadius: 12,
                background: "#ffffff",
                margin: "10px auto",
                cursor: 'default',
                position: "relative"
            }}
        >
            <div style={{
                position: 'absolute',
                top: 10,
                right: 10,
                cursor: 'pointer',
                zIndex: 1000
            }}
            onClick={() => deleteHalle(halle.id)}
            >
                <RemoveCircleOutlineIcon />
            </div>

            <div style={{
                position: 'absolute',
                top: 10,
                right: 35,
                cursor: 'pointer',
                zIndex: 1000
            }}
            onClick={handleClick}
            >
                <OpenInNewIcon />
            </div>

            <div style={{
                position: 'absolute',
                top: 10,
                right: 60,
                cursor: 'pointer',
                zIndex: 1000
            }}
            onClick={() => setOutput(!output)}
            >
                <EditIcon />
            </div>

            {/*  
            <h3 style={{ marginBottom: "10px", marginTop: "0px" }} className="text">{halle.name === "" ? `Halle ${index + 1}` : halle.name}</h3>
            */}

            {output ? (
                <div>
                    <input
                    style={{ marginBottom: "10px", marginTop: "0px", height: "25px" }}
                    placeholder='Hier neuen Titel eingeben...'
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleInputEnter();
                    }}
                    value={inputValue}
                    onChange={handleInputChange}
                    />
                    {/* <CheckCircleIcon style={{marginLeft: "5px"}} /> */}
                </div>
            ):(
                <h3 style={{ marginBottom: "10px", marginTop: "0px" }} className="text">{halle.name === "" ? `Halle ${index + 1}` : halle.name}</h3>
            )}

            <div>
                <p className="text" >
                    Länge: 
                    <text className="text" style={{ fontWeight: "400" }}>
                        {halle.savedHalleLänge || halle.länge}m
                    </text>
                </p>
                <p className="text">
                    Breite: 
                    <text className="text" style={{ fontWeight: "400" }}>
                        {halle.savedHalleBreite || halle.breite}m
                    </text>
                </p>
                <p className="text">
                    Höhe: 
                    <text className="text" style={{ fontWeight: "400" }}>
                        {halle.savedHalleHöhe || halle.höhe}m
                    </text>
                </p>
                <p className="text">
                    Dachart: 
                    <text className="text" style={{ fontWeight: "400" }}>
                        {halle.savedHalleDachArt || halle.dachArt}
                    </text>
                </p>
                <p className="text">
                    Hallenart: 
                    <text className="text" style={{ fontWeight: "400" }}>{halle.savedHalleArt || halle.hallenArt}</text>
                </p>
            </div>
        </div>
    )
}