import { useRef, useMemo, useEffect } from "react";
import { NearestFilter, RepeatWrapping, TextureLoader, DoubleSide, Object3D } from "three";
import { useStore } from "@/hooks/useStore";

const texture = new TextureLoader().load(`${process.env.NEXT_PUBLIC_CDN}games/Race Game/grass.jpg`)

// Plane bounds: position [15,0,3], width 110, height 50
// X: 15 - 55 = -40  to  15 + 55 = 70
// Z:  3 - 25 = -22  to   3 + 25 = 28
const BLADE_HEIGHT = 0.2;
const BLADE_WIDTH = 0.05;
const BLADE_COUNTS = { Medium: 5000, High: 20000 };

const dummy = new Object3D();

function Blades() {
    const graphicsQuality = useStore((state) => state.graphicsQuality);
    const count = BLADE_COUNTS[graphicsQuality];
    const meshRef = useRef();

    // Pre-generate max count so positions stay stable when quality changes
    const bladeData = useMemo(() => {
        const arr = [];
        for (let i = 0; i < BLADE_COUNTS.High; i++) {
            arr.push({
                x: Math.random() * 110 - 40,
                z: Math.random() * 50 - 22,
                rotY: Math.random() * Math.PI * 2,
                tiltX: (Math.random() - 0.5) * 0.35,
                scaleY: 0.7 + Math.random() * 0.6,
            });
        }
        return arr;
    }, []);

    useEffect(() => {
        if (!meshRef.current || !count) return;
        for (let i = 0; i < count; i++) {
            const { x, z, rotY, tiltX, scaleY } = bladeData[i];
            dummy.position.set(x, (BLADE_HEIGHT * scaleY) / 2, z);
            dummy.rotation.set(tiltX, rotY, 0);
            dummy.scale.set(1, scaleY, 1);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [count, bladeData]);

    if (!count) return null;

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <planeGeometry args={[BLADE_WIDTH, BLADE_HEIGHT]} />
            <meshStandardMaterial color="#5a9e42" side={DoubleSide} />
        </instancedMesh>
    );
}

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
            <Blades />
        </>
    );
};

export default GrassPlane