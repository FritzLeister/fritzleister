

export default function DarstellungsButton({ label, state, setState, onClick }) {

    return(
        <>
            <div 
                style={{
                    background: state ? "rgba(159, 173, 206, 0.3)" : "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    padding: 20,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    color: "#000000ff",
                    width: 130,
                    height: 40,
                    border: state ? "1px solid rgba(40, 89, 197, 0.3)" : "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',

                }}
                onClick={() => {
                    if (setState) {
                        setState(prev => !prev)
                    }
                    if (onClick && typeof onClick === 'function') {
                        onClick()
                    }
                }}
            >
                <span className='text' style={{ fontWeight: 200 }}>{label}</span>
            </div>
        </>
    )
}