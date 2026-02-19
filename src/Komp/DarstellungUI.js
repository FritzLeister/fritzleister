import DarstellungsButton from "./DarstellungsButton";
import { useMemo } from "react";

export default function DarstellungUI({ 
    editMenü, 
    setEditMenü,
    kantenAnzeigen,
    setKantenAnzeigen,
    oberflächenAnzeigen,
    setOberflächenAnzeigen,
    abmessungenAnzeigen,
    setAbmessungenAnzeigen,
    plattenAnzeigen,
    setPlattenAnzeigen,
    massivwändeAnzeigen,
    setMassivwändeAnzeigen,
    öffnungenAnzeigen,
    setÖffnungenAnzeigen,
    rahmenAnzeigen,
    setRahmenAnzeigen,
    pfettenAnzeigen,
    setPfettenAnzeigen,
    wandriegelAnzeigen,
    setWandriegelAnzeigen,
    kantteileAnzeigen,
    setKantteileAnzeigen,
    zubehörAnzeigen,
    setZubehörAnzeigen,
    bodenplatteAnzeigen,
    setBodenplatteAnzeigen,
    volumenAnzeigen,
    setVolumenAnzeigen,
    straßenAnzeigen,
    setStraßenAnzeigen,
    strukturelleKomponentenAnzeigen,
    setStrukturelleKomponentenAnzeigen,
    dekorationenAnzeigen,
    setDekorationenAnzeigen,
    gebäudeformAnzeigen,
    setGebäudeformAnzeigen,
    anschleppungenAnzeigen,
    setAnschleppungenAnzeigen,
    sekundärstrukturAnzeigen,
    setSekundärstrukturAnzeigen,
    kreuzverbändeAnzeigen,
    setKreuzverbändeAnzeigen
}) {

    // Bestimme welche Buttons angezeigt werden basierend auf editMenü - mit useMemo
    const showButton = useMemo(() => {
        const showInMenus = {
            'Abmessungen': ['Abmessungen', 'Gebäudeform', 'Öffnungen', 'Anschleppungen', 'Bodenplatte', 'Volumen', 'Straßen', 'Strukturelle Komponenten', 'Dekorationen'],
            'Felder': ['Abmessungen', 'Gebäudeform', 'Öffnungen', 'Anschleppungen', 'Bodenplatte', 'Volumen', 'Straßen', 'Strukturelle Komponenten', 'Dekorationen'],
            'Verkleidung': ['Abmessungen', 'Platten', 'Massivwände', 'Öffnungen', 'Sekundärstruktur', 'Bodenplatte'],
            'Öffnungen': ['Abmessungen', 'Platten', 'Massivwände', 'Öffnungen', 'Sekundärstruktur', 'Bodenplatte'],
            'Öffnungen-Auswahl': ['Abmessungen', 'Platten', 'Massivwände', 'Öffnungen', 'Sekundärstruktur', 'Bodenplatte'],
            'Öffnungen-Dach-Auswahl': ['Abmessungen', 'Platten', 'Massivwände', 'Öffnungen', 'Sekundärstruktur', 'Bodenplatte'],
            'Öffnungen-Wand-Fenster': ['Abmessungen', 'Platten', 'Massivwände', 'Öffnungen', 'Sekundärstruktur', 'Bodenplatte'],
            'Zubehör': ['Abmessungen', 'Platten', 'Massivwände', 'Öffnungen', 'Sekundärstruktur', 'Kantteile', 'Zubehör', 'Bodenplatte', 'Volumen', 'Straßen', 'Strukturelle Komponenten', 'Dekorationen'],
            'LeerÖffnung-Bearbeiten': ['Abmessungen', 'Platten', 'Massivwände', 'Öffnungen', 'Sekundärstruktur', 'Bodenplatte'],
            'Fenster-Bearbeiten': ['Abmessungen', 'Platten', 'Massivwände', 'Öffnungen', 'Sekundärstruktur', 'Bodenplatte'],
            'Tür-Bearbeiten': ['Abmessungen', 'Platten', 'Massivwände', 'Öffnungen', 'Sekundärstruktur', 'Bodenplatte'],
            'Sektionaltor-Bearbeiten': ['Abmessungen', 'Platten', 'Massivwände', 'Öffnungen', 'Sekundärstruktur', 'Bodenplatte'],
            'Schiebetür-Bearbeiten': ['Abmessungen', 'Platten', 'Massivwände', 'Öffnungen', 'Sekundärstruktur', 'Bodenplatte'],
            'Konstruktion': ['Abmessungen', 'Öffnungen', 'Rahmen', 'Kreuzverbände', 'Pfetten', 'Wandriegel', 'Bodenplatte'],
            'Angebot': ['Abmessungen', 'Platten', 'Massivwände', 'Öffnungen', 'Rahmen', 'Pfetten', 'Wandriegel', 'Kantteile', 'Zubehör', 'Bodenplatte', 'Volumen', 'Straßen', 'Strukturelle Komponenten', 'Dekorationen'],
        };

        const currentMenu = editMenü || 'Angebot';
        
        return (buttonName) => {
            return showInMenus[currentMenu]?.includes(buttonName) || false;
        };
    }, [editMenü]);

    // editMenü === 'Abmessungen'
        // Darstellung: Kanten, Oberflächen
        // Hauptelemente: Tasten, Abmessungen, Gebäudeform, Öffnungen, Anschleppungen, Bodenplatte, Volumen, Straßen, Strukturelle Komponenten, Dekorationen

    // editMenü === 'Verkleidung'
        // Darstellung: Kanten, Oberflächen
        // Hauptelemente: Tasten, Abmessungen, Platten, Massivwände, Öffnungen, Sekundärstruktur, Bodenplatte

    // editMenü === 'Öffnungen'
        // Darstellung: Kanten, Oberflächen
        // Hauptelemente: Tasten, Abmessungen, Platten, Massivwände, Öffnungen, Sekundärstruktur, Bodenplatte
    
    // editMenü === 'Zubehör'
        // Darstellung: Kanten, Oberflächen
        // Hauptelemente: Tasten, Abmessungen, Platten, Massivwände, Öffnungen,
            // Sekundärstruktur, Kantteile, Zubehör, Bodenplatte, Volumen, Straßen, Struktuelle Komponenten, Dekorationen
        
    // editMenü === 'Konstruktion'
        // Darstellung: Kanten, Oberflächen
        // Hauptelemente: Tasten, Abmessungen, Öffnungen, Rahmen, Kreuzverbände, Pfetten, Wandriegel, Bodenplatte

    // editMenü === 'Angebot'
        // Darstellung: Kanten, Oberflächen
        // Hauptelemente: Abmessungen, Platten, Massivwände, Öffnungen, Rahmen, Pfetten, Wandriegel, Kantteile, Zubehör, Bodenplatte,
            // Volumen, Straßen, Strukturelle Komponenten, Dekorationen

    return(
        <div style={{
            top: 120, 
            right: 20,
            position: "fixed",
            background: "rgba(255, 255, 255, 0.15)", // halbtransparent
            backdropFilter: "blur(10px)",             // Blur-Effekt
            WebkitBackdropFilter: "blur(10px)",       // Safari-Support
            padding: 18,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // etwas stärkerer Schatten
            color: "#000000ff",                            // besserer Kontrast
            width: 310,
            maxHeight: '80vh',
            overflowY: 'auto',
            border: "1px solid rgba(255, 255, 255, 0.2)", // dezenter Rand
            zIndex: 999,
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
        }}>

            {/* Darstellung */}
            <p className="text" style={{ marginTop: '0px' }}>Darstellung</p>

            <DarstellungsButton 
                label={'Kanten'}
                state={kantenAnzeigen}
                setState={setKantenAnzeigen}
            />

            <DarstellungsButton 
                label={'Oberflächen'}
                state={oberflächenAnzeigen}
                setState={setOberflächenAnzeigen}
            />

            {/* Hauptelemente */}
            <p className="text" style={{ marginTop: '10px' }}>Hauptelemente</p>
            
            <div 
                key={editMenü || 'default'}
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '5px',
                    justifyContent: 'center',
                    width: '100%',
                }}
            >
                {showButton('Abmessungen') && (
                    <DarstellungsButton 
                        label={'Abmessungen'}
                        state={abmessungenAnzeigen}
                        setState={setAbmessungenAnzeigen}
                    />
                )}

                {showButton('Platten') && (
                    <DarstellungsButton 
                        label={'Platten'}
                        state={plattenAnzeigen}
                        setState={setPlattenAnzeigen}
                    />
                )}

                {showButton('Massivwände') && (
                    <DarstellungsButton 
                        label={'Massivwände'}
                        state={massivwändeAnzeigen}
                        setState={setMassivwändeAnzeigen}
                    />
                )}

                {showButton('Öffnungen') && (
                    <DarstellungsButton 
                        label={'Öffnungen'}
                        state={öffnungenAnzeigen}
                        setState={setÖffnungenAnzeigen}
                    />
                )}

                {showButton('Rahmen') && (
                    <DarstellungsButton 
                        label={'Rahmen'}
                        state={rahmenAnzeigen}
                        setState={setRahmenAnzeigen}
                    />
                )}

                {showButton('Pfetten') && (
                    <DarstellungsButton 
                        label={'Pfetten'}
                        state={pfettenAnzeigen}
                        setState={setPfettenAnzeigen}
                    />
                )}

                {showButton('Wandriegel') && (
                    <DarstellungsButton 
                        label={'Wandriegel'}
                        state={wandriegelAnzeigen}
                        setState={setWandriegelAnzeigen}
                    />
                )}

                {showButton('Kantteile') && (
                    <DarstellungsButton 
                        label={'Kantteile'}
                        state={kantteileAnzeigen}
                        setState={setKantteileAnzeigen}
                    />
                )}

                {showButton('Zubehör') && (
                    <DarstellungsButton 
                        label={'Zubehör'}
                        state={zubehörAnzeigen}
                        setState={setZubehörAnzeigen}
                    />
                )}

                {showButton('Bodenplatte') && (
                    <DarstellungsButton 
                        label={'Bodenplatte'}
                        state={bodenplatteAnzeigen}
                        setState={setBodenplatteAnzeigen}
                    />
                )}

                {showButton('Volumen') && (
                    <DarstellungsButton 
                        label={'Volumen'}
                        state={volumenAnzeigen}
                        setState={setVolumenAnzeigen}
                    />
                )}

                {showButton('Straßen') && (
                    <DarstellungsButton 
                        label={'Straßen'}
                        state={straßenAnzeigen}
                        setState={setStraßenAnzeigen}
                    />
                )}

                {showButton('Strukturelle Komponenten') && (
                    <DarstellungsButton 
                        label={'Strukturelle Komponenten'}
                        state={strukturelleKomponentenAnzeigen}
                        setState={setStrukturelleKomponentenAnzeigen}
                    />
                )}

                {showButton('Dekorationen') && (
                    <DarstellungsButton 
                        label={'Dekorationen'}
                        state={dekorationenAnzeigen}
                        setState={setDekorationenAnzeigen}
                    />
                )}

                {showButton('Gebäudeform') && (
                    <DarstellungsButton 
                        label={'Gebäudeform'}
                        state={gebäudeformAnzeigen}
                        setState={setGebäudeformAnzeigen}
                    />
                )}

                {showButton('Anschleppungen') && (
                    <DarstellungsButton 
                        label={'Anschleppungen'}
                        state={anschleppungenAnzeigen}
                        setState={setAnschleppungenAnzeigen}
                    />
                )}


                {/* {showButton('Sekundärstruktur') && (
                    <DarstellungsButton 
                        label={'Sekundärstruktur'}
                        state={sekundärstrukturAnzeigen}
                        setState={setSekundärstrukturAnzeigen}
                    />
                )} */}

                {/* {showButton('Kreuzverbände') && (
                    <DarstellungsButton 
                        label={'Kreuzverbände'}
                        state={kreuzverbändeAnzeigen}
                        setState={setKreuzverbändeAnzeigen}
                    />
                )} */}

            </div>
        </div>
    )
}