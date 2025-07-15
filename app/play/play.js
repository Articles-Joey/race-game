"use client"
import { useEffect, useContext, useRef, useState, Suspense } from 'react';

import { useSearchParams, useRouter, usePathname, useParams } from 'next/navigation';
import dynamic from 'next/dynamic'

// import { useSelector, useDispatch } from 'react-redux'

import Dropdown from 'react-bootstrap/Dropdown';

import { useHotkeys } from 'react-hotkeys-hook';

// import ROUTES from 'components/constants/routes'

import { QRCodeCanvas } from 'qrcode.react';

// import { toggleDevDebug } from '@/redux/actions/siteActions';
import Link from 'next/link';

import ArticlesButton from '@/components/UI/Button';

import { Form } from 'react-bootstrap';

import useFullscreen from '@/hooks/useFullScreen';
import { useLocalStorageNew } from '@/hooks/useLocalStorageNew';
import IsDev from '@/components/UI/IsDev';
import { useSocketStore } from '@/hooks/useSocketStore';

const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

const InviteModal = dynamic(
    () => import('@/components/UI/InviteModal'),
    { ssr: false }
)

const InfoModal = dynamic(
    () => import('@/components/UI/InfoModal'),
    { ssr: false }
)

const SettingsModal = dynamic(
    () => import('@/components/UI/SettingsModal'),
    { ssr: false }
)

const ArticlesModal = dynamic(() => import('@/components/UI/ArticlesModal'), {
    ssr: false,
});

export default function RaceGame() {

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    // const dispatch = useDispatch()

    // const userReduxState = useSelector((state) => state.auth.user_details)
    // const dev_debug = useSelector((state) => state.site.dev_debug)
    const userReduxState = false
    const dev_debug = false

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    // const params = Object.fromEntries(searchParams.entries());
    const params = useParams()
    const server = params?.server
    // const { server } = router.query

    const canvasRef = useRef(null);
    const [canvasRefContext, setCanvasRefContext] = useState(null);

    const [showInviteModal, setShowInviteModal] = useState(false)
    const [showInfoModal, setShowInfoModal] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const [activeMysterySpot, setActiveMysterySpot] = useState(false)

    const [showMenu, setShowMenu] = useState(false)

    const [audioSettings, setAudioSettings] = useState({
        enabled: false,
        volume: 0.25
    })

    const [character, setCharacter] = useLocalStorageNew("game:race-game:character", {
        model: 'Duck',
        color: '#000000'
    })

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    const [debugPanel, setDebugPanel] = useState(true);
    useHotkeys('esc', () => {
        // setDebugPanel(prev => !prev)
        // dispatch(toggleDevDebug())
        alert("Gotta fix")
    });

    const [mounted, setMounted] = useState(false)

    useEffect(() => {

        if (canvasRef && mounted) {
            setCanvasRefContext(
                canvasRef.current.getContext('2d')
            )
        }

    }, [canvasRef, mounted]);

    const canvasPlayersRef = useRef(null);
    const [canvasPlayersRefContext, setCanvasPlayersRefContext] = useState(null);

    const [roundTimer, setRoundTimer] = useState(null);

    const [players, setPlayers] = useState([]);
    const [gameState, setGameState] = useState(false)

    // const [renderMode, setRenderMode] = useState('2D');
    const [renderMode, setRenderMode] = useLocalStorageNew("game:race-game:renderMode", "2D")

    const [threeDimensionalLoaded, setThreeDimensionalLoaded] = useState(false)

    let music

    if (typeof window !== 'undefined') {
        music = new Audio(`${process.env.NEXT_PUBLIC_CDN}games/Race Game/race-game-audio-loop.mp3`);
        music.volume = audioSettings.enabled ? audioSettings.volume : 0; // Set volume based on initial state
    }

    useEffect(() => {

        if (audioSettings?.enabled) {
            music.currentTime = 0;
            music.play();

            music.onended = function () {
                console.log('audio ended');
                music.currentTime = 0;
                music.play();
            };
        }

        return () => {
            music.pause();
        };
    }, [audioSettings]);

    useEffect(() => {

        if (renderMode == "3D") {
            setThreeDimensionalLoaded(true)
        }

    }, [renderMode])

    const [boardPainted, setBoardPainted] = useState()
    function drawBoard() {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        // setCanvasRefContext(context)


        // const contextPlayers = canvasPlayers.getContext('2d')
        // setCanvasPlayersRefContext(contextPlayers)

        canvasRef.current.width = 1500;
        canvasRef.current.height = 400;



        context.fillStyle = 'rgba(0, 0, 0, .5)';
        context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Start
        context.fillStyle = 'rgb(160, 120, 73)';
        context.fillRect(1400, 0, 100, canvasRef.current.height);

        // Finish
        context.fillStyle = 'rgb(160, 120, 73)';
        context.fillRect(0, 0, 100, canvasRef.current.height);

        // context.fillStyle = '#000';
        // context.font = "60px Arial";
        // context.fillText("Start", 10, 50);

        // context.fillStyle = '#000';
        // context.font = "60px Arial";
        // context.fillText("Finish", canvas.width - 170, 50);

        // Vertical Lines
        var i;
        for (i = 100; i < 1600; i += 100) {
            context.fillStyle = 'rgb(0 0 0 / 47%)';
            context.fillRect(i, 0, 2, canvasRef.current.height);
        }

        // Horizontal Lines
        var i;
        for (i = 100; i < 400; i += 100) {
            context.fillStyle = 'rgb(0 0 0 / 47%)';
            context.fillRect(100, i, canvasRef.current.width - 200, 2);
        }

        // drawPlayer(10, 10);
        // drawPlayer(10, 110);
        // drawPlayer(10, 210);
        // drawPlayer(10, 310);

        // const context = canvasPlayersRef.current.getContext('2d')
    }
    useEffect(() => {
        if (server && mounted && !boardPainted) {
            drawBoard()
            setBoardPainted(true)
        }
    }, [server, mounted])

    useEffect(() => {

        if (server) {
            // console.log(Background)

            // drawBoard()



            socket.on('race-game-round-timer', function (msg) {
                // console.log(`Just received this message from server`);
                console.log('race-game-round-timer', msg)
                setRoundTimer(msg)

            });

            socket.on(`game:race-game-room-${server}`, function (data) {

                if (!mounted) return

                const canvasPlayers = canvasPlayersRef.current
                canvasPlayersRef.current.width = 1500;
                canvasPlayersRef.current.height = 400;

                const canvas = canvasPlayersRef.current
                const context = canvas.getContext('2d')

                // return
                console.log(`race-game-room-${server}`);

                console.log(data)

                setPlayers(data?.players || [])

                setGameState(data?.game_state)

                if (data?.game_state?.activeMysterySpot) {
                    console.log("activeMysterySpot found", data?.game_state?.activeMysterySpot)
                    setActiveMysterySpot(data?.game_state?.activeMysterySpot)
                } else {
                    setActiveMysterySpot(false)
                }

                // return

                // setRoundTimer(msg)

                // setPlayers(playersObj)

                // console.log(playersObj)

                context.clearRect(0, 0, 1500, 400);

                // msg.map(player => {
                //     drawPlayer( player.x, player.y, context )
                // })

                data?.game_state?.mystery_spots?.map(mystery_obj => {
                    drawMysterySpot(
                        (mystery_obj.x * 100),
                        (mystery_obj.y * 100),
                        context,
                        false,
                    )
                })

                data?.players.map(player_obj => {
                    drawPlayer(
                        (player_obj.race_game.x * 100),
                        (player_obj.race_game.y * 100),
                        context,
                        player_obj.id == socket.id,
                        player_obj,
                        data?.game_state?.movesShown,
                    )
                })

                // for (var id in playersObj) {
                //     var player = playersObj[id];
                //     // console.log(`${player.x} - ${player.y}`)
                //     drawPlayer(player.x, player.y, context, id == socket.id)
                // }

            });

            socket.on('race-game-round-players-picks', function (playersObj) {
                // return
                // console.log(`Just received this message from server`);
                // setRoundTimer(msg)

                // setPlayers(playersObj)

                // console.log("playersObj", playersObj)

                // console.log(playersObj)

                // context.clearRect(0, 0, 1500, 400);

                // msg.map(player => {
                //     drawPlayer( player.x, player.y, context )
                // })

                // for (var id in playersObj) {
                //     var player = playersObj[id];
                //     drawPlayerPick(player.x, player.y, context, id == socket.id)
                // }

            });

        }

        // return () => {
        //     socket.off(`game:race-game-room-${server}`);
        //     socket.off('race-game-round-timer');
        //     socket.emit('leave-room', `game:race-game-room-${server}`, {
        //         client_version: '1',
        //         game_id: server
        //     });
        // }

    }, [server, mounted]);

    useEffect(() => {

        // TODO - App Router - Double check
        if (server) {
            rejoin()
        }

        return () => {
            if (server) {
                socket.off(`game:race-game-room-${server}`);
                socket.off('race-game-round-timer');
                socket.emit('leave-room', `game:race-game-room-${server}`, {
                    client_version: '1',
                    game_id: server
                });
            }
        }

    }, [server]);

    // useEffect(() => {

    //     if (router.isReady && server) {
    //         rejoin()
    //     }

    // }, [router])

    useEffect(() => {

        setMounted(true)

    }, [])

    function drawMysterySpot(x, y, context, isSelf) {
        console.log("Drawing Player")

        context.fillStyle = '#ffc107';
        context.fillRect(x, y, 100, 100);

        context.font = "10px Arial";
        context.fillStyle = "#000";
        context.textAlign = "center";

        context.fillText(`?`, x + 50, y + 50);
    };

    function drawPlayer(x, y, context, isSelf, player_obj, movesShown) {

        console.log("Drawing Player")

        context.fillStyle = 'rgb( 255, 255, 255, .5 )';
        context.fillRect(x, y, 100, 100);

        context.font = "10px Arial";
        context.fillStyle = "#000";
        context.textAlign = "center";
        // var playerNickname = player.nickname;
        context.fillText(`${isSelf ? 'You' : (player_obj?.race_game?.nickname || '')}`, x + 50, y + 50);

        if (player_obj?.race_game?.spaces) {
            context.font = "16px Arial";
            context.fillText(`🔒`, x + 50, y + 70);
        }

        if (movesShown > 0 && player_obj?.race_game?.spaces) {
            context.font = "16px Arial";
            context.fillText(`${player_obj?.race_game?.spaces}`, x + 50, y + 30);
        }

        context.font = "10px Arial";

    };

    function inviteFriend(id) {
        console.log(`Inviting friend ${id}`)
    }

    function rejoin() {

        socket.emit('join-room', `game:race-game-room-${server}`, {
            client_version: '1',
            game_id: server,
            character,
            nickname: (localStorage.getItem('game:nickname') ? JSON.parse(localStorage.getItem('game:nickname')) : userReduxState.username),
            ...(userReduxState?.profile_photo?.location &&
                { photo_url: userReduxState.profile_photo.location }
            )
            // photo_url: 
        });

    }

    function startGame() {

        socket.emit('race-game-start', {
            server: server,
            settings: {}
        });

        generateMysterySpots()

    }

    function addBot() {

        socket.emit('game:race-game:add-bot', {
            server: server,
            settings: {}
        });

        // generateMysterySpots()

    }

    function generateMysterySpots() {
        socket.emit('race-game-generate-mystery-spots', {
            server: server,
            settings: {}
        });
    }

    function move(spaces) {
        socket.emit('race-game-player-move', {
            server: server,
            spaces: spaces
        });
    }

    useHotkeys('1', () => move(1));
    useHotkeys('2', () => move(2));
    useHotkeys('3', () => move(3));
    useHotkeys('4', () => move(4));

    const [cameraUpdate, setCameraUpdate] = useState(false)

    const [cameraState, setCameraState] = useState({ position: [0, 0, 5] });

    // Handle camera change event
    const handleCameraChange = (event) => {
        setCameraState(event);
    };

    return (

        <>
            {mounted &&
                <div className={`race-game-game-page ${isFullscreen && 'fullscreen'}`} id={'race-game-game-page'}>

                    {showInviteModal &&
                        <InviteModal
                            show={showInviteModal}
                            setShow={setShowInviteModal}
                        />
                    }

                    {showInfoModal &&
                        <InfoModal
                            show={showInfoModal}
                            setShow={setShowInfoModal}
                        />
                    }

                    {showSettingsModal &&
                        <SettingsModal
                            show={showSettingsModal}
                            setShow={setShowSettingsModal}
                        />
                    }

                    {(activeMysterySpot?.timer >= 0) &&
                        <ArticlesModal
                            show={(activeMysterySpot?.timer >= 0)}
                            setShow={setActiveMysterySpot}
                            title="Mystery Spot!"
                            disableClose
                        // action={(setShowModal) => {
                        //     saveDocument(setShowModal)
                        // }}
                        // actionText={'Save'}
                        >
                            <div>

                                <div className='mb-2'>{`${activeMysterySpot?.player?.race_game?.nickname || activeMysterySpot?.player?.user_id} landed on a mystery spot!`}</div>

                                <div className='fw-bold mb-3'>{`${activeMysterySpot?.player?.race_game?.nickname || activeMysterySpot?.player?.user_id} goes ${activeMysterySpot?.action?.direction} ${activeMysterySpot?.action?.spaces} spaces!`}</div>

                                <div className='text-muted'>{`Continuing in ${activeMysterySpot?.timer}...`}</div>

                            </div>
                        </ArticlesModal>
                    }

                    <img
                        className="background"
                        src={`${`${process.env.NEXT_PUBLIC_CDN}games/Race Game/background.jpg`}`}
                    >

                    </img>

                    {/* {showMenu &&
                    <div>
    
                    </div>
                } */}

                    <div className={`menu-card card card-articles ${showMenu && 'show'}`}>

                        <div className="card-body p-2 mt-auto d-flex flex-column">

                            <div className='d-flex flex-column mb-2 mt-auto'>

                                <div className='flex-header bg-dark text-white p-1 mb-2'>
                                    <span>Room : {server}</span>
                                    {gameState.status == 'In Lobby' &&
                                        <span className='text-danger'>In Lobby | Need Players</span>
                                    }
                                    {gameState.status == 'In Progress' &&
                                        <span className='text-success'>In Progress | Pick Space</span>
                                    }
                                </div>

                                <ArticlesButton
                                    small
                                    className="w-100 mb-2"
                                    // active={}
                                    disabled={
                                        players.length < 2
                                        ||
                                        gameState.status == 'In Progress'
                                    }
                                    onClick={() => {

                                    }}
                                >
                                    <i className="fad fa-play"></i>
                                    <span>Start Game</span>
                                    <span className="badge bg-dark ms-2">
                                        {players?.length || 0} / 2+
                                    </span>
                                </ArticlesButton>

                                <div className='mb-2'>
                                    {/* <Link
                                        className=""
                                        href={ROUTES.RACE_GAME}
                                    >
                                        <ArticlesButton
                                            small
                                            className='w-50'
                                        >
                                            <i className="fad fa-sign-out fa-rotate-180"></i>
                                            Leave Game
                                        </ArticlesButton>
                                    </Link> */}

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

                                <div className='d-flex'>
                                    <ArticlesButton
                                        small
                                        className="w-50 mb-2"
                                        onClick={() => {
                                            setShowInfoModal({
                                                game: 'Race Game'
                                            })
                                        }}
                                    >
                                        <i className="fad fa-info-circle"></i>
                                        Info
                                    </ArticlesButton>

                                    <ArticlesButton
                                        small
                                        className="w-50 mb-2"
                                        onClick={() => {
                                            setShowSettingsModal({
                                                game: 'Race Game'
                                            })
                                        }}
                                    >
                                        <i className="fad fa-cog"></i>
                                        Settings
                                    </ArticlesButton>
                                </div>

                            </div>

                            <hr className='my-2' />

                            <div className='d-flex flex-column flex-lg-row'>

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
                                                    variant="warning"
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
                            </IsDev>

                        </div>

                        {dev_debug &&
                            <div className="card rounded-0 p-2 m-2">

                                <div><b className='mb-3'>Debug Info</b></div>

                                <div className="small">
                                    Push esc key to toggle
                                </div>

                                <hr className='my-4' />

                                <div><b className="mb-0">Players</b></div>

                                {players.map((obj, index) => (
                                    <div key={obj.id}>
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
                        }

                    </div>

                    <div className='game-content'>

                        {gameState?.status == "In Lobby" &&
                            <div className="lobby-screen">

                                <div className="lobby-screen-blur"></div>

                                <div className="lobby-card">

                                    <div className="card card-articles w-100">

                                        <div className="card-header  py-3 d-flex flex-column justify-content-center align-items-center">

                                            <div
                                                style={{ height: '150px', position: 'relative' }}
                                                className='d-flex justify-content-center w-100 mb-3'
                                            >
                                                <div style={{ width: '150px', height: '150px', position: 'relative' }}>
                                                    <QRCodeCanvas
                                                        value={`https://articles.media/community/games/race-game/${server}`}
                                                        className=''

                                                        size={150}
                                                    />
                                                </div>
                                            </div>

                                            <div className='mb-2'>
                                                <i style={{ fontSize: '1.75rem' }} className="fad fa-hourglass fa-spin"></i>
                                            </div>

                                            <b className="mb-0">Waiting on more players | {players.length}/4</b>
                                            <small>Need at least 2 players to start.</small>

                                        </div>

                                        <div className='card-body py-1 d-flex flex-column justify-content-center align-items-center'>

                                            {players.find(player => player.id == socket.id) ?
                                                <div className='d-flex flex-column' style={{ minWidth: '200px' }}>

                                                    {gameState?.players?.map((item, item_i) => {

                                                        let player_lookup = players.find(player => player.id == item)

                                                        return (
                                                            <div
                                                                key={item_i}
                                                                className='d-flex align-items-center mb-1'
                                                            >
                                                                <div
                                                                    style={{
                                                                        width: '30px',
                                                                        height: '30px'
                                                                    }}
                                                                    className='bg-dark m-1'
                                                                ></div>

                                                                <div>

                                                                    <div className='small'>
                                                                        {player_lookup?.race_game?.nickname || player_lookup?.user_id}
                                                                    </div>

                                                                    <div className='small'>
                                                                        {item == "Bot" && "Bot"}
                                                                    </div>

                                                                    {item !== socket.id ?
                                                                        <div className="badge bg-danger badge-hover">
                                                                            Remove
                                                                        </div>
                                                                        :
                                                                        <div className="badge bg-black">
                                                                            Game Leader
                                                                        </div>
                                                                    }

                                                                    {/* {item.user_id &&
                                                                        <div className='small'>
                                                                            <div className='small'>
                                                                                {item.id}
                                                                            </div>
                                                                        </div>
                                                                    } */}

                                                                </div>
                                                            </div>

                                                        )
                                                    })}

                                                    {[...Array((4 - gameState?.players?.length))].map(item => {
                                                        return (
                                                            <div
                                                                key={item}
                                                                style={{
                                                                    width: '30px',
                                                                    height: '30px'
                                                                }}
                                                                className='bg-light border-dark m-1'
                                                            >

                                                            </div>
                                                        )
                                                    })}

                                                </div>
                                                :
                                                <div>

                                                    <div className='alert alert-danger mb-0 mt-2' style={{ fontSize: '0.8rem' }}>
                                                        You are not playing, please wait for next game or find another lobby.
                                                    </div>

                                                    <div>

                                                        <ArticlesButton
                                                            onClick={() => rejoin()}
                                                            className="d-block mx-auto mt-2"
                                                        >
                                                            Reconnect
                                                        </ArticlesButton>

                                                    </div>

                                                </div>
                                            }

                                        </div>

                                        <div className='card-footer d-flex p-2'>

                                            {false &&
                                                <Dropdown className="notification-badge d-flex w-50">

                                                    <Dropdown.Toggle variant='articles w-100 d-flex align-items-center'>
                                                        Invite Friends
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu className="">

                                                        {userReduxState?.friends?.map((friend, i) => {
                                                            return <Dropdown.Item key={friend.id} onClick={() => inviteFriend(friend.id)} className="" eventKey={i}>
                                                                <i className="fad fa-user" aria-hidden="true"></i>
                                                                {friend.nickname}
                                                            </Dropdown.Item>
                                                        })}

                                                    </Dropdown.Menu>

                                                </Dropdown>
                                            }

                                            <ArticlesButton
                                                onClick={() => {
                                                    setShowInviteModal({
                                                        type: 'Game',
                                                        game_name: 'Race Game',
                                                        server_id: server
                                                    })
                                                }}
                                                disabled={gameState?.players?.length >= 4}
                                                className="d-flex justify-content-center align-items-center w-50"
                                            >
                                                Invite
                                                <i className="fad fa-paper-plane fa-lg ms-2 me-0"></i>
                                            </ArticlesButton>

                                            <ArticlesButton
                                                onClick={() => {
                                                    addBot()
                                                }}
                                                disabled={gameState?.players?.length >= 4}
                                                className="d-flex justify-content-center align-items-center w-50"
                                            >
                                                Add Bot
                                                <i className="fad fa-robot fa-lg ms-2 me-0"></i>
                                            </ArticlesButton>

                                            <ArticlesButton
                                                onClick={() => startGame()}
                                                className="d-flex justify-content-center align-items-center w-50"
                                                // disabled={Object.keys(players).length < 2}
                                                disabled={gameState?.players?.length < 2}
                                            >
                                                Start Game
                                                <i className="fad fa-arrow-alt-square-right fa-lg ms-2 me-0"></i>
                                            </ArticlesButton>

                                        </div>

                                    </div>

                                </div>

                            </div>
                        }

                        {/* Not really needed, visible in 2d but not 3d? */}
                        {/* <div
                            className="card card-articles text-center d-none d-lg-block"
                            style={{
                                position: 'absolute',
                                top: '1rem'
                            }}
                        >
                            <div className="card-body p-2">
                                <h5 className='mb-0'>Articles Media</h5>
                                <h1 className='mb-0'>Race Game</h1>
                            </div>
                        </div> */}

                        {(renderMode == "3D" || renderMode == "Both" || threeDimensionalLoaded) &&
                            <div className={`canvas-three-wrap ${renderMode !== "3D" && 'd-none'}`}>

                                <Suspense>
                                    <GameCanvas
                                        cameraState={cameraState}
                                        handleCameraChange={handleCameraChange}
                                        // cameraState={cameraState}
                                        gameState={gameState}
                                        players={players}
                                        move={move}
                                        cameraUpdate={cameraUpdate}
                                        setCameraUpdate={setCameraUpdate}
                                    // cameraState={cameraState}
                                    />
                                </Suspense>

                            </div>
                        }

                        <div className={`canvas-flat-wrap ${renderMode == '3D' && 'd-none'}`}>
                            <canvas onClick={(e) => console.log(e)} className='fill' ref={canvasRef}></canvas>
                            <canvas onClick={(e) => {
                                const canvas = canvasPlayersRef.current;
                                const rect = canvas.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;

                                console.log(`Clicked at coordinates: (${x}, ${y})`);
                            }} ref={canvasPlayersRef}></canvas>
                        </div>

                        <div className='info-controls card card-articles'>

                            <ArticlesButton
                                className={'d-lg-none'}
                                active={showMenu}
                                onClick={() => {
                                    setShowMenu(prev => !prev)
                                }}
                            >
                                Menu
                            </ArticlesButton>

                            <div className="timer">

                                <i style={{ fontSize: '1.75rem' }} className="fad fa-alarm-clock"></i>

                                {gameState?.status == "In Lobby" && <h5 className="mb-0">{"In Lobby"}</h5>}
                                {gameState?.status == "In Progress" && <h5 className="mb-0">{gameState?.time}</h5>}

                            </div>

                            <div className='small'>

                                <div className='d-flex'>
                                    <div className='me-2'>X: {cameraState?.position?.x?.toFixed(2)}</div>
                                    <div className='me-2'>Y: {cameraState?.position?.y?.toFixed(2)}</div>
                                    <div>Z: {cameraState?.position?.z?.toFixed(2)}</div>
                                </div>

                                <div className='d-flex'>
                                    <div className='me-2'>X: {cameraState?.rotation?.x.toFixed(2)}</div>
                                    <div className='me-2'>Y: {cameraState?.rotation?.y.toFixed(2)}</div>
                                    <div>Z: {cameraState?.rotation?.z.toFixed(2)}</div>
                                </div>

                            </div>

                            <div>
                                {players.find(player => player.id == socket.id) &&

                                    <div className="buttons">

                                        {[1, 2, 3, 4].map(space => {

                                            let active = players.find(player => player.id == socket.id).race_game?.spaces == space

                                            return (
                                                <ArticlesButton
                                                    key={space}
                                                    disabled={
                                                        players.find(player => player.id == socket.id).race_game?.pickedSpace
                                                        ||
                                                        players.find(player => player.id == socket.id).race_game?.x >= 1400
                                                    }
                                                    active={active}
                                                    onClick={() => {
                                                        move(space)
                                                    }}
                                                    className={`${active && 'bg-dark'}`}
                                                >
                                                    <span>{(space)}</span>
                                                    <span className='d-none d-lg-inline-block ms-2'>Space</span>
                                                </ArticlesButton>
                                            )
                                        })}

                                    </div>

                                }
                            </div>

                        </div>

                    </div>

                </div>
            }
        </>

    );
}