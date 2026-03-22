

import * as THREE from 'three'
import { Geometry, Base, Subtraction } from '@react-three/csg'

export default function Platten({
    fragBreite,
    position,
    key,
    sockelHöhe,
    lang,
    gebäudeHöhe,
    öffnungen = [],
    oberflächenAnzeigen = true,
    plattenAnzeigen = true,
    kantenAnzeigen = true,
    color = 'white'
}) {

    if (!plattenAnzeigen) return null;

    const renderPlatteMitCSG = (größe) => {
        if (öffnungen.length === 0) {
            return (
                <mesh position={position}>
                    <boxGeometry args={größe} />
                    <meshStandardMaterial color={color} />
                </mesh>
            )
        }

        return (
            <>
            <mesh position={position}>
                <Geometry>
                    <Base>
                        <boxGeometry args={größe} />
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
                <meshStandardMaterial color={color} />
            </mesh>
            </>
        )
    }

    return(
        <>
            {lang === true && (
                <group key={key}>
                    {oberflächenAnzeigen && (
                        <>
                            {renderPlatteMitCSG([fragBreite, gebäudeHöhe, 0.4])}
                        </>
                    )}
                    {kantenAnzeigen && (
                        // <lineSegments position={position}>
                        //     <edgesGeometry args={[new THREE.BoxGeometry(fragBreite, gebÃ¤udeHÃ¶he, 0.4)]} />
                        //     <lineBasicMaterial color="black" />
                        // </lineSegments>
                        <></>
                    )}
                </group>
            )}
            {lang === false && (
                <group key={key}>
                    {oberflächenAnzeigen && (
                        <>
                            {renderPlatteMitCSG([0.4, gebäudeHöhe, fragBreite])}
                        </>
                    )}
                    {kantenAnzeigen && (
                        <lineSegments position={position}>
                            <edgesGeometry args={[new THREE.BoxGeometry(0.4, gebäudeHöhe, fragBreite)]} />
                            <lineBasicMaterial color="black" />
                        </lineSegments>
                    )}
                </group>
            )}
        </>
    )
}
