import { useEffect, useContext, useRef, useState } from 'react';

import { Canvas, useFrame, useThree } from '@react-three/fiber'
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { toggleDevDebug } from '@/redux/actions/siteActions';
// import Link from 'next/link';
// import QRCode, { QRCodeCanvas } from 'qrcode.react';
// import ArticlesButton from '@/components/Articles/Button';

// import Tree from 'components/Games/Epcot/Tree'

// import DefaultPlayerCharacter from './DefaultPlayerCharacter';

import FloatingOrb from './FloatingOrb';

import Duck from './PlayerModels/Duck';
import Dog from './PlayerModels/Dog';
import Witch from './PlayerModels/Witch';
import Bear from './PlayerModels/Bear';

function RenderCharacter({ character }) {

    switch (character.model) {

        case 'Dog':
            return <Dog color={character.color} />;

        case 'Duck':
            return <Duck color={character.color} />;

        case 'Witch':
            return <Witch color={character.color} />;

        case 'Bear':
            return <Bear color={character.color} />;

        default:
            return <Duck color={character.color} />;

    }

}

function Box(props) {

    const { gameState, colPlayer, valid } = props;

    let character = colPlayer?.race_game?.character;

    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()

    const borderRef = useRef()
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    // useFrame((state, delta) => (ref.current.rotation.x += 0.01))
    useFrame((state, delta) => (ref.current))
    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <group>

            {/* Black border */}
            <mesh ref={borderRef} {...props}>

                {/* <boxGeometry args={[2.02, 1.52, 2.02]} /> */}
                {/* <boxGeometry args={[2.02, 1.52, 2.02]} /> */}

                {/* <meshBasicMaterial
                    color="#000000"
                    wireframe
                /> */}

                {/* TODO - Figure out why it does not work? */}
                {/* <DefaultPlayerCharacter
                    position={[0, -0.7, 0]}
                    rotation={[0, Math.PI / 2, 0]}
                /> */}

                {/* <Tree scale={0.2} /> */}

                {(gameState?.movesShown > 0 && colPlayer?.race_game?.spaces) &&
                    <FloatingOrb
                        position={[0, 2, -1.5]}
                        number={colPlayer?.race_game?.spaces}
                        valid={valid}
                    // cameraInfo={cameraInfo}
                    />
                }

                {/* For Testing */}
                {/* <FloatingOrb
                    position={[0, 2, -1.5]}
                    number={69}
                /> */}

                <group
                    position={[0, -0.75, 0]}
                    rotation={[0, Math.PI / 2, 0]}
                >
                    <RenderCharacter
                        character={character}
                    />
                </group>

            </mesh>



            {/* Main box */}
            {/* <mesh
                {...props}
                ref={ref}
                onClick={(event) => click(!clicked) + hover(true)}
                onPointerOver={() => hover(true)}
                onPointerOut={() => hover(false)}
            >
                <boxGeometry args={[2, 0.5, 2]} />
                <meshStandardMaterial
                    color={props.color ? 'rgb(160, 120, 73)' : hovered || clicked ? '#ffb7b7' : '#f9edcd'}
                />
            </mesh> */}

        </group>
    )
}

export default function PlayersGrid(props) {

    const { players, gameState } = props;
    let starRows = [];

    for (let i = 0; i < 4; i++) {
        let starCol = [];

        let rowPlayers = players.filter((player) => player.race_game.row === i + 1);

        if (rowPlayers.length > 0) {
            starCol = Array.from({ length: 15 }, (_, j) => {

                let colPlayer = rowPlayers.find((player) => (player.race_game.x || 0) === j);

                // Check if there is a player in the same column
                if (colPlayer) {
                    return (
                        <Box
                            key={`${i}-${j}`}
                            gameState={gameState}
                            position={[(j + 1) * 2, 1, i * 2]}
                            colPlayer={colPlayer}
                            valid={
                                !players
                                .filter((player) => player.id !== colPlayer.id)
                                .find((player) => player.race_game.spaces === colPlayer?.race_game?.spaces)
                            }
                        />
                    );
                } else {
                    // Return null or an empty fragment if no player in the column
                    return null;
                }
            });
        }

        starRows[i] = starCol;
    }

    return starRows;
}