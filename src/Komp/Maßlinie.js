import { Text } from "@react-three/drei"
import { useMemo } from "react"


export default function MaßLinie({ start, end, offset = 0, label, color = "#000000", koordinate, labelOffset = [0, 0, 0] }) {
    const points = useMemo(() => {
        const direction = [end[0] - start[0], end[1] - start[1], end[2] - start[2]]
        const length = Math.sqrt(direction[0] ** 2 + direction[1] ** 2 + direction[2] ** 2)
        
        // Normalisiere die Richtung
        const normalizedDir = direction.map(d => d / length)
        
        // Senkrechte Richtung für Offset
        const perpendicular = [-normalizedDir[2], normalizedDir[1], normalizedDir[0]]
        
        // Punkte mit Offset
        const offsetStart = [
            start[0] + perpendicular[0] * offset,
            start[1] + perpendicular[1] * offset,
            start[2] + perpendicular[2] * offset
        ]
        const offsetEnd = [
            end[0] + perpendicular[0] * offset,
            end[1] + perpendicular[1] * offset,
            end[2] + perpendicular[2] * offset
        ]
        
        // Prüfe ob die Linie in X-Richtung (lang) oder Z-Richtung (kurz) verläuft
        const isXDirection = Math.abs(direction[0]) > Math.abs(direction[2])
        
        return { 
            offsetStart, 
            offsetEnd, 
            isXDirection,
            midpoint: [
                (offsetStart[0] + offsetEnd[0]) / 2,
                (offsetStart[1] + offsetEnd[1]) / 2,
                (offsetStart[2] + offsetEnd[2]) / 2
            ]
        }
    }, [start, end, offset])

    return (
        <group position={koordinate}>
            {/* Hauptlinie */}
            <line>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={2}
                        array={new Float32Array([...points.offsetStart, ...points.offsetEnd])}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial color={color} linewidth={2} />
            </line>

            {/* Endmarkierung links */}
            <mesh position={points.offsetStart} rotation={[Math.PI / 2, 0, points.isXDirection ? Math.PI / 2 : 0]}>
                <boxGeometry args={[2, 0.2, 0.2]} />
                <meshBasicMaterial color={color} />
            </mesh>

            {/* Endmarkierung rechts */}
            <mesh position={points.offsetEnd} rotation={[Math.PI / 2, 0, points.isXDirection ? Math.PI / 2 : 0]}>
                <boxGeometry args={[2, 0.2, 0.2]} />
                <meshBasicMaterial color={color} />
            </mesh>

            {/* Text Label */}
            <group position={[0+labelOffset[0], 0+labelOffset[1], -1+labelOffset[2]]}>
                <Text
                    position={[points.midpoint[0], 0.2, points.midpoint[2]]}
                    fontSize={1.8}
                    color={color}
                    anchorX="center"
                    anchorY="middle"
                    rotation={[-Math.PI / 2, 0, points.isXDirection ? 0 : -Math.PI / 2]}
                >
                    {label}
                </Text>
            </group>
        </group>
    )
}