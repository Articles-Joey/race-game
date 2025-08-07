import { memo, useRef } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Sky, useDetectGPU, useTexture } from "@react-three/drei";

import Tree from '@/components/Game/Tree'
import Ocean from "./Ocean"
import { Boat } from "./Boat"
import { WindTurbine } from "./WindTurbine";
import BleacherBox from "./BleacherBox";
import GameGrid from "./GameGrid";
import PlayersGrid from "./PlayersGrid";

import GrassPlane from "./Grass";
import CameraControls from "./CameraControls";

import { useSocketStore } from "@/components/hooks/useSocketStore";

function GameCanvas(props) {

    // const GPUTier = useDetectGPU()

    const {
        handleCameraChange,
        gameState,
        players,
        move,
        cameraState,
        cameraControlsRef,
        cameraUpdate,
        setCameraUpdate
    } = props;

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    return (
        <Canvas
            camera={{
                position: [19, 10, 15],
                // fov: 50 
            }}
        >

            {/* <CameraController onCameraChange={handleCameraChange} /> */}

            <CameraControls
                cameraState={cameraState}
                onCameraChange={handleCameraChange}
                cameraUpdate={cameraUpdate}
                setCameraUpdate={setCameraUpdate}
            />

            <Ocean position={[0, -0.3, 0]} />

            {[...Array(3)].map((item, i) => {
                return (
                    <Boat
                        key={i}
                        position={[((i + 0) * 5), -0.7, 8]}
                        scale={3.5}
                    />
                )
            })}

            <group rotation={[0, -Math.PI / 6, 0]} position={[0, 0, -150]}>
                {[...Array(5)].map((item, i) => {
                    return (
                        <WindTurbine
                            key={i}
                            position={[((i) * 25), -0.7, 0]}
                            scale={3.5}
                        />
                    )
                })}
            </group>

            <Sky
            // distance={450000}
            // sunPosition={[0, 1, 0]}
            // inclination={0}
            // azimuth={0.25}
            // {...props} 
            />

            <GrassPlane />

            {[...Array(30)].map((item, i) => {
                return (
                    <Tree
                        key={i}
                        scale={0.2}
                        position={[((i - 10) * 3), -0.3, -15]}
                    />
                )
            })}

            {/* <Tree
            scale={0.2}
            position={[0, -0.3, -10]}
        /> */}

            <ambientLight intensity={1.4} />

            <spotLight position={[70, 100, 0]} angle={0.5} penumbra={1} intensity={20000} />
            <pointLight position={[-10, -10, -10]} intensity={20000} />

            <group position={[7, -1.3, -5]} rotation={[0, -Math.PI / 2, 0]}>
                <BleacherBox
                    scale={6}
                />
                <BleacherBox
                    scale={6}
                    position={[0, 0, -10]}
                />
                <BleacherBox
                    scale={6}
                    position={[0, 0, -20]}
                />
            </group>

            {/* <Bleacher position={[51, -0.5, 7.5]} rotation={[0, 0, 0]} /> */}

            <GameGrid
                player={players.find(player => player.id == socket.id)}
                gameState={gameState}
                move={move}
            />

            <PlayersGrid
                players={players}
                gameState={gameState}
            // cameraInfo={cameraInfo}
            />

        </Canvas>
    )
}

export default memo(GameCanvas)