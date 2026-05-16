import { useRef } from 'react'

// Reflektor-Komponente für Wandfenster und andere Öffnungen
export default function Reflektor({
    position = [0, 0, 0],
    breite = 1,
    höhe = 0.8,
    farbe = 0xffffff,
    rotation = [0,0,0],
    lang
}) {
    const groupRef = useRef()

    return (
        <group 
        ref={groupRef} 
        position={position} 
        // rotation={[0, rotation, 0]}
        rotation={rotation}
        >

            {/* Halterung auf der linken Seite */}
            <mesh position={[0, höhe / 2 - 0.1, 0-0.1]}>
                <boxGeometry args={[0.4, höhe * 0.4, 0.3]} />
                <meshStandardMaterial color={farbe} metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Innerer Teil der Halterung */}
            <mesh position={[0, höhe / 2 - 0.09, -0.3]}>
                <boxGeometry args={[0.5, höhe * 0.55, 0.15]} />
                <meshStandardMaterial color={farbe} metalness={0.5} roughness={0.5} />
            </mesh>

            <group position={[0, 0.1, 0]} rotation={[Math.PI /15, 0, 0]}>
                {/* Hauptreflektor-Fläche */}
                <mesh position={[0, 0, 0.058]}>
                    <boxGeometry args={[breite, höhe, 0.02]} />
                    <meshStandardMaterial 
                        color={farbe === 0x111111 ? 0xaaaaaa : farbe}
                        metalness={0.8} 
                        roughness={0.2}
                    />
                </mesh>

                {/* Rand des Reflektors */}
                <mesh position={[0, 0, 0.06]}>
                    <boxGeometry args={[breite + 0.1, höhe + 0.1, 0.01]} />
                    <meshStandardMaterial color={farbe} metalness={0.4} roughness={0.6} />
                </mesh>
            </group>
        </group>
    )
}
