import { Canvas } from '@react-three/fiber'
import "./styles.css"
import Halle from './Halle'
import SliderMui from "./Komp/SliderMui"
import { useState } from 'react'
import LoadingPage from "./LoadingPage";
import Add from './Komp/Add'
import { useEffect } from 'react'
import ButtonMui from './Komp/ButtonMui'
import { useLoader } from '@react-three/drei'
import { TextureLoader } from 'three'
import DarstellungUI from './Komp/DarstellungUI'

export default function App({ 
    setShowApp, 
    setShowApp2,
    setShowApp3,
    appSequence, 
    flach,
    länge,
    setLänge,
    breite,
    setBreite,
    höhe,
    setHöhe,
    setHallenSave,
    hallenartSelection,
    setHallenartSelection,
    dachSelection,
    setDachSelection,
    hallenSave,
    objs,
    setObjs,
    editMenü,
    setEditMenü
 }) {

    /*
    const [bodenLänge, setBodenLänge] = useState(40) // max 40
    const [bodenBreite, setBodenBreite] = useState(25) // max 25
    const [gebäudeHöhe, setGebäudeHöhe] = useState(15)
    */
    
    const [koordinate, setKoordinate] = useState([0,0.3,0])

    // Abmessungs-States (aus UiButtonEdit)
    const [dachArt, setDachArt] = useState('satteldach')
    const [traufhöhe, setTraufhöhe] = useState(3)
    const [dachneigung, setDachneigung] = useState(5)
    const [sockelhöhe, setSockelhöhe] = useState(2)
    const [dachAusrichtung, setDachAusrichtung] = useState('Rechts')
    const [diffTraufFirst, setDiffTraufFirst] = useState(4)

    // "Arbeits" - States (Verkleidung) aus UiButtonEdit
    const [wandGeometrieVorgaben, setWandGeometrieVorgaben] = useState('verkleidete-wand-mit-sockel')
    const [isolierung, setIsolierung] = useState('isoliert')
    const [paneeltyp, setPaneeltyp] = useState('trapez')
    const [wandOrientierung, setWandOrientierung] = useState('vertikal')
    const [farbSchema, setFarbSchema] = useState('einfarbig')
    const [außenFarbe, setAußenFarbe] = useState('?')
    const [außenFarbeMuster, setAußenFarbeMuster] = useState('!')
    const [musterVerortung, setMusterVerortung] = useState('4, 5')
    const [dachIsolierung, setDachIsolierung] = useState('isoliert')
    const [dachPaneeltyp, setDachPaneeltyp] = useState('trapez')
    const [dachAußenFarbe, setDachAußenFarbe] = useState('?')
    const [dachPvcName, setDachPvcName] = useState('PVC-Folie')
    const [pvcName, setPvcName] = useState('PVC-Folie')

    // "Arbeits" - States (Öffnungen) aus UiButtonEdit
    const [fensterFarbe, setFensterFarbe] = useState('?')
    const [türFarbe, setTürFarbe] = useState('?')
    const [schiebeTorFarbe, setSchiebeTorFarbe] = useState('?')
    const [rollTorFarbe, setRollTorFarbe] = useState('?')
    const [sektionalTorFarbe, setSektionalTorFarbe] = useState('?')
    const [türFarbeInnen, setTürFarbeInnen] = useState('?')
    const [sektionalTorFarbeInnen, setSektionalTorFarbeInnen] = useState('?')

    // 'Arbeits' - States (Angebot) aus UiButtonEdit
    const [gebäudeZweck, setGebäudeZweck] = useState('Produktionshalle')
    const [bauBeginn, setBauBeginn] = useState(new Date().getFullYear())
    const [anwerbungKunden, setAnwerbungKunden] = useState('Soziale-Medien')
    const [größeGebäudeM2, setGrößeGebäudeM2] = useState(760)

    // 'Arbeits' - States (Konstruktion) aus UiButtonEdit
    const [bodenplatteFarbe, setBodenplatteFarbe] = useState('?')
    const [rahmenFarbe, setRahmenFarbe] = useState('?')
    const [sekundärKonstruktionsFarbe, setSekundärKonstruktionsFarbe] = useState('?')
    const [sekundärHolzKonstruktionsFarbe, setSekundärHolzKonstruktionsFarbe] = useState('?')

    // 'Arbeits' - States (Zubehör) aus UiButtonEdit
    const [zubehörFarbe, setZubehörFarbe] = useState('?')
    const [kantenFarbe, setKantenFarbe] = useState('?')
    const [kranKapazität, setKranKapazität] = useState(1)

    // Darstellungs-States
    const [kantenAnzeigen, setKantenAnzeigen] = useState(true); // fertig
    const [oberflächenAnzeigen, setOberflächenAnzeigen] = useState(true); // fertig
    const [abmessungenAnzeigen, setAbmessungenAnzeigen] = useState(true); // fertig
    const [plattenAnzeigen, setPlattenAnzeigen] = useState(true); // fertig
    const [massivwändeAnzeigen, setMassivwändeAnzeigen] = useState(true); // fertig
    const [öffnungenAnzeigen, setÖffnungenAnzeigen] = useState(true); // gibt ja noch keine lol
    const [rahmenAnzeigen, setRahmenAnzeigen] = useState(true); // fertig
    const [pfettenAnzeigen, setPfettenAnzeigen] = useState(true); // fertig
    const [wandriegelAnzeigen, setWandriegelAnzeigen] = useState(true); // fertig
    const [kantteileAnzeigen, setKantteileAnzeigen] = useState(true); // fertig
    const [zubehörAnzeigen, setZubehörAnzeigen] = useState(true); // idk
    const [bodenplatteAnzeigen, setBodenplatteAnzeigen] = useState(true); // fertig
    const [volumenAnzeigen, setVolumenAnzeigen] = useState(true); // idk
    const [straßenAnzeigen, setStraßenAnzeigen] = useState(true); // idk
    const [strukturelleKomponentenAnzeigen, setStrukturelleKomponentenAnzeigen] = useState(true); // idk
    const [dekorationenAnzeigen, setDekorationenAnzeigen] = useState(true); // idk
    const [gebäudeformAnzeigen, setGebäudeformAnzeigen] = useState(true);
    const [anschleppungenAnzeigen, setAnschleppungenAnzeigen] = useState(true);
    const [sekundärstrukturAnzeigen, setSekundärstrukturAnzeigen] = useState(true); // idk 
    const [kreuzverbändeAnzeigen, setKreuzverbändeAnzeigen] = useState(true); // idk

    // Initialisiere hallenId mit der höchsten vorhandenen ID + 1 oder 1
    const [hallenId, setHallenId] = useState(() => {
        const maxId = hallenSave?.reduce((max, halle) =>
            (typeof halle?.id === 'number' && !Number.isNaN(halle.id) && halle.id > max) ? halle.id : max
        , 0) ?? 0;
        return Number(maxId) + 1;
    });

    const [türAttribute, setTürAttribute] = useState(false)
    const [selectedObject, setSelectedObject] = useState(null)

    // const [objs, setObjs] = useState([
        // value: [x,x,...] onChange: [x,x,...], type: , ggf.: rechts?
        /*
        {
            value: [16,9],
            onChange: [
                (newWidth) => setObjs(objs => objs.map(
                    obj => obj.type === "tür" 
                    ? { ...obj, value: [newWidth, obj.value[1]], onChange: obj.onChange}
                    : obj
                )), 
                (newHeight) => setObjs(objs => objs.map(
                    obj => obj.type === "tür" 
                    ? { ...obj, value: [obj.value[0], newHeight], onChange: obj.onChange}
                    : obj
                ))
            ],
            type: "tür",
            id: 0,
            rechts: false
        }, 
        */
        /*
        {
            value: [6,6],
            onChange:[
                (newWidth) => setObjs(objs => objs.map(
                    obj => obj.type === "dachfenster" 
                    ? { ...obj, value: [newWidth, obj.value[1]], onChange: obj.onChange}
                    : obj
                )), 
                (newHeight) => setObjs(objs => objs.map(
                    obj => obj.type === "dachfenster" 
                    ? { ...obj, value: [obj.value[0], newHeight], onChange: obj.onChange}
                    : obj
                ))
            ],
            type: "dachfenster",
            id: 1,
            rechts: true // WIEEESOOOOOOOOO
        }
        */
        /*
        {
            value: [5,5],
            onChange:[
                (newWidth) => setObjs(objs => objs.map(
                    obj => obj.type === "lüfter" 
                    ? { ...obj, value: [newWidth, obj.value[1]], onChange: obj.onChange}
                    : obj
                )), 
                (newHeight) => setObjs(objs => objs.map(
                    obj => obj.type === "lüfter" 
                    ? { ...obj, value: [obj.value[0], newHeight], onChange: obj.onChange}
                    : obj
                ))
            ],
            type: "lüfter",
            id: 2,
            rechts: false // "lang"
        },

        {
            value: [7,5],
            onChange:[
                (newWidth) => setObjs(objs => objs.map(
                    obj => obj.type === "lüfter" 
                    ? { ...obj, value: [newWidth, obj.value[1]], onChange: obj.onChange}
                    : obj
                )), 
                (newHeight) => setObjs(objs => objs.map(
                    obj => obj.type === "lüfter" 
                    ? { ...obj, value: [obj.value[0], newHeight], onChange: obj.onChange}
                    : obj
                ))
            ],
            type: "lüfter",
            id: 3,
            rechts: true // "lang"
        }
        */
    // ])

    /*
    function handleReset() {
        setShowResetLoading(true)
        setTimeout(() => {
            setShowResetLoading(false)
        }, 500); // 1 Sekunde LoadingPage anzeigen
    }
        */

    useEffect(() => {
        console.log("selected objs:", selectedObject);
    }, [selectedObject]);

    function handleOnChange(index, newValue) {
        setSelectedObject(prev => {
            if (!prev) return prev;
            const newObj = { ...prev, value: prev.value.map((v, i) => i === index ? newValue : v) };
            return newObj;
        });

        setObjs(objs => objs.map(obj =>
            obj.id === selectedObject.id
                ? { ...obj, value: obj.value.map((v, i) => i === index ? newValue : v) }
                : obj
        ));
    }

    function addObj(value, type, id, rechts) {
        const newObj = {
            value: value,
            onChange: [
                (newWidth) => setObjs(objs => objs.map(
                    obj => obj.type === type
                    ? { ...obj, value: [newWidth, obj.value[1]], onChange: obj.onChange}
                    : obj
                )), 
                (newHeight) => setObjs(objs => objs.map(
                    obj => obj.type === type 
                    ? { ...obj, value: [obj.value[0], newHeight], onChange: obj.onChange}
                    : obj
                ))
            ],
            type: type,
            id: id,
            rechts: rechts
        }
        setObjs(objs => [...objs, newObj])
        // setSelectedObject(newObj);
        // setTürAttribute(true);
    }

    function deleteObj(id) {

        let newArr = objs.filter(item => item.id !== id)
        setObjs(newArr)
        setTürAttribute(false)
    }


    return(
        <>
        <div style={{
            top: 20, 
            right: 20,
            position: "fixed",
            background: "rgba(255, 255, 255, 0.15)", // halbtransparent
            backdropFilter: "blur(10px)",             // Blur-Effekt
            WebkitBackdropFilter: "blur(10px)",       // Safari-Support
            padding: 18,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // etwas stärkerer Schatten
            color: "#000000ff",                            // besserer Kontrast
            width: 480,
            height: 90,
            border: "1px solid rgba(255, 255, 255, 0.2)", // dezenter Rand
            zIndex: 999,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center'
        }}>
            <div 
            style={{
                top: 3.5,
                right: 84,
                position: 'fixed',
                borderRadius: 12,
                padding: "5px",
                border: "1px solid rgba(59, 44, 44, 0.2)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                height: 80,
                marginLeft: 20,
                color: "rgba(66, 39, 39, 0.2)",
                cursor: 'pointer',
                transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
            onClick={() => {
                setObjs([])
                setShowApp()
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(200, 200, 200, 0.25)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
            }}
            >
                <h2 className='navbar'>Home</h2>
            </div>

            <div style={{
                top: 3.5,
                right: 5,
                position: 'fixed',
                borderRadius: 12,
                padding: "5px",
                border: "1px solid rgba(12, 8, 8, 0.2)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                height: 80,
                width: 75,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
            onClick={() => (
                setShowApp2(),
                setObjs([])
                )
            }
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(200, 200, 200, 0.25)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            >
                <h2 className='navbar'>Reset</h2>
            </div>

            
            <div style={{
                top: 3.5,
                right: 164,
                position: 'fixed',
                borderRadius: 12,
                padding: "5px",
                border: "1px solid rgba(12, 8, 8, 0.2)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                height: 80,
                width: 75,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
            onClick={() => {
                setHallenSave(prev => {
                    const newObj = {
                    id: Date.now(),
                    breite,
                    höhe,
                    länge,
                    dachArt: (dachSelection === "" ? "satteldach" : dachSelection),
                    hallenArt: (hallenartSelection === "" ? "industrie" : hallenartSelection),
                    objs: Array.isArray(objs) ? objs.map(o => ({ ...o })) : [],
                    name: ""
                    };
                    return [...prev, newObj];
                });

                setTimeout(() => {
                    setShowApp3();
                    setHallenId(prev => Number(prev) + 1);
                }, 100);
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(200, 200, 200, 0.25)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            >

                <h2 className='navbar'>Save</h2>
            </div>
            

            <img 
            // src="/StartpunktDigitalLogo.png" 
            src='/LogoPerthel.png'
            alt="Logo"
            style={{ width: 200, zIndex: 1000 }} 
            />
        </div>
        

        <Canvas 
        camera={{position: [0,30,50]}} 
        className='canvasOverlay'
        // style={{backgroundImage: "url(/himmel.jpg)", backgroundSize: "cover", backgroundPosition: "center"}}
        >
            <directionalLight position={[5,5,5]} intensity={1} />
            <ambientLight intensity={0.9} />

            
            <Halle 
            bodenLänge={länge*2.5} // +17
            bodenBreite={breite*2.5} // +15
            gebäudeHöhe={höhe*2.5} // +3
            koordinate={koordinate}
            setTürAttribute={setTürAttribute}
            setSelectedObject={setSelectedObject}
            objs={objs}
            flach={dachSelection === "flachdach" ? true : false}
            originalBreite={breite}
            setEditMenü={setEditMenü}
            editMenü={editMenü}

            kantenAnzeigen={kantenAnzeigen}
            oberflächenAnzeigen={oberflächenAnzeigen}
            abmessungenAnzeigen={abmessungenAnzeigen}
            plattenAnzeigen={plattenAnzeigen}
            massivwändeAnzeigen={massivwändeAnzeigen}
            rahmenAnzeigen={rahmenAnzeigen}
            pfettenAnzeigen={pfettenAnzeigen}
            wandriegelAnzeigen={wandriegelAnzeigen}
            kantteileAnzeigen={kantteileAnzeigen}
            bodenplatteAnzeigen={bodenplatteAnzeigen}

            dachArt={dachArt}
            diffTraufFirst={diffTraufFirst}
            pultdachHöheDifferenz={dachneigung}
            sockelhöhe={sockelhöhe}
            wandGeometrieVorgaben={wandGeometrieVorgaben}
            außenFarbe={außenFarbe}
            />
            

            {/* <OrbitControls /> */}
        </Canvas>

        <div style={{
            position: "fixed",
            top: 120,
            right: 20,
            background: "rgba(255, 255, 255, 0.15)", // halbtransparent
            backdropFilter: "blur(10px)",             // Blur-Effekt
            WebkitBackdropFilter: "blur(10px)",       // Safari-Support
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // etwas stärkerer Schatten
            color: "#000000ff",                            // besserer Kontrast
            width: 360,
            height: türAttribute ? 250 : 250, // 500 : 250
            border: "1px solid rgba(255, 255, 255, 0.2)", // dezenter Rand
            zIndex: 999,
            visibility: türAttribute ? "inherit" : "hidden"
        }}>
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                // Hier wieder sichtbar machen
                visibility: türAttribute ? "hidden" : "hidden"
            }}>
                <SliderMui
                    title={"Länge"} 
                    multiplier={3} 
                    value={länge} 
                    onChange={setLänge}
                    min={22}
                    max={40}
                />

                <SliderMui 
                    title={"Breite"} 
                    multiplier={4} 
                    value={breite} 
                    onChange={setBreite}
                    min={18}
                    max={25} 
                />

                <SliderMui 
                    title={"Höhe"} 
                    multiplier={5} 
                    value={höhe} 
                    onChange={setHöhe}
                    min={7}
                    max={20} 
                />
            </div>

        {türAttribute && (
            <>
                {console.log(selectedObject)}
                <ButtonMui multiplier={2} title={"Löschen"} onClick={() => deleteObj(selectedObject.id)} />
                
                <SliderMui 
                title={"Objekt Breite"}
                multiplier={0}
                value={selectedObject.value[0]}
                onChange={newValue => handleOnChange(0, newValue)}
                min={2}
                max={selectedObject.type === "lüfter" ? 5 : (selectedObject.type === "tür" ? breite+10 : breite+5)}
                />

                <SliderMui 
                title={"Objekt Höhe"}
                multiplier={1}
                value={selectedObject.value[1]}
                onChange={newValue => handleOnChange(1, newValue)}
                min={3}
                max={Math.round((selectedObject.type === "lüfter" ? 5 : (selectedObject.type === "tür" ? höhe-2 : breite+2)))}
                />
            </>
        )}
        </div>

        {/* Ui Innen */}
        
        <Add
        addObj={addObj} 
        editMenü={editMenü} 
        setEditMenü={setEditMenü}
        breite={breite}
        setBreite={setBreite}
        länge={länge}
        setLänge={setLänge}
        höhe={höhe}
        setHöhe={setHöhe}
        dachArt={dachArt}
        setDachArt={setDachArt}
        traufhöhe={traufhöhe}
        setTraufhöhe={setTraufhöhe}
        dachneigung={dachneigung}
        setDachneigung={setDachneigung}
        sockelhöhe={sockelhöhe}
        setSockelhöhe={setSockelhöhe}
        dachAusrichtung={dachAusrichtung}
        setDachAusrichtung={setDachAusrichtung}
        diffTraufFirst={diffTraufFirst}
        setDiffTraufFirst={setDiffTraufFirst}
        wandGeometrieVorgaben={wandGeometrieVorgaben}
        setWandGeometrieVorgaben={setWandGeometrieVorgaben}
        isolierung={isolierung}
        setIsolierung={setIsolierung}
        paneeltyp={paneeltyp}
        setPaneeltyp={setPaneeltyp}
        wandOrientierung={wandOrientierung}
        setWandOrientierung={setWandOrientierung}
        farbSchema={farbSchema}
        setFarbSchema={setFarbSchema}
        außenFarbe={außenFarbe}
        setAußenFarbe={setAußenFarbe}
        außenFarbeMuster={außenFarbeMuster}
        setAußenFarbeMuster={setAußenFarbeMuster}
        musterVerortung={musterVerortung}
        setMusterVerortung={setMusterVerortung}
        dachIsolierung={dachIsolierung}
        setDachIsolierung={setDachIsolierung}
        dachPaneeltyp={dachPaneeltyp}
        setDachPaneeltyp={setDachPaneeltyp}
        dachAußenFarbe={dachAußenFarbe}
        setDachAußenFarbe={setDachAußenFarbe}
        dachPvcName={dachPvcName}
        setDachPvcName={setDachPvcName}
        pvcName={pvcName}
        setPvcName={setPvcName}
        fensterFarbe={fensterFarbe}
        setFensterFarbe={setFensterFarbe}
        türFarbe={türFarbe}
        setTürFarbe={setTürFarbe}
        schiebeTorFarbe={schiebeTorFarbe}
        setSchiebeTorFarbe={setSchiebeTorFarbe}
        rollTorFarbe={rollTorFarbe}
        setRollTorFarbe={setRollTorFarbe}
        sektionalTorFarbe={sektionalTorFarbe}
        setSektionalTorFarbe={setSektionalTorFarbe}
        türFarbeInnen={türFarbeInnen}
        setTürFarbeInnen={setTürFarbeInnen}
        sektionalTorFarbeInnen={sektionalTorFarbeInnen}
        setSektionalTorFarbeInnen={setSektionalTorFarbeInnen}
        gebäudeZweck={gebäudeZweck}
        setGebäudeZweck={setGebäudeZweck}
        bauBeginn={bauBeginn}
        setBauBeginn={setBauBeginn}
        anwerbungKunden={anwerbungKunden}
        setAnwerbungKunden={setAnwerbungKunden}
        größeGebäudeM2={größeGebäudeM2}
        setGrößeGebäudeM2={setGrößeGebäudeM2}
        bodenplatteFarbe={bodenplatteFarbe}
        setBodenplatteFarbe={setBodenplatteFarbe}
        rahmenFarbe={rahmenFarbe}
        setRahmenFarbe={setRahmenFarbe}
        sekundärKonstruktionsFarbe={sekundärKonstruktionsFarbe}
        setSekundärKonstruktionsFarbe={setSekundärKonstruktionsFarbe}
        sekundärHolzKonstruktionsFarbe={sekundärHolzKonstruktionsFarbe}
        setSekundärHolzKonstruktionsFarbe={setSekundärHolzKonstruktionsFarbe}
        zubehörFarbe={zubehörFarbe}
        setZubehörFarbe={setZubehörFarbe}
        kantenFarbe={kantenFarbe}
        setKantenFarbe={setKantenFarbe}
        kranKapazität={kranKapazität}
        setKranKapazität={setKranKapazität}
        abmessungenAnzeigen={abmessungenAnzeigen}
        setAbmessungenAnzeigen={setAbmessungenAnzeigen}
        />

        <DarstellungUI
            editMenü={editMenü}
            setEditMenü={setEditMenü}
            kantenAnzeigen={kantenAnzeigen}
            setKantenAnzeigen={setKantenAnzeigen}
            oberflächenAnzeigen={oberflächenAnzeigen}
            setOberflächenAnzeigen={setOberflächenAnzeigen}
            abmessungenAnzeigen={abmessungenAnzeigen}
            setAbmessungenAnzeigen={setAbmessungenAnzeigen}
            plattenAnzeigen={plattenAnzeigen}
            setPlattenAnzeigen={setPlattenAnzeigen}
            massivwändeAnzeigen={massivwändeAnzeigen}
            setMassivwändeAnzeigen={setMassivwändeAnzeigen}
            öffnungenAnzeigen={öffnungenAnzeigen}
            setÖffnungenAnzeigen={setÖffnungenAnzeigen}
            rahmenAnzeigen={rahmenAnzeigen}
            setRahmenAnzeigen={setRahmenAnzeigen}
            pfettenAnzeigen={pfettenAnzeigen}
            setPfettenAnzeigen={setPfettenAnzeigen}
            wandriegelAnzeigen={wandriegelAnzeigen}
            setWandriegelAnzeigen={setWandriegelAnzeigen}
            kantteileAnzeigen={kantteileAnzeigen}
            setKantteileAnzeigen={setKantteileAnzeigen}
            zubehörAnzeigen={zubehörAnzeigen}
            setZubehörAnzeigen={setZubehörAnzeigen}
            bodenplatteAnzeigen={bodenplatteAnzeigen}
            setBodenplatteAnzeigen={setBodenplatteAnzeigen}
            volumenAnzeigen={volumenAnzeigen}
            setVolumenAnzeigen={setVolumenAnzeigen}
            straßenAnzeigen={straßenAnzeigen}
            setStraßenAnzeigen={setStraßenAnzeigen}
            strukturelleKomponentenAnzeigen={strukturelleKomponentenAnzeigen}
            setStrukturelleKomponentenAnzeigen={setStrukturelleKomponentenAnzeigen}
            dekorationenAnzeigen={dekorationenAnzeigen}
            setDekorationenAnzeigen={setDekorationenAnzeigen}
            gebäudeformAnzeigen={gebäudeformAnzeigen}
            setGebäudeformAnzeigen={setGebäudeformAnzeigen}
            anschleppungenAnzeigen={anschleppungenAnzeigen}
            setAnschleppungenAnzeigen={setAnschleppungenAnzeigen}
            sekundärstrukturAnzeigen={sekundärstrukturAnzeigen}
            setSekundärstrukturAnzeigen={setSekundärstrukturAnzeigen}
            kreuzverbändeAnzeigen={kreuzverbändeAnzeigen}
            setKreuzverbändeAnzeigen={setKreuzverbändeAnzeigen}
        />
        

        </>
    )
}