import '../styles.css';

export default function UiButton({ name, icon, onClick, isActive }) {

    const getBackgroundColor = () => {
        if (name === 'Angebot') {
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
                cursor: 'pointer',
                backgroundColor: getBackgroundColor(),
                transition: 'background-color 0.2s ease',
            }}
            onClick={onClick}
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