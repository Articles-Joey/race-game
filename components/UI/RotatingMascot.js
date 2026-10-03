"use client";
import Box from "@mui/material/Box";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
// import { ModelBackpack } from "../Models/Backpack";
import { Suspense } from "react";
import BleacherBox from "../Game/BleacherBox";

export default function RotatingMascot() {
    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Suspense>
                <Canvas>

                    <OrbitControls
                        autoRotate
                        enableZoom={false}
                        enablePan={false}
                        enableRotate={false}
                        autoRotateSpeed={10}
                    />

                    <ambientLight intensity={2} />

                    <Suspense fallback={null}>
                        <BleacherBox
                            position={[0, -2, 0]}
                            scale={5}
                        />
                    </Suspense>

                </Canvas>
            </Suspense>
        </Box>
    );
}
