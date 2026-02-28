"use client"

import { QRCodeCanvas } from 'qrcode.react';

import Link from 'next/link';

import ArticlesButton from '@/components/UI/Button';

import { Dropdown, Form } from 'react-bootstrap';

import IsDev from '@/components/UI/IsDev';
import { useStore } from '../hooks/useStore';
import { useSearchParams } from 'next/navigation';
import usePeerConnection from '../hooks/usePeerConnection';
import { memo, Suspense, useEffect, useState } from 'react';
import { connect } from 'socket.io-client';
import PeerLogic from '../PeerLogic';
import useGameStore from '../hooks/useGameStore';
import useFullscreen from '../hooks/useFullScreen';
import useCameraStore from '../hooks/useCameraStore';
import GameChat from './GameChat';
import classNames from 'classnames';

function GameMenu({
    // isFullscreen,
    // requestFullscreen,
    // exitFullscreen
}) {

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    // const cameraUpdate = useCameraStore((state) => state?.cameraUpdate);
    const setCameraUpdate = useCameraStore((state) => state?.setCameraUpdate);

    // const router = useRouter()
    // const pathname = usePathname()
    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    const {
        server_id,
        server_type
    } = searchParamsObject

    const showMenu = useStore((state) => state?.showMenu);
    const setShowMenu = useStore((state) => state?.setShowMenu);

    const gameState = useStore((state) => state?.gameState);
    const setGameState = useStore((state) => state?.setGameState);

    const audioSettings = useStore((state) => state?.audioSettings);
    const setAudioSettings = useStore((state) => state?.setAudioSettings);

    const renderMode = useStore((state) => state?.renderMode);
    const setRenderMode = useStore((state) => state?.setRenderMode)

    const setInfoModal = useStore((state) => state.setInfoModal)

    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)

    const devDebug = useStore((state) => state.devDebug)
    const toggleDevDebug = useStore((state) => state.toggleDevDebug)

    const sidebar = useStore((state) => state.sidebar)
    const toggleSidebar = useStore((state) => state.toggleSidebar)

    const darkMode = useStore((state) => state.darkMode)
    const toggleDarkMode = useStore((state) => state.toggleDarkMode)

    // const peerId = usePeerConnection((state) => state?.peerId);

    // const [players, setPlayers] = useState([]);
    const connections = useGameStore((state) => state.connections);

    const broadcastGameState = useGameStore((state) => state.broadcastGameState);
    const startGame = useGameStore((state) => state.startGame);
    const myId = useGameStore((state) => state.myId);
    const isHost = useGameStore((state) => state.isHost);

    const [peerId, setPeerId] = useState(false);

    const shareLink = `/play?server_id=${peerId}&server_type=${server_type || 'error'}`

    // const peerRef = usePeerConnection((state) => state?.peerRef);
    // const connections = usePeerConnection((state) => state?.connections);
    // const setConnections = usePeerConnection((state) => state?.setConnections);
    // const peerId = usePeerConnection((state) => state?.peerId);
    // const connectPeer = usePeerConnection((state) => state?.connect);

    // useEffect(() => {
    //     console.log("peerRef:", peerRef?._id)
    // }, [peerRef])

    // useEffect(() => {
    //     console.log("peerId:", peerId)
    // }, [peerId])

    useEffect(() => {
        setPeerId(myId)
    }, [myId])

    useEffect(() => {
        console.log("remount")
    })

    return (
        <div
            // className='menu-card-wrapper'
            className={
                classNames(
                    'menu-card-wrapper',
                    {
                        show: showMenu,
                        "show-menu": showMenu,
                        "hide-menu": !showMenu,
                        "sidebar-enabled": sidebar,
                        "sidebar-disabled": !sidebar,
                    }
                )
            }
        >

            <div
                className={
                    classNames(
                        `menu-card-backdrop`,
                        {
                            show: showMenu,
                            "show-menu": showMenu,
                            "hide-menu": !showMenu,
                            "sidebar-enabled": sidebar,
                            "sidebar-disabled": !sidebar,
                        }
                    )
                }
                onClick={() => setShowMenu(false)}
            >

            </div>

            <div className={
                classNames(
                    `menu-card card card-articles rounded-0`,
                    {
                        show: showMenu,
                        "show-menu": showMenu,
                        "hide-menu": !showMenu,
                        "sidebar-enabled": sidebar,
                        "sidebar-disabled": !sidebar,
                    }
                )
            }>

                <div className="card-body p-2 mt-auto d-flex flex-column">

                    <div className='d-flex flex-column mb-2 mt-auto'>

                        <div className='flex-header bg-dark text-white p-1 mb-2'>

                            <div>
                                <span>Room: {server_id}</span>
                                {gameState.status == 'In Lobby' &&
                                    <span className='text-danger'>In Lobby | Need Players</span>
                                }
                                {gameState.status == 'In Progress' &&
                                    <span className='text-success'>In Progress | Pick Space</span>
                                }
                            </div>

                            <div>
                                {/* Test */}
                            </div>

                        </div>

                        <div className='bg-dark text-white p-1 mb-2'>

                            {/* <div>
                                <span
                                    onClick={() => {
                                        console.log(peerRef)
                                        console.log("connections", connections)
                                    }}
                                >Peer Connections:</span>
                            </div> */}

                            <div>

                                {/* {[...peerRef._connections]?.map((conn, i) => (
                                    <div key={`123-${conn.peer}-${i}`} className='border p-1 mb-1 '>
                                        <div>{conn.peer || '?'}</div>
                                </div>))} */}

                                {/* {connections.map((conn, i) => (
                                    <div key={`${conn.peer}-${i}`} className='border p-1 mb-1 '>
                                        <div>{conn.peer || '?'}</div>
                                        <div>
                                            {conn.open ? 'Connected' : 'Disconnected'}
                                        </div>
                                        {!server_id && <ArticlesButton
                                            small
                                            onClick={() => {
                                                // console.log(connections)
                                                console.log("conn", conn)
                                                console.log("Attempting to close connection to", conn.peer)
                                                conn.send({
                                                    event: 'Kicked',
                                                    message: 'You have been disconnected by the host.'
                                                })
                                                conn.close()
                                            }}
                                        >
                                            <i
                                                className='fad fa-trash'
                                            ></i>
                                        </ArticlesButton>}
                                        <ArticlesButton
                                            small
                                            onClick={() => {
    
                                                console.log("conn", conn)
    
                                                conn.send("TEST")
    
                                                return
    
                                                // [...peerRef._connections].map((con, peerId) => {
    
                                                //     console.log("con", con, peerId)
    
    
                                                // });
    
                                                const connectionKeys = [...peerRef._connections.keys()];
                                                console.log("connectionKeys", connectionKeys);
    
                                                for (const [key, value] of peerRef._connections) {
                                                    console.log(`${key}: ${value}`);
                                                    console.log(key, value);
    
                                                    if (value.open) {
                                                        value.dataChannel.send("TEST")
                                                    }
                                                }
    
                                                return
    
                                                peerRef._connections.map((connection, peerId) => {
                                                    connection.send("Test message from peer");
                                                    // if (peerId === conn.peerId) {
                                                    //     conns.forEach((c) => {
                                                    //         console.log("Closing connection to", peerId);
                                                    //         c.close();
                                                    //     });
                                                    // }
    
                                                })
                                            }}
                                        >
                                            <i
                                                className='fad fa-paper-plane'
                                            ></i>
                                        </ArticlesButton>
                                    </div>
                                ))} */}
                            </div>

                        </div>

                        <div className='p-1 mb-2'>
                            <Suspense><PeerLogic /></Suspense>
                        </div>

                        <div className='border p-1 mb-2'>

                            {/* <ArticlesButton
                                className={`w-100 mb-2`}
                                small
                                // disabled={!connectPeer || !server || !peerReady}
                                onClick={async () => {
    
                                    // if (!connectPeer || !server || !peerReady) {
                                    //     console.warn("Peer connection not ready or server_id missing", { hasConnect: !!connectPeer, server, peerReady });
                                    //     return;
                                    // }
    
                                    // try {
                                    //     const targetPeerId = server.trim();
                                    //     console.log("Attempting peer connection", { remoteId: targetPeerId });
                                    //     const connection = await connectPeer(targetPeerId);
                                    //     console.log("Peer connection established", connection);
                                    // } catch (error) {
                                    //     console.error("Failed to connect to peer", error);
                                    // }
    
                                    connectPeer(server_id);
    
                                    return
    
                                    const conn = peerRef.connect(server_id, {
                                        reliable: true,
                                        // metadata 
                                    });
                                    const cleanup = () => {
                                        conn.off("open", handleOpen);
                                        conn.off("error", handleError);
                                    };
                                    const handleOpen = () => {
                                        cleanup();
                                        // log("outgoing data connection open", server_id);
                                        console.log("outgoing data connection open", server_id);
                                        setupDataConnection(conn);
                                        resolved = true;
                                        resolve(conn);
                                    };
                                    const handleError = (err) => {
                                        cleanup();
                                        if (!resolved) {
                                            // log("outgoing connection error", err);
                                            console.log("outgoing connection error", err);
                                            reject(err);
                                        }
                                    };
    
                                    conn.on("open", handleOpen);
                                    conn.on("error", handleError);
    
                                }}
                            >
                                Test Peer Connection
                            </ArticlesButton> */}

                            {/* {server_id && <ArticlesButton
                                className={`w-100 mb-2`}
                                small
                                // disabled={!connectPeer || !server || !peerReady}
                                onClick={async () => {
    
                                    setConnections([])
                                    peerRef.disconnect();
    
                                }}
                            >
                                Disconnect
                            </ArticlesButton>} */}

                            {/* <div>{peerId}</div> */}

                            <div className='d-flex'>
                                {/* <a
                                    href={shareLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='w-50'
                                > */}
                                {/* {window.location.hostname} */}
                                <ArticlesButton
                                    small
                                    className="w-50 mb-2"
                                    // disabled={}
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.host}${shareLink}`);
                                    }}
                                >
                                    <i className="fad fa-clipboard"></i>
                                    Share Link
                                </ArticlesButton>
                                {/* </a> */}

                                <a
                                    href={shareLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='w-50'
                                >
                                    {/* {window.location.hostname} */}
                                    <ArticlesButton
                                        small
                                        className="w-100 mb-2"
                                        // disabled={}
                                        onClick={() => {

                                        }}
                                    >
                                        <i className="fad fa-link"></i>
                                        Dev
                                    </ArticlesButton>
                                </a>
                            </div>

                            <div className='d-flex justify-content-center mb-1'>
                                {peerId &&
                                    <QRCodeCanvas
                                        value={`${window.location.host}${shareLink}`}
                                        className=''

                                        size={150}
                                    />
                                }
                            </div>

                        </div>

                        <ArticlesButton
                            small
                            className="w-100 mb-2"
                            // active={}
                            disabled={
                                // Disable for non-hosts
                                (
                                    (
                                        server_type == 'online-peer'
                                        ||
                                        server_type == 'room-play'
                                    )
                                    &&
                                    !isHost
                                )
                                ||
                                // Disable in progress on hosts
                                (
                                    (
                                        server_type == 'online-peer'
                                        ||
                                        server_type == 'room-play'
                                    )
                                    &&
                                    gameState?.status == 'In Progress'
                                    &&
                                    isHost
                                )
                                ||
                                (server_type == 'online-socket' && false)
                                // connections.length < 1
                                // ||

                            }
                            onClick={() => {

                                if (server_type == 'room-play') {

                                    if (isHost) {

                                        startGame()
                                        broadcastGameState()

                                    }

                                }

                                if (server_type == 'online-peer') {

                                    if (isHost) {

                                        startGame()
                                        broadcastGameState()

                                    }

                                }


                                // if (server_type == 'online-socket') {

                                // }

                            }}
                        >
                            <i className="fad fa-play"></i>
                            <span>Start Game</span>
                            <span className="badge bg-dark ms-2">
                                {connections?.length || 0} / 2+
                            </span>
                        </ArticlesButton>

                        <div className='mb-2'>

                            <Link
                                className=""
                                href={'/'}
                            >
                                <ArticlesButton
                                    small
                                    className='w-50'
                                >
                                    <i className="fad fa-sign-out fa-rotate-180"></i>
                                    Leave Game
                                </ArticlesButton>
                            </Link>

                            <ArticlesButton
                                small
                                className="w-50"
                                active={isFullscreen}
                                onClick={() => {
                                    if (isFullscreen) {
                                        exitFullscreen()
                                    } else {
                                        requestFullscreen('race-game-game-page')
                                    }
                                }}
                            >
                                {isFullscreen && <span>Exit </span>}
                                {!isFullscreen && <span><i className='fad fa-expand'></i></span>}
                                <span>Fullscreen</span>
                            </ArticlesButton>
                        </div>

                        <div className='d-flex flex-wrap'>

                            <ArticlesButton
                                small
                                className="w-50"
                                onClick={() => {
                                    setInfoModal(true)
                                }}
                            >
                                {/* <i className="fad fa-info-circle"></i> */}
                                <i className="fad fa-info-square"></i>
                                Info & Rules
                            </ArticlesButton>

                            <div
                                className={`w-50 d-flex`}
                            >
                                <ArticlesButton
                                    small
                                    className={`w-100`}
                                    onClick={() => {
                                        setShowSettingsModal(true)
                                    }}
                                >
                                    <i className="fad fa-cog"></i>
                                    Settings
                                </ArticlesButton>
                                <ArticlesButton

                                    small
                                    onClick={() => {
                                        toggleDarkMode()
                                    }}
                                >
                                    <i className={`fad ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
                                </ArticlesButton>
                            </div>

                            <ArticlesButton
                                className={`w-50`}
                                small
                                active={sidebar}
                                onClick={() => {
                                    toggleSidebar()
                                    setShowMenu(false)
                                }}
                            >
                                <i className="fad fa-info-square"></i>
                                Sidebar
                            </ArticlesButton>

                            <ArticlesButton
                                className={`w-50`}
                                small
                                active={devDebug}
                                onClick={() => {
                                    toggleDevDebug()
                                }}
                            >
                                <i className="fad fa-info-square"></i>
                                Dev Mode
                            </ArticlesButton>

                        </div>

                    </div>

                    <hr className='my-2' />

                    <div className='d-flex'>

                        {/* Audio */}
                        <div className='w-50 m-lg-1'>

                            <div className="small text-center">
                                Audio
                            </div>

                            <div className='d-flex'>

                                <ArticlesButton
                                    small
                                    className="w-50"
                                    active={!audioSettings?.enabled}
                                    onClick={() => {
                                        setAudioSettings({
                                            ...audioSettings,
                                            enabled: false
                                        })
                                    }}
                                >
                                    Off
                                </ArticlesButton>

                                <ArticlesButton
                                    small
                                    className="w-50"
                                    active={audioSettings?.enabled}
                                    onClick={() => {
                                        setAudioSettings({
                                            ...audioSettings,
                                            enabled: true
                                        })
                                    }}
                                >
                                    On
                                </ArticlesButton>

                            </div>

                        </div>

                        {/* Rendering */}
                        <div className="w-50 m-lg-1">

                            <div className="small text-center">
                                Game Style
                            </div>

                            <div className='d-flex'>

                                <ArticlesButton
                                    small
                                    className="w-50 mb-2"
                                    active={renderMode == "2D"}
                                    onClick={() => {
                                        setRenderMode("2D")
                                    }}
                                >
                                    2D
                                </ArticlesButton>

                                <ArticlesButton
                                    small
                                    className="w-50 mb-2"
                                    active={renderMode == "3D"}
                                    onClick={() => {
                                        setRenderMode("3D")
                                    }}
                                >
                                    3D
                                </ArticlesButton>

                            </div>

                        </div>

                    </div>

                    {audioSettings?.enabled && <div className="volume-control card-body text-center border p-1 py-2">
                        <Form.Label className="small mb-0">Volume: {(audioSettings?.volume * 100).toFixed()}%</Form.Label>
                        <Form.Range
                            className="mb-0"
                            value={audioSettings?.volume * 100}
                            onChange={(e) => {

                                console.log("Change", e.target.value)
                                const newVolume = parseFloat(e.target.value);
                                console.log(newVolume)

                                setAudioSettings({
                                    ...audioSettings,
                                    volume: newVolume / 100
                                })

                            }}
                        />
                    </div>}

                    {/* <hr className='my-4' /> */}

                    <IsDev>
                        <hr className='my-2' />

                        <div className="small text-center">
                            Dev Debug
                        </div>

                        <div className='d-flex flex-column mb-2'>

                            <ArticlesButton
                                small
                                variant="warning"
                                className="mb-2"
                                // active={renderMode == "2D"}
                                onClick={() => {
                                    // setRenderMode("2D")
                                }}
                            >
                                Reset Room
                            </ArticlesButton>

                            <ArticlesButton
                                small
                                variant="warning"
                                className="mb-2"
                                // active={renderMode == "2D"}
                                onClick={() => {
                                    // setRenderMode("2D")
                                    startGame()
                                }}
                            >
                                Force Start
                            </ArticlesButton>

                            <ArticlesButton
                                small
                                variant="warning"
                                className="mb-2"
                                // active={renderMode == "2D"}
                                onClick={() => {
                                    // setRenderMode("2D")
                                    generateMysterySpots()
                                }}
                            >
                                Generate Mystery Spots
                            </ArticlesButton>

                        </div>
                    </IsDev>

                    <Dropdown className="d-flex w-100 text-center">

                        <Dropdown.Toggle variant='articles w-100 d-flex justify-content-center align-items-center text-center'>
                            Camera Presets
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="">

                            {
                                // userReduxState?.friends?
                                [
                                    {
                                        name: "Starting",
                                        position: [19, 10, 15]
                                    },
                                    {
                                        name: "Bleacher",
                                        position: [28.32, 5.38, -6.30]
                                    },
                                    {
                                        name: "First Person",
                                        position: [0, 3.5, 0]
                                    },
                                    {
                                        name: "Wind Turbine",
                                        position: [42.50, 16.94, -125.86]
                                    }
                                ]
                                    .map((friend, i) => {
                                        return (
                                            <Dropdown.Item
                                                key={`${i}-${friend.name}`}
                                                onClick={() => {
                                                    setCameraUpdate({
                                                        position: friend.position
                                                    })
                                                }}
                                                className=""
                                                eventKey={i}
                                            >
                                                {/* <i className="fad fa-user" aria-hidden="true"></i> */}
                                                {friend.name}
                                            </Dropdown.Item>
                                        )
                                    })}

                        </Dropdown.Menu>

                    </Dropdown>

                    <div className='d-none'>
                        <div className="text-center">
                            Camera Positions
                        </div>

                        <div className="camera-controls">

                            {[
                                {
                                    name: "Starting",
                                    position: [19, 10, 15]
                                },
                                {
                                    name: "Bleacher",
                                    position: [28.32, 5.38, -6.30]
                                },
                                {
                                    name: "First Person",
                                    position: [0, 3.5, 0]
                                },
                                {
                                    name: "Wind Turbine",
                                    position: [42.50, 16.94, -125.86]
                                }
                            ].map(item => {
                                return (
                                    <ArticlesButton
                                        key={item.name}
                                        small
                                        variant=""
                                        className=""
                                        onClick={() => {
                                            setCameraUpdate({
                                                position: item.position
                                            })
                                        }}
                                    >
                                        {item.name}
                                    </ArticlesButton>
                                )
                            })}

                        </div>
                    </div>

                </div>

                <GameChat />

                {devDebug &&
                    <>
                        {/* <div className="card rounded-0 p-2 m-2">
        
                            <div><b className='mb-3'>Debug Info</b></div>
        
                            <div className="small">
                                Push esc key to toggle
                            </div>
        
                            <hr className='my-4' />
        
                            <div><b className="mb-0">Players</b></div>
        
                            {players.map((obj, index) => (
                                <div key={index + '-' + obj.id}>
                                    <div className="border p-1">
        
                                        <div>Id: {obj.id}</div>
                                        {obj.user_id && <div >User: {obj.user_id}</div>}
        
                                        <div className='d-flex mt-2'>
                                            <div className='me-4'>X = {obj.race_game.x}</div>
                                            <div>Y = {obj.race_game.y}</div>
                                        </div>
        
                                        <div className='d-flex justify-content-between mt-2'>
                                            <div className='me-4'>Row = {obj.race_game.row}</div>
                                            <div>Picked = {obj.race_game.pickedSpace ? 'True' : 'False'} - {obj.race_game.spaces}</div>
                                        </div>
        
                                    </div>
                                </div>
                            ))}
        
                        </div> */}
                    </>
                }

            </div>

        </div>
    );
}

export default memo(GameMenu);