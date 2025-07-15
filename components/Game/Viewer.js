import React, { useRef } from 'react'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'

// import { Duck } from './PlayerModels/Duck'

export default function Viewer({ scale, children }) {

    const ref = useRef()

    // useLayoutEffect(() => {
    //     scene.traverse((obj) => {
    //         if (obj.isMesh) {
    //             obj.castShadow = obj.receiveShadow = shadows
    //             obj.material.envMapIntensity = 0.8
    //         }
    //     })
    // }, [scene, shadows])

    return (
        <Canvas camera={{ position: [-10, 10, 40], fov: 50 }}>

            <hemisphereLight color="white" groundColor="blue" intensity={2} />

            <spotLight position={[50, 50, 20]} angle={0.15} penumbra={1} />

            <group position={[0, -10, 0]}>
                
                <group position={[0, 0.25, 0]} scale={scale ? scale : 12} >
                    {children}
                </group>

                <ContactShadows scale={20} blur={10} far={20} />

            </group>

            <OrbitControls />
            
        </Canvas>
    )
}