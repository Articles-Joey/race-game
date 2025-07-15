import { useEffect, useRef } from 'react';

import { Text } from "@react-three/drei";
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

export default function FloatingOrb({ 
    position, 
    number, 
    valid,
    // cameraInfo 
}) {

    const orbRef = useRef();
    const textRef = useRef();

    useFrame(({ camera }) => {
        // Calculate the direction from the orb to the camera
        const direction = new Vector3();
        camera.getWorldPosition(direction);

        // LookAt the camera
        textRef.current.lookAt(direction);
    });

    return (
        <group position={position}>

            <mesh renderOrder={1} ref={orbRef} position={[ 0, 0, 1.5 ]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color={valid ? "blue" : "red"} transparent opacity={0.5} />
            </mesh>

            <Text
                ref={textRef}
                renderOrder={0}
                position={[0, 0, 1.55]} // Adjust the Y-coordinate based on your preference
                fontSize={1.5}
                color="white"
                anchorX="center"
                anchorY="middle"
                side={'both'}
                rotation={[0, 0, 0]}
            >
                {number}
            </Text>

        </group>
    );
}