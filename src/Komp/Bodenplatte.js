import * as THREE from 'three'
import { useEffect, useMemo } from 'react'

export default function Bodenplatte({ bodenLänge, bodenBreite, koordinate, color = 'white' }) {

    const boxGeometry = useMemo(() => {
        return new THREE.BoxGeometry(bodenLänge + 3.5, 0.4, bodenBreite + 3.5)
    }, [bodenLänge, bodenBreite])

    const edgesGeometry = useMemo(() => {
        return new THREE.EdgesGeometry(boxGeometry)
    }, [boxGeometry])

    const surfaceMaterial = useMemo(() => {
        return new THREE.MeshStandardMaterial({ color })
    }, [color])

    const lineMaterial = useMemo(() => {
        return new THREE.LineBasicMaterial({ color: 'black' })
    }, [])

    useEffect(() => {
        return () => {
            boxGeometry.dispose()
            edgesGeometry.dispose()
            surfaceMaterial.dispose()
            lineMaterial.dispose()
        }
    }, [boxGeometry, edgesGeometry, surfaceMaterial, lineMaterial])

    return(
        <>
            <mesh position={[koordinate[0], koordinate[1], koordinate[2]]} geometry={boxGeometry} material={surfaceMaterial} />
            <lineSegments position={[koordinate[0], koordinate[1], koordinate[2]]} geometry={edgesGeometry} material={lineMaterial} />
        </>
    )
}