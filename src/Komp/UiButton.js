import '../styles.css';

export default function UiButton({ name, icon, onClick, isActive, disabled = false }) {

    const tooltipByName = {
        Abmessungen: 'Geometrie der Halle anpassen: Breite, Länge, Traufhöhe und Dachparameter.',
        Felder: 'Segment- und Rasteransicht zur strukturellen Aufteilung der Hallenseiten.',
        Verkleidung: 'Paneelaufbau, Materiallogik und Farbschema der Hülle einstellen.',
        'Öffnungen': 'Fenster, Tore und Dachöffnungen hinzufügen und bearbeiten.',
        Konstruktion: 'Farben und Sichtbarkeit der tragenden Konstruktion konfigurieren.',
        Angebot: 'Konfiguration für Anfrageabschluss und Übergabe vorbereiten.'
    }

    const getBackgroundColor = () => {
        if (name === 'Angebot') {
            if (disabled) {
                return 'rgba(220, 220, 220, 0.8)';
            }
            return isActive ? 'rgba(247, 241, 182, 0.8)' : 'rgba(252, 238, 79, 0.8)';
        }
        return isActive ? 'rgba(200, 200, 200, 0.3)' : undefined;
    };

    return(
        <>
            <div 
            style={{ 
                margin: '7px',
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                borderRadius: 12,
                cursor: disabled ? 'not-allowed' : 'pointer',
                backgroundColor: getBackgroundColor(),
                transition: 'background-color 0.2s ease',
                opacity: disabled ? 0.7 : 1,
                pointerEvents: disabled ? 'none' : 'auto'
            }}
            onClick={disabled ? undefined : onClick}
            title={disabled && name === 'Angebot'
                ? 'Nicht verfügbar: Überlappende Öffnungen vorhanden.'
                : (tooltipByName[name] ?? name)}
            >
                <div style={{margin: '5px'}}>
                    <div style={{
                        marginLeft: '5px'
                    }}>
                        {icon}
                        <p className='text'>
                            {name}
                        </p>
                    </div>
                </div>
            
            </div>
        </>
    )
}