

export default function Achsen() {

    return(
        <>
        {/* Z achse */}
        <mesh>

            <boxGeometry args={[0.2,0.2,70]} />
            <meshBasicMaterial color={"yellow"} />
        </mesh>
        
        {/* X achse */}
        <mesh>

            <boxGeometry args={[70,0.2,0.2]} />
            <meshBasicMaterial color={"blue"} />
        </mesh>

        {/* Y achse */}
        <mesh>

            <boxGeometry args={[0.2,70,0.2]} />
            <meshBasicMaterial color={"green"} />
        </mesh>
        </>
    )
}