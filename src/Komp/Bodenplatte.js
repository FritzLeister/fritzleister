import * as THREE from 'three'

export default function Bodenplatte({ bodenLänge, bodenBreite, koordinate }) {

    return(
        <>
            <mesh position={[koordinate[0], koordinate[1], koordinate[2]]}>
                <boxGeometry args={[bodenLänge+7, 0.4, bodenBreite+7]} />
                <meshStandardMaterial color={'white'} />
            </mesh>
            <lineSegments position={[koordinate[0], koordinate[1], koordinate[2]]}>
                <edgesGeometry args={[new THREE.BoxGeometry(bodenLänge+7, 0.4, bodenBreite+7)]} />
                <lineBasicMaterial color="black" />
            </lineSegments>
        </>
    )
}