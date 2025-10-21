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

export default function App({ setShowApp, appSequence }) {

    const [bodenLänge, setBodenLänge] = useState(40) // max 40
    const [bodenBreite, setBodenBreite] = useState(25) // max 25
    const [gebäudeHöhe, setGebäudeHöhe] = useState(15)
    
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
            width: 380,
            height: 50,
            border: "1px solid rgba(255, 255, 255, 0.2)", // dezenter Rand
            zIndex: 999,
            borderRadius: 12
        }}>
            <div 
            style={{
                top: 3.5,
                right: 89,
                position: 'fixed',
                borderRadius: 12,
                padding: "5px",
                border: "1px solid rgba(12, 8, 8, 0.2)",
            }}
            onClick={() => setShowApp(false)}
            >
                <h2 className='navbar'>Home</h2>
            </div>

            <div style={{
                top: 3.5,
                right: 10,
                position: 'fixed',
                borderRadius: 12,
                padding: "5px",
                border: "1px solid rgba(12, 8, 8, 0.2)",
            }}
            onClick={() => console.log("Reset")}>
                <h2 className='navbar'>Reset</h2>
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
            bodenLänge={bodenLänge}
            bodenBreite={bodenBreite}
            gebäudeHöhe={gebäudeHöhe}
            koordinate={koordinate}
            setTürAttribute={setTürAttribute}
            setSelectedObject={setSelectedObject}
            objs={objs}
            />
            

            {/* <OrbitControls /> */}
        </Canvas>

        <div style={{
            position: "fixed",
            top: 20,
            left: 20,
            background: "rgba(255, 255, 255, 0.15)", // halbtransparent
            backdropFilter: "blur(10px)",             // Blur-Effekt
            WebkitBackdropFilter: "blur(10px)",       // Safari-Support
            padding: 18,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // etwas stärkerer Schatten
            color: "#000000ff",                            // besserer Kontrast
            width: 320,
            height: türAttribute ? 500 : 240,
            border: "1px solid rgba(255, 255, 255, 0.2)", // dezenter Rand
            zIndex: 999
        }}>
            <SliderMui 
                title={"Länge"} 
                multiplier={0} 
                value={bodenLänge} 
                onChange={setBodenLänge}
                min={22}
                max={40}
            />

            <SliderMui 
                title={"Breite"} 
                multiplier={1} 
                value={bodenBreite} 
                onChange={setBodenBreite}
                min={18}
                max={25} 
            />

            <SliderMui 
                title={"Höhe"} 
                multiplier={2} 
                value={gebäudeHöhe} 
                onChange={setGebäudeHöhe}
                min={7}
                max={20} 
            />

        {türAttribute && (
            <>
                {console.log(selectedObject)}
                <ButtonMui multiplier={7} title={"Löschen"} onClick={() => deleteObj(selectedObject.id)} />
                
                <SliderMui 
                title={"Objekt Breite"}
                multiplier={4}
                value={selectedObject.value[0]}
                onChange={newValue => handleOnChange(0, newValue)}
                min={2}
                max={selectedObject.type === "lüfter" ? 7 : bodenBreite-4}
                />

                <SliderMui 
                title={"Objekt Höhe"}
                multiplier={5}
                value={selectedObject.value[1]}
                onChange={newValue => handleOnChange(1, newValue)}
                min={2}
                max={(selectedObject.type === "lüfter" ? 7 : (selectedObject.type === "tür" ? gebäudeHöhe-2 : bodenBreite/1.5))}
                />
            </>
        )}
        </div>


        <Add addObj={addObj} />

        </>
    )
}