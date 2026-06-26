import './styles.css'

export default function MobileBlockScreen() {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px'
            }}
        >
            <div
                style={{
                    width: 'min(560px, 100%)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: 16,
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.16)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    padding: '24px',
                    textAlign: 'center'
                }}
            >
                <img
                    src="/LogoPerthel.png"
                    alt="Logo"
                    style={{ width: 140, marginBottom: 16 }}
                />
                <p className="text" style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
                    Desktop empfohlen
                </p>
                <p className="text" style={{ fontSize: 16, fontWeight: 400, marginBottom: 10 }}>
                    Der Hallenkonfigurator ist für größere Bildschirme optimiert.
                </p>
                <p className="text" style={{ fontSize: 15, fontWeight: 400, opacity: 0.8 }}>
                    Bitte öffne ihn auf einem Laptop oder Desktop mit mindestens 768px Breite.
                </p>
            </div>
        </div>
    )
}
