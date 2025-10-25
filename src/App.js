import { Canvas } from '@react-three/fiber'
import "./styles.css"
import Halle from './Halle'
import SliderMui from "./Komp/SliderMui"
import { useState } from 'react'
import LoadingPage from "./LoadingPage";
import Add from './Komp/Add'
import { useEffect } from 'react'
import ButtonMui from './Komp/ButtonMui'
import CustomPage from './CustomPage'

export default function App({ 
    setShowApp, 
    setShowApp2, 
    appSequence, 
    flach,
    länge,
    setLänge,
    breite,
    setBreite,
    höhe,
    setHöhe
 }) {

    /*
    const [bodenLänge, setBodenLänge] = useState(40) // max 40
    const [bodenBreite, setBodenBreite] = useState(25) // max 25
    const [gebäudeHöhe, setGebäudeHöhe] = useState(15)
    */
    
    const [koordinate, setKoordinate] = useState([0,0,0])

    const [türAttribute, setTürAttribute] = useState(false)
    const [selectedObject, setSelectedObject] = useState(null)

    const [objs, setObjs] = useState([
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
    ])

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
            width: 400,
            height: 90,
            border: "1px solid rgba(255, 255, 255, 0.2)", // dezenter Rand
            zIndex: 999,
            borderRadius: 12
        }}>
            <div 
            style={{
                top: 3.5,
                right: 84,
                position: 'fixed',
                borderRadius: 12,
                padding: "5px",
                border: "1px solid rgba(59, 44, 44, 0.2)",
                height: 80,
                marginLeft: 20,
                color: "rgba(66, 39, 39, 0.2)"
            }}
            onClick={setShowApp}
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
                height: 80,
                width: 75,
                textAlign: 'center'
            }}
            onClick={setShowApp2}>
                <h2 className='navbar'>Edit</h2>
            </div>

            <img 
            src="/StartpunktDigitalLogo.png" 
            alt="Logo"
            style={{ width: 200, zIndex: 1000, }} 
            />
        </div>
        

        <Canvas camera={{position: [0,30,-50]}} className='canvasOverlay'>
            <directionalLight position={[5,5,5]} intensity={1} />
            <ambientLight intensity={0.6} />

            
            <Halle 
            bodenLänge={länge+17}
            bodenBreite={breite+15}
            gebäudeHöhe={höhe+3}
            koordinate={koordinate}
            setTürAttribute={setTürAttribute}
            setSelectedObject={setSelectedObject}
            objs={objs}
            flach={flach}
            />
            

            {/* <OrbitControls /> */}
        </Canvas>

        <div style={{
            position: "fixed",
            top: 15,
            left: 15,
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
                max={selectedObject.type === "lüfter" ? breite : breite+5}
                />

                <SliderMui 
                title={"Objekt Höhe"}
                multiplier={1}
                value={selectedObject.value[1]}
                onChange={newValue => handleOnChange(1, newValue)}
                min={3}
                max={Math.round((selectedObject.type === "lüfter" ? 7 : (selectedObject.type === "tür" ? höhe-2 : breite/1.5)))}
                />
            </>
        )}
        </div>


        <Add addObj={addObj} />

        </>
    )
}