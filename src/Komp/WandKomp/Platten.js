

import * as THREE from 'three'

export default function Platten({
    fragBreite,
    position,
    key,
    sockelHöhe,
    lang,
    gebäudeHöhe,
    oberflächenAnzeigen = true,
    plattenAnzeigen = true,
    kantenAnzeigen = true,
    color = 'white'
}) {

    if (!plattenAnzeigen) return null;

    return(
        <>
            {lang === true && (
                <group key={key}>
                    {oberflächenAnzeigen && (
                        <mesh position={position}>
                            <boxGeometry args={[fragBreite, gebäudeHöhe, 0.4]} />
                            <meshStandardMaterial color={color} />
                        </mesh>
                    )}
                    {kantenAnzeigen && (
                        <lineSegments position={position}>
                            <edgesGeometry args={[new THREE.BoxGeometry(fragBreite, gebäudeHöhe, 0.4)]} />
                            <lineBasicMaterial color="black" />
                        </lineSegments>
                    )}
                </group>
            )}
            {lang === false && (
                <group key={key}>
                    {oberflächenAnzeigen && (
                        <mesh position={position}>
                            <boxGeometry args={[0.4, gebäudeHöhe, fragBreite]} />
                            <meshStandardMaterial color={color} />
                        </mesh>
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