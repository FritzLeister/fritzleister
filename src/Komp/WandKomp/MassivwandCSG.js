import * as THREE from 'three'
import { Geometry, Base, Subtraction } from '@react-three/csg'

export default function MassivwandCSG({
    position,
    size,
    öffnungen = [],
    farbe = 'grey',
    oberflächenAnzeigen,
    kantenAnzeigen
}) {
    return (
        <>
            {oberflächenAnzeigen && (
                <mesh position={position}>
                    <Geometry>
                        <Base>
                            <boxGeometry args={size} />
                        </Base>
                        {öffnungen.map((öffnung) => (
                            <Subtraction
                                key={öffnung.id}
                                position={[
                                    öffnung.position[0] - position[0],
                                    öffnung.position[1] - position[1],
                                    öffnung.position[2] - position[2]
                                ]}
                            >
                                <boxGeometry args={öffnung.size} />
                            </Subtraction>
                        ))}
                    </Geometry>
                    <meshStandardMaterial color={farbe} />
                </mesh>
            )}

            {kantenAnzeigen && (
                <lineSegments position={position}>
                    <edgesGeometry args={[new THREE.BoxGeometry(size[0], size[1], size[2])]} />
                    <lineBasicMaterial color="black" />
                </lineSegments>
            )}
        </>
    )
}
