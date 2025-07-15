import { NearestFilter, RepeatWrapping, TextureLoader } from "three";

const texture = new TextureLoader().load(`${process.env.NEXT_PUBLIC_CDN}games/Race Game/grass.jpg`)

const GrassPlane = () => {

    const width = 110; // Set the width of the plane
    const height = 50; // Set the height of the plane

    texture.magFilter = NearestFilter;
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
	texture.repeat.set(20, 10)

    return (
        <>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[15, 0, 3]}>
                <planeGeometry attach="geometry" args={[width, height]} />
                <meshStandardMaterial attach="material" map={texture} />
            </mesh>
        </>
    );
};

export default GrassPlane