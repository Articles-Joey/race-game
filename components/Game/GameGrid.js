import { useEffect, useContext, useRef, useState } from 'react';

import { Canvas, useFrame, useThree } from '@react-three/fiber'
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { toggleDevDebug } from '@/redux/actions/siteActions';
// import Link from 'next/link';

// import ArticlesButton from '@/components/Articles/Button';

import { Line, Plane } from '@react-three/drei';
import { DoubleSide, Vector3 } from 'three';
import { Star } from './Star';
import useGameStore from '../hooks/useGameStore';

const SquareWithLines = (props) => {
    const squareSize = 2;

    return (
        <group {...props}  >
            {/* Draw lines */}
            <Line
                position={[0, 0.26, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                points={[
                    new Vector3(-squareSize / 2, squareSize / 2, 0),
                    new Vector3(squareSize / 2, squareSize / 2, 0),
                    new Vector3(squareSize / 2, -squareSize / 2, 0),
                    new Vector3(-squareSize / 2, -squareSize / 2, 0),
                    new Vector3(-squareSize / 2, squareSize / 2, 0),
                ]}
                color="black"
                lineWidth={0.5}
            />

            {/* See-through inside */}
            {/* <Plane args={[squareSize, squareSize]} position={[0, 0, -0.1]} receiveShadow>
                <meshBasicMaterial color="transparent" opacity={0.5} side={DoubleSide} />
            </Plane> */}
        </group>
    );
};

const MysterySquareWithLines = (props) => {
    const squareSize = 1;

    return (
        <group {...props}  >
            {/* Draw lines */}
            <Line
                position={[0, 0.27, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                points={[
                    new Vector3(-squareSize / 2, squareSize / 2, 0),
                    new Vector3(squareSize / 2, squareSize / 2, 0),
                    new Vector3(squareSize / 2, -squareSize / 2, 0),
                    new Vector3(-squareSize / 2, -squareSize / 2, 0),
                    new Vector3(-squareSize / 2, squareSize / 2, 0),
                ]}
                color="yellow"
                lineWidth={0.5}
            />

            {/* See-through inside */}
            {/* <Plane args={[squareSize, squareSize]} position={[0, 0, -0.1]} receiveShadow>
                <meshBasicMaterial color="transparent" opacity={0.5} side={DoubleSide} />
            </Plane> */}
        </group>
    );
};

function Box(props) {

    const { clickable, clickableData, move, hasMystery, usedMysteryLookup, box_index, hoveredList, setHoveredList } = props

    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()

    const borderRef = useRef()

    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    
    // Subscribe this component to the render-loop, rotate the mesh every frame
    // useFrame((state, delta) => (ref.current.rotation.x += 0.01))

    useFrame((state, delta) => (ref.current))

    useEffect(() => {

        if (hovered && clickable) {
            document.body.style.cursor = 'pointer'
            // setHoveredList(prev => [
            //     ...prev,
            //     box_index
            // ])
        } else {
            document.body.style.cursor = 'auto'
            // setHoveredList(prev => [
            //     ...prev.filter(item => item !== box_index)
            // ])
        }

    }, [hovered])

    // Return the view, these are regular ThreeJS elements expressed in JSX
    return (
        <group>

            <SquareWithLines
                {...props}
            />

            {(hasMystery && !usedMysteryLookup) &&
                <>
                    <MysterySquareWithLines {...props} />
                    <Star {...props} />
                </>
            }

            {/* Black border */}
            {/* <mesh ref={borderRef} {...props} >
                <boxGeometry args={[2.02, 0.55, 2.02]} />
                <meshBasicMaterial
                    color="#000000"
                    wireframe
                />
            </mesh> */}

            {/* Top Plane */}
            <mesh
                {...props}
                ref={ref}
                onClick={(event) => {

                    if (clickable) {
                        console.log("TODO - Move player based on box space from player", clickableData)
                        console.log(`Player wants to move ${clickableData.j - (clickableData.x + 1)} spaces`)
                        move(clickableData.j - (clickableData.x + 1))
                    }

                    // click(!clicked);
                    // hover(true);
                }}
                onPointerOver={() => hover(true)}
                onPointerOut={() => hover(false)}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[2, 2]}  />
                <meshStandardMaterial
                    color={
                        props.color ?
                            ((clickable && hovered) ? 'rgba(0, 0, 0, 1)' : props.color)
                            :
                            hovered || clicked ?
                                'red'
                                :
                                '#f9edcd'
                    }
                />
            </mesh>

            {/* Box */}
            <mesh
                {...props}
                ref={ref}
                onClick={(event) => {

                    if (clickable) {
                        console.log("TODO - Move player based on box space from player", clickableData)
                        console.log(`Player wants to move ${clickableData.j - (clickableData.x + 1)} spaces`)
                        move(clickableData.j - (clickableData.x + 1))
                    }

                    // click(!clicked);
                    // hover(true);
                }}
                // onPointerOver={() => hover(true)}
                // onPointerOut={() => hover(false)}
            >
                <boxGeometry args={[2, 0.5, 2]} />
                <meshStandardMaterial
                    color={
                        props.color ?
                            ((clickable && hovered) ? 'rgba(0, 0, 0, 1)' : props.color)
                            :
                            hovered || clicked ?
                                'red'
                                :
                                '#f9edcd'
                    }
                />
            </mesh>
        </group>
    )
}

function GameGrid(props) {

    const { gameState, player, move } = props
    const { mystery_spots } = gameState

    let starRows = []

    const [hoveredList, setHoveredList] = useState([])

    const boardLength = useGameStore((state) => state.gameState.boardLength);

    useEffect(() => {
        
        if (hoveredList.length > 0) {
            document.body.style.cursor = 'pointer'
        } else {
            document.body.style.cursor = 'auto'
        }

        return () => document.body.style.cursor = 'auto';

    }, [hoveredList])

    for (var i = 0; i < 4; i++) {

        let starCol = []

        for (var j = 1; j < boardLength + 1; j++) {

            // j is the column
            // i is the row

            let edgeTile = (j == 1 || j == boardLength)

            let hasMysteryLookup = (
                mystery_spots?.find((player) => (player.row === i + 1 && player.x === j - 1))
            );

            let usedMysteryLookup = gameState?.used_mystery_spots?.find((spot_player) => (spot_player?.race_game?.row == (i + 1)))

            let clickable = false
            if (
                player?.race_game?.row == (i + 1)
                &&
                (
                    player?.race_game?.x === j - 2
                    ||
                    player?.race_game?.x === j - 3
                    ||
                    player?.race_game?.x === j - 4
                    ||
                    player?.race_game?.x === j - 5
                )
                &&
                !player?.race_game?.pickedSpace
            ) {
                clickable = true
            }

            // The 4 spaces in front of user should have a different color to indicate selection

            // onHover and onClick for box to move instead of having to go to bottom and for touch devices 

            starCol[j - 1] = (
                <Box
                    key={`box-${i}-${j}`}
                    box_index={j - 1}
                    color={
                        (edgeTile) ? 'rgb(160, 120, 73)' : (clickable ? 'rgb(19, 197, 197)' : ((hasMysteryLookup && !usedMysteryLookup) ? 'rgb(255, 193, 7)' : ''))
                    }
                    clickable={clickable}
                    clickableData={{
                        x: player?.race_game?.x,
                        j: j
                    }}
                    position={[j * 2, 0, i * 2]}
                    move={move}
                    player={player}
                    hasMystery={hasMysteryLookup}
                    usedMysteryLookup={usedMysteryLookup}
                    setHoveredList={setHoveredList}
                    hoveredList={hoveredList}
                />
            )

        }

        starRows[i] = starCol

    }

    return starRows

}

export default GameGrid