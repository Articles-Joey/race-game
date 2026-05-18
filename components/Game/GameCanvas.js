import { memo, useMemo, useRef } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Sky, useDetectGPU, useTexture } from "@react-three/drei";


import Ocean from "./Ocean"
import { Boat } from "./Boat"
import { WindTurbine } from "./WindTurbine";
import BleacherBox from "./BleacherBox";
import GameGrid from "./GameGrid";
import PlayersGrid from "./PlayersGrid";

import GrassPlane from "./Grass";
import CameraControls from "./CameraControls";

import { useSocketStore } from "@/hooks/useSocketStore";
import useCameraStore from "@/hooks/useCameraStore";
import useGameStore from '@/hooks/useGameStore';
import { useStore } from "@/hooks/useStore";
import { useSearchParams } from "next/navigation";
import Trees from "./Trees";

function GameCanvas(props) {

    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    const { server_type } = searchParamsObject

    // const GPUTier = useDetectGPU()

    // const setCameraState = useCameraStore((state) => state?.setCameraState);
    const cameraState = useCameraStore((state) => state?.cameraState);

    const darkMode = useStore((state) => state.darkMode);

    const myId = useGameStore((state) => state.myId);

    const gameState = useGameStore((state) => state?.gameState);
    const players = useGameStore((state) => state?.gameState?.players);

    const {
        // handleCameraChange,
        // gameState,
        // players,
        move,
        // cameraState,
        cameraControlsRef,
        // cameraUpdate,
        // setCameraUpdate
    } = props;

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    const clientPlayerLookup = useMemo(() => {

        if (server_type == "online-socket" && players) {
            return players.find(player => player.id == socket.id)
        }

        if (server_type == "online-peer" && players) {
            return players.find(player => player.peer == myId)
        }

    }, [server_type, players, socket.id, myId]);

    return (
        <Canvas
            camera={{
                position: [19, 10, 15],
                // fov: 50 
            }}
        >

            {/* <CameraController onCameraChange={handleCameraChange} /> */}

            <CameraControls
            // cameraState={cameraState}
            // onCameraChange={handleCameraChange}
            // cameraUpdate={cameraUpdate}
            // setCameraUpdate={setCameraUpdate}
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
                sunPosition={[0, darkMode ? -1 : 1, 0]}
            // inclination={0}
            // azimuth={0.25}
            // {...props} 
            />

            <GrassPlane />

            <Trees />

            {/* <Tree
            scale={0.2}
            position={[0, -0.3, -10]}
        /> */}

            <ambientLight intensity={darkMode ? 0.2 : 1.4} />

            <spotLight position={[70, 100, 0]} angle={0.5} penumbra={1} intensity={darkMode ? 10000 : 20000} />
            {!darkMode && <pointLight position={[-10, -10, -10]} intensity={10000} />}

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
                player={clientPlayerLookup}
                gameState={gameState}
                move={move}
            />

            <PlayersGrid
            // players={players}
            // gameState={gameState}
            // cameraInfo={cameraInfo}
            />

        </Canvas>
    )
}

export default memo(GameCanvas)