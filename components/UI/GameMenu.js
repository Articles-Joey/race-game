"use client"

import { QRCodeCanvas } from 'qrcode.react';

import Link from 'next/link';

import ArticlesButton from '@/components/UI/Button';

import { Dropdown, Form } from 'react-bootstrap';

import IsDev from '@/components/UI/IsDev';
import { useStore } from '@/hooks/useStore';
import { useSearchParams } from 'next/navigation';
import usePeerConnection from '@/hooks/usePeerConnection';
import { memo, Suspense, useEffect, useState } from 'react';
import { connect } from 'socket.io-client';
import PeerLogic from '../PeerLogic';
import useGameStore from '@/hooks/useGameStore';

import useCameraStore from '@/hooks/useCameraStore';
import GameChat from './GameChat';
import classNames from 'classnames';
import { useAudioStore } from '@/hooks/useAudioStore';

import GameMenuPrimaryButtonGroup from '@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup';
import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import DebugPanel from './DebugPanel';

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
        server,
        server_type
    } = searchParamsObject

    const showMenu = useStore((state) => state?.showMenu);
    const setShowMenu = useStore((state) => state?.setShowMenu);

    const gameState = useGameStore((state) => state?.gameState);
    const setGameState = useGameStore((state) => state?.setGameState);
    const players = useGameStore((state) => state?.gameState?.players);

    const audioSettings = useAudioStore((state) => state?.audioSettings);
    const setAudioSettings = useAudioStore((state) => state?.setAudioSettings);

    const renderMode = useStore((state) => state?.renderMode);
    const setRenderMode = useStore((state) => state?.setRenderMode)

    const setInfoModal = useStore((state) => state.setInfoModal)

    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)

    const debug = useStore((state) => state.debug)

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

    const shareLink = `/play?server=${peerId}&server_type=${server_type || 'error'}`

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

                    <div className="d-flex flex-wrap w-100 mb-2">
                        <GameMenuPrimaryButtonGroup
                            useStore={useStore}
                            type="GameMenu"
                        />
                    </div>

                    <div className='d-flex flex-column mb-2 mt-auto'>

                        {server_type == "online-socket" &&
                            <div className='flex-header bg-dark text-white p-1 mb-2'>
                                <div>
                                    <div>Room: {server}</div>
                                    <div>
                                        <span>Status: </span>
                                        {gameState?.status == 'In Lobby' &&
                                            <span className='text-danger'>In Lobby | Need Players</span>
                                        }
                                        {gameState?.status == 'In Progress' &&
                                            <span className='text-success'>In Progress | Pick Space</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        }

                        {server_type == "online-peer" &&
                            <div className='p-1 mb-2'>
                                <Suspense>
                                    <PeerLogic />
                                </Suspense>
                            </div>
                        }

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
                                        // ||
                                        // server_type == 'room-play'
                                    )
                                    &&
                                    !isHost
                                )
                                ||
                                // Disable in progress on hosts
                                (
                                    (
                                        server_type == 'online-peer'
                                        // ||
                                        // server_type == 'room-play'
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

                                // if (server_type == 'room-play') {

                                //     if (isHost) {

                                //         startGame()
                                //         broadcastGameState()

                                //     }

                                // }

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

                </div>

                <GameChat />

                {debug &&
                    <>

                        <div>
                            <div><b className="mb-0">Players</b></div>
                            {players?.map((obj, index) => (
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
                        </div>

                        <DebugPanel />

                    </>
                }

            </div>

        </div>
    );
}

export default memo(GameMenu);