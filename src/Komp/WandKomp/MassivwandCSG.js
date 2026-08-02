import { memo } from 'react'
import * as THREE from 'three'
import { Geometry, Base, Subtraction } from '@react-three/csg'

function haveEqualNumberArrays(left = [], right = []) {
    if (left === right) return true
    if (left.length !== right.length) return false

    for (let index = 0; index < left.length; index++) {
        if (left[index] !== right[index]) {
            return false
        }
    }

    return true
}

function haveEqualOpenings(left = [], right = []) {
    if (left === right) return true
    if (left.length !== right.length) return false

    for (let index = 0; index < left.length; index++) {
        const currentLeft = left[index]
        const currentRight = right[index]

        if (currentLeft?.id !== currentRight?.id) return false
        if (!haveEqualNumberArrays(currentLeft?.position ?? [], currentRight?.position ?? [])) return false
        if (!haveEqualNumberArrays(currentLeft?.size ?? [], currentRight?.size ?? [])) return false
    }

    return true
}

function MassivwandCSG({
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

export default memo(MassivwandCSG, (prevProps, nextProps) => {
    return prevProps.position?.[0] === nextProps.position?.[0]
        && prevProps.position?.[1] === nextProps.position?.[1]
        && prevProps.position?.[2] === nextProps.position?.[2]
        && prevProps.size?.[0] === nextProps.size?.[0]
        && prevProps.size?.[1] === nextProps.size?.[1]
        && prevProps.size?.[2] === nextProps.size?.[2]
        && prevProps.farbe === nextProps.farbe
        && prevProps.oberflächenAnzeigen === nextProps.oberflächenAnzeigen
        && prevProps.kantenAnzeigen === nextProps.kantenAnzeigen
        && haveEqualOpenings(prevProps.öffnungen, nextProps.öffnungen)
})
