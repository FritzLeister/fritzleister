

export default function Gerüst({ bodenLänge, bodenBreite, gebäudeHöhe, koordinate }) {

    const bodenDicke = 0.3

    const x = koordinate[0]
    const y = koordinate[1] - 0.35 + 0.5*(gebäudeHöhe-9)
    const z = koordinate[2]

    return(
        <>

        {/* Boden */}
        <mesh position={[x, y-(gebäudeHöhe-9) / 2, z]}>
            <boxGeometry args={[bodenLänge, bodenDicke, bodenBreite]} />
            <meshStandardMaterial color={"#888888"} />
        </mesh>

        {/* Stelzen */}
        
        <mesh position={[x+9+(0.5*(bodenLänge-20)), y+4.5, z+6.5+(0.5*(bodenBreite-15))]}>
            <boxGeometry args={[0.5, gebäudeHöhe, 0.5]} />
            <meshStandardMaterial color={"#9e9e94"} />
        </mesh>

        <mesh position={[x+9+(0.5*(bodenLänge-20)),y+4.5,z-6.5-(0.5*(bodenBreite-15))]}>
            <boxGeometry args={[0.5,gebäudeHöhe,0.5]} />
            <meshStandardMaterial color={"#9e9e94"} />
        </mesh>

        <mesh position={[x-9-(0.5*(bodenLänge-20)),y+4.5,z-6.5-(0.5*(bodenBreite-15))]}>
            <boxGeometry args={[0.5,gebäudeHöhe,0.5]} />
            <meshStandardMaterial color={"#9e9e94"} />
        </mesh>

        <mesh position={[x-9-(0.5*(bodenLänge-20)),y+4.5,z+6.5+(0.5*(bodenBreite-15))]}>
            <boxGeometry args={[0.5,gebäudeHöhe,0.5]} />
            <meshStandardMaterial color={"#9e9e94"} />
        </mesh>

        {/* Verbindungsstücke */}
        <mesh position={[x+9+(0.5*(bodenLänge-20)),y+8.75+(gebäudeHöhe-9) / 2,z]}>
            <boxGeometry args={[0.5,0.5,13+(1*(bodenBreite-15))]} />
            <meshStandardMaterial color={"#9e9e94"} />
        </mesh>

        <mesh position={[x-9-(0.5*(bodenLänge-20)),y+8.75+(gebäudeHöhe-9) / 2,z]}>
            <boxGeometry args={[0.5,0.5,13+(1*(bodenBreite-15))]} />
            <meshStandardMaterial color={"#9e9e94"} />
        </mesh>
        
        <mesh position={[x,y+8.75+(gebäudeHöhe-9) / 2,z]}>
            <boxGeometry args={[18+(1*(bodenLänge-20)),0.5,0.5]} />
            <meshStandardMaterial color={"#9e9e94"} />
        </mesh>

        <mesh position={[x,y+8.75+(gebäudeHöhe-9) / 2,z+6.5+(0.5*(bodenBreite-15))]}>
            <boxGeometry args={[18+(1*(bodenLänge-20)),0.5,0.5]} />
            <meshStandardMaterial color={"#9e9e94"} />
        </mesh>

        <mesh position={[x,y+8.75+(gebäudeHöhe-9) / 2,z-6.5-(0.5*(bodenBreite-15))]}>
            <boxGeometry args={[18+(1*(bodenLänge-20)),0.5,0.5]} />
            <meshStandardMaterial color={"#9e9e94"} />
        </mesh>

        <mesh position={[x-9-(0.5*(bodenLänge-20)),y+5,z]}>
            <boxGeometry args={[0.5,gebäudeHöhe-0.5,0.5]} />
            <meshStandardMaterial color={"#9e9e94"} />
        </mesh>

        <mesh position={[x+9+(0.5*(bodenLänge-20)),y+5,z]}>
            <boxGeometry args={[0.5,gebäudeHöhe-0.5,0.5]} />
            <meshStandardMaterial color={"#9e9e94"} />
        </mesh>

        </>
    )
}