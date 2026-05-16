import * as THREE from 'three'
import { getVisibleBoxSegments } from '../openingUtils'
import { useCallback, useEffect, useMemo, useRef } from 'react'

export default function WandRiegel({
    x,
    y,
    z,
    bodenBreite,
    bodenLänge,
    gebäudeHöhe,
    stelzenAbstand = 10,
    zusatzHöheMitte = 5,
    dachArt = 'satteldach',
    pultdachHöheDifferenz = 5,
    riegelFaktor = 4,
    frame,
    oberfläche,
    openingVolumes = [],
    color = '#7d7d75'
}) {
    const boxGeometryCacheRef = useRef(new Map())
    const edgesGeometryCacheRef = useRef(new Map())

    const surfaceMaterial = useMemo(() => {
        return new THREE.MeshStandardMaterial({ color })
    }, [color])

    const lineMaterial = useMemo(() => {
        return new THREE.LineBasicMaterial({ color: 'black' })
    }, [])

    const getSizeKey = useCallback((size) => `${size[0]}|${size[1]}|${size[2]}`, [])

    const getBoxGeometry = useCallback((size) => {
        const key = getSizeKey(size)
        const cached = boxGeometryCacheRef.current.get(key)
        if (cached) return cached

        const geometry = new THREE.BoxGeometry(...size)
        boxGeometryCacheRef.current.set(key, geometry)
        return geometry
    }, [getSizeKey])

    const getEdgesGeometry = useCallback((size) => {
        const key = getSizeKey(size)
        const cached = edgesGeometryCacheRef.current.get(key)
        if (cached) return cached

        const geometry = new THREE.EdgesGeometry(getBoxGeometry(size))
        edgesGeometryCacheRef.current.set(key, geometry)
        return geometry
    }, [getBoxGeometry, getSizeKey])

    useEffect(() => {
        const boxGeometryCache = boxGeometryCacheRef.current
        const edgesGeometryCache = edgesGeometryCacheRef.current

        return () => {
            boxGeometryCache.forEach((geometry) => geometry.dispose())
            boxGeometryCache.clear()

            edgesGeometryCache.forEach((geometry) => geometry.dispose())
            edgesGeometryCache.clear()

            surfaceMaterial.dispose()
            lineMaterial.dispose()
        }
    }, [surfaceMaterial, lineMaterial])

    const renderClippedBox = (key, position, size, axis) => {
        const segments = getVisibleBoxSegments(position, size, openingVolumes, axis)

        return segments.map((segment, index) => (
            <group key={`${key}-${index}`}>
                {oberfläche && (
                    <mesh position={segment.position} geometry={getBoxGeometry(segment.size)} material={surfaceMaterial} />
                )}
                {frame && (
                    <lineSegments position={segment.position} geometry={getEdgesGeometry(segment.size)} material={lineMaterial} />
                )}
            </group>
        ))
    }

    function erstelleWandRiegel() {
        const riegel = []
        
        // Berechne Positionen der Ecken
        const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
        const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
        const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
        const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))
        
        // Riegel auf Höhe der Eck-Stelzen (Oberkante der normalen Gebäudehöhe)
        const riegelHöhe = y + 4.5 + gebäudeHöhe / 2
        
        const längeLangeSeite = xRechts - xLinks
        const längeKurzeSeite = zVorne - zHinten

        const wievieleRiegel = Math.floor(gebäudeHöhe / riegelFaktor)
        
        // Vordere Riegel (horizontal)
        for (let i = 0; i <= wievieleRiegel; i++) {
            riegel.push(...renderClippedBox(
                `riegel-vorne-${i}`,
                [(xLinks + xRechts) / 2, riegelHöhe - 0.5 - i * riegelFaktor, zVorne + 0.4],
                [längeLangeSeite, 0.3, 0.3],
                'x'
            ))
        }
        
        // Hintere Riegel (horizontal)
        for (let i = 0; i <= wievieleRiegel; i++) {
            riegel.push(...renderClippedBox(
                `riegel-hinten-${i}`,
                [(xLinks + xRechts) / 2, riegelHöhe - 0.5 - i * riegelFaktor, zHinten - 0.4],
                [längeLangeSeite, 0.3, 0.3],
                'x'
            ))
        }
        
        // Rechte Riegel (horizontal)
        for (let i = 0; i <= wievieleRiegel; i++) {
            riegel.push(...renderClippedBox(
                `riegel-rechts-${i}`,
                [xRechts + 0.4, riegelHöhe - 0.5 - i * riegelFaktor, (zHinten + zVorne) / 2],
                [0.3, 0.3, längeKurzeSeite],
                'z'
            ))
        }
        
        // Linke Riegel (horizontal)
        for (let i = 0; i <= wievieleRiegel; i++) {
            riegel.push(...renderClippedBox(
                `riegel-links-${i}`,
                [xLinks - 0.4, riegelHöhe - 0.5 - i * riegelFaktor, (zHinten + zVorne) / 2],
                [0.3, 0.3, längeKurzeSeite],
                'z'
            ))
        }
        
        return riegel
    }

    function extraRiegel() {

        function sattel() {

            const xLinks = x - 9 - (0.5 * (bodenLänge - 20))
            const xRechts = x + 9 + (0.5 * (bodenLänge - 20))
            const zVorne = z + 6.5 + (0.5 * (bodenBreite - 15))
            const zHinten = z - 6.5 - (0.5 * (bodenBreite - 15))

            const riegelHöhe = y + 4.5 + gebäudeHöhe / 2
        
            const längeKurzeSeite = zVorne - zHinten
            const wievieleRiegel = Math.floor(gebäudeHöhe / riegelFaktor)

            // Position der extra Riegel (oberhalb der normalen Gebäudehöhe)
            const extraRiegelHöhe = riegelHöhe + wievieleRiegel/6
            
            // Berechne wie viel höher dieser Riegel über der Basis-Gebäudehöhe ist
            const höheÜberBasis = extraRiegelHöhe - (y + 4.5 + gebäudeHöhe / 2)
            
            // Der Rahmen steigt linear von der Ecke (Höhe = gebäudeHöhe) zur Mitte (Höhe = gebäudeHöhe + zusatzHöheMitte)
            // Bei dieser Y-Position müssen wir berechnen, wie weit der Riegel nach innen verschoben werden muss
            
            // Verhältnis: Wie weit sind wir auf dem Weg zur maximalen zusätzlichen Höhe?
            const verhältnis = Math.min(1, höheÜberBasis / zusatzHöheMitte)
            
            // Je höher der Riegel, desto kürzer muss er sein
            // Bei voller Höhe darf er nur in der Mitte sein (sehr kurz)
            // Formel: Länge reduziert sich proportional zur Höhe
            const kürzung = verhältnis * (längeKurzeSeite / 2 - 2)
            const kurzeRiegel = Math.max(3, längeKurzeSeite - kürzung * 2)

            
            return(
                <>
                {zusatzHöheMitte > 4 && (
                    <>
                        {renderClippedBox(
                            'extra-riegel-rechts',
                            [xRechts + 0.4, extraRiegelHöhe, (zHinten + zVorne) / 2],
                            [0.3, 0.3, kurzeRiegel],
                            'z'
                        )}
                        {renderClippedBox(
                            'extra-riegel-links',
                            [xLinks - 0.4, extraRiegelHöhe, (zHinten + zVorne) / 2],
                            [0.3, 0.3, kurzeRiegel],
                            'z'
                        )}
                    </>
                )}
                </>
            )
        }

        function pult() {

            return
        }

        return(
            dachArt === 'satteldach' ? sattel() : pult()
        )
    }

    return(
        <>
            {erstelleWandRiegel()}
            {extraRiegel()}
        </>
    )
}