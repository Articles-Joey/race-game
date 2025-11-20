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
// import Link from 'next/link';

import ArticlesButton from '@/components/UI/Button';

import useFullscreen from '@/components/hooks/useFullScreen';
import { useLocalStorageNew } from '@/components/hooks/useLocalStorageNew';
import IsDev from '@/components/UI/IsDev';
import { useSocketStore } from '@/components/hooks/useSocketStore';
// import usePeerConnection from '@/components/hooks/usePeerConnection';

import { useStore } from '@/components/hooks/useStore';
import useCameraStore from '@/components/hooks/useCameraStore';
import useGameStore from '@/components/hooks/useGameStore';

// import GameCanvasFlat from '@/components/Game/GameCanvasFlat';
const GameCanvasFlat = dynamic(() => import('@/components/Game/GameCanvasFlat'), {
    ssr: false,
});

// import GameMenu from '@/components/UI/GameMenu';
const GameMenu = dynamic(() => import('@/components/UI/GameMenu'), {
    ssr: false,
});

const KickedModal = dynamic(() => import('@/components/UI/KickedModal'), {
    ssr: false,
});

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
    const userReduxState = false

    // const router = useRouter()
    // const pathname = usePathname()
    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    // const server = searchParamsObject?.server_id
    const { server_id, server_type } = searchParamsObject
    // const { server } = router.query

    const [showInviteModal, setShowInviteModal] = useState(false)
    const [showInfoModal, setShowInfoModal] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const [activeMysterySpot, setActiveMysterySpot] = useState(false)

    const showMenu = useStore((state) => state?.showMenu);
    const setShowMenu = useStore((state) => state?.setShowMenu);
    // const [showMenu, setShowMenu] = useState(false)

    // const [audioSettings, setAudioSettings] = useState({
    //     enabled: false,
    //     volume: 0.25
    // })

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

    const [mounted, setMounted] = useState(true)

    const [roundTimer, setRoundTimer] = useState(null);

    // const [players, setPlayers] = useState([]);

    const gameState = useGameStore((state) => state?.gameState);
    const players = useGameStore((state) => state?.gameState?.players);

    const myId = useGameStore((state) => state?.myId);
    const sendToHost = useGameStore((state) => state?.sendToHost);
    // const [gameState, setGameState] = useState(false)

    // const [renderMode, setRenderMode] = useState('2D');
    const renderMode = useStore((state) => state?.renderMode);
    // const [renderMode, setRenderMode] = useLocalStorageNew("game:race-game:renderMode", "2D")

    useEffect(() => {
        setMounted(true)
    }, [])

    function inviteFriend(id) {
        console.log(`Inviting friend ${id}`)
    }

    function rejoin() {

        socket.emit('join-room', `game:race-game-room-${server_id}`, {
            client_version: '1',
            game_id: server_id,
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
            server: server_id,
            settings: {}
        });

        generateMysterySpots()

    }

    function addBot() {

        socket.emit('game:race-game:add-bot', {
            server: server_id,
            settings: {}
        });

        // generateMysterySpots()

    }

    function generateMysterySpots() {
        socket.emit('race-game-generate-mystery-spots', {
            server: server_id,
            settings: {}
        });
    }

    function move(spaces) {

        if (server_type == "room-play") {

            sendToHost({
                event: 'PlayerMove',
                spaces: spaces
            })

        }

        if (server_type == "online-socket") {

            socket.emit('race-game-player-move', {
                server: server_id,
                spaces: spaces
            });

        }

    }

    useHotkeys('1', () => move(1));
    useHotkeys('2', () => move(2));
    useHotkeys('3', () => move(3));
    useHotkeys('4', () => move(4));

    const cameraUpdate = useCameraStore((state) => state?.cameraUpdate);
    const setCameraUpdate = useCameraStore((state) => state?.setCameraUpdate);
    const cameraState = useCameraStore((state) => state?.cameraState);
    const setCameraState = useCameraStore((state) => state?.setCameraState);

    // const [cameraUpdate, setCameraUpdate] = useState(false)
    // const [cameraState, setCameraState] = useState({ position: [0, 0, 5] });

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

                    <GameMenu
                    // Causes non stop remounts for some reason
                    // {...{
                    //     isFullscreen,
                    //     requestFullscreen,
                    //     exitFullscreen
                    // }}
                    />

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
                                                        value={`https://race-game.articles.media/${server_id}`}
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
                                                        server_id: server_id
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
                                            // disabled={gameState?.players?.length < 2}
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

                        {(renderMode == "3D" || renderMode == "Both") &&
                            <div className={`canvas-three-wrap ${renderMode !== "3D" && 'd-none'}`}>

                                <Suspense>
                                    <GameCanvas
                                        // cameraState={cameraState}
                                        // handleCameraChange={handleCameraChange}
                                        // cameraState={cameraState}
                                        // gameState={gameState}
                                        // players={players}
                                        move={move}
                                    // cameraUpdate={cameraUpdate}
                                    // setCameraUpdate={setCameraUpdate}
                                    // cameraState={cameraState}
                                    />
                                </Suspense>

                            </div>
                        }

                        {/* <GameCanvasFlat /> */}

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
                                {
                                    (
                                        players.find(player => player.id == socket.id)
                                        ||
                                        (myId)
                                        // TODO - Prevent on room play host
                                    )
                                    &&

                                    <div className="buttons">

                                        {[1, 2, 3, 4].map(space => {

                                            let active

                                            if (server_type == "room-play") {
                                                // Old socket structure of nested race_game, rather this just be gone
                                                // active = players.find(player => player.peer == myId)?.race_game?.spaces == space
                                                active = players.find(player => player.peer == myId)?.spaces == space
                                                // active = true
                                            }

                                            if (server_type == "online-socket") {
                                                active = players.find(player => player.id == socket.id)?.race_game?.spaces == space
                                            }                                            

                                            return (
                                                <ArticlesButton
                                                    key={space}
                                                    disabled={
                                                        gameState?.movesShown > 0
                                                        ||
                                                        players.find(player => player.id == socket.id)?.race_game?.pickedSpace
                                                        // ||
                                                        // players.find(player => player.id == socket.id)?.race_game?.x >= 1400
                                                    }
                                                    active={active}
                                                    onClick={() => {
                                                        move(space)
                                                    }}
                                                    // className={``}
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