"use client"
import Box from "@mui/material/Box";
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AlarmIcon from "@mui/icons-material/Alarm";
import { useEffect, useState, Suspense, useMemo } from 'react';

import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic'

// import { useSelector, useDispatch } from 'react-redux'


import { useHotkeys } from 'react-hotkeys-hook';

// import ROUTES from 'components/constants/routes'

import { QRCodeCanvas } from 'qrcode.react';

// import { toggleDevDebug } from '@/redux/actions/siteActions';
// import Link from 'next/link';

import ArticlesButton from '@/components/UI/Button';

import useFullscreen from '@/hooks/useFullScreen';
import { useSocketStore } from '@/hooks/useSocketStore';
// import usePeerConnection from '@/components/hooks/usePeerConnection';

import { useStore } from '@/hooks/useStore';
import useCameraStore from '@/hooks/useCameraStore';
import useGameStore from '@/hooks/useGameStore';


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

// const InviteModal = dynamic(
//     () => import('@/components/UI/InviteModal'),
//     { ssr: false }
// )

// const InfoModal = dynamic(
//     () => import('@/components/UI/InfoModal'),
//     { ssr: false }
// )

// const SettingsModal = dynamic(
//     () => import('@/components/UI/SettingsModal'),
//     { ssr: false }
// )

const ArticlesModal = dynamic(() => import('@/components/UI/ArticlesModal'), {
    ssr: false,
});

const WinnerModal = dynamic(() => import('@/components/UI/WinnerModal'), {
    ssr: false,
});

export default function RaceGame() {

    const socket = useSocketStore((state) => state.socket);

    // const dispatch = useDispatch()

    // const userReduxState = useSelector((state) => state.auth.user_details)
    const userReduxState = false

    // const router = useRouter()
    // const pathname = usePathname()
    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    // const server = searchParamsObject?.server_id
    const {
        server,
        server_type,
        roomPlay,
    } = searchParamsObject
    // const { server } = router.query

    const [showInviteModal, setShowInviteModal] = useState(false)
    // const [showInfoModal, setShowInfoModal] = useState(false)
    // const [showSettingsModal, setShowSettingsModal] = useState(false)

    // const [activeMysterySpot, setActiveMysterySpot] = useState(false)

    const nickname = useStore((state) => state?.nickname);
    const character = useStore((state) => state?.character);
    // const showMenu = useStore((state) => state?.showMenu);
    // const setShowMenu = useStore((state) => state?.setShowMenu);
    // const sidebar = useStore((state) => state?.sidebar);
    // const [showMenu, setShowMenu] = useState(false)

    // const [audioSettings, setAudioSettings] = useState({
    //     enabled: false,
    //     volume: 0.25
    // })

    // const [character, setCharacter] = useLocalStorageNew("game:race-game:character", {
    //     model: 'Duck',
    //     color: '#000000'
    // })

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    const [debugPanel, setDebugPanel] = useState(true);
    useHotkeys('esc', () => {
        alert("Gotta fix")
    });

    const [mounted, setMounted] = useState(false)

    const [roundTimer, setRoundTimer] = useState(null);

    // const [players, setPlayers] = useState([]);

    const isHost = useGameStore((state) => state.isHost);
    const gameState = useGameStore((state) => state?.gameState);
    const activeMysterySpot = useGameStore((state) => state?.gameState?.activeMysterySpot);
    const setGameState = useGameStore((state) => state?.setGameState);
    const players = useGameStore((state) => state?.gameState?.players);
    const createBot = useGameStore((state) => state?.createBot);

    const myId = useGameStore((state) => state?.myId);
    const sendToHost = useGameStore((state) => state?.sendToHost);
    const startGame = useGameStore((state) => state.startGame);
    const removeConnection = useGameStore((state) => state.removeConnection);
    const removeBot = useGameStore((state) => state.removeBot);
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

        socket.emit('join-room', `game:race-game-room-${server}`, {
            client_version: '1',
            game_id: server,
            character,
            nickname: nickname,
            ...(userReduxState?.profile_photo?.location &&
                { photo_url: userReduxState.profile_photo.location }
            )
            // photo_url: 
        });

    }

    function prepareGame() {

        if (server_type == "online-peer") {

            if (isHost) {
                startGame()
            } else {
                // TODO - Let client start game
            }


        }

        if (server_type == "online-socket") {

            socket.emit('race-game-start', {
                server: server,
                settings: {}
            });

            // generateMysterySpots()

        }

    }

    function addBot() {

        if (
            server_type == "online-peer"
        ) {
            createBot()
        }

        if (server_type == "online-socket") {
            socket.emit('game:race-game:add-bot', {
                server: server,
                settings: {}
            });
        }

        // generateMysterySpots()

    }

    function generateMysterySpots() {
        socket.emit('race-game-generate-mystery-spots', {
            server: server,
            settings: {}
        });
    }

    function move(spaces) {

        if (
            (server_type == "online-peer" && isHost === false)
        ) {

            sendToHost({
                event: 'PlayerMove',
                spaces: spaces
            })

        }

        // Online peer host handles their moves directly
        if (
            server_type == "online-peer"
            &&
            isHost === true
        ) {

            console.log("online-peer PlayerMove data received", spaces);

            let tempPlayers = gameState.players;

            const newPlayers = tempPlayers.map(player => {
                if (player.peer === myId) {
                    return {
                        ...player,
                        spaces: spaces,
                        race_game: {
                            ...player.race_game,
                            spaces: spaces
                        }
                    };
                }
                return player;
            });

            setGameState({
                ...gameState,
                players: newPlayers
            })

            // set({
            //     gameState: {
            //         ...gameState,
            //         players: newPlayers
            //     }
            // });

        }

        if (server_type == "online-socket") {

            socket.emit('race-game-player-move', {
                server: server,
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

    const showRoomPlayMoveButtons = useMemo(() => {

        return (
            server_type == "room-play"
            &&
            !isHost
            &&
            gameState?.roomPlayClientRender == false
        ) ? true : false

    }, [server_type, gameState, isHost]);

    const shareLink = mounted ? `${window?.location?.host}/play?server_type=${server_type}&server=${isHost ? myId : server}` : '';

    return (
        <Box
            id="race-game-game-page"
            sx={{
                position: 'relative', flexGrow: 1, display: 'flex', justifyContent: 'center',
                flexDirection: 'column', minHeight: '100vh', '--top-position': '0px',
                '@media (min-width: 992px)': { flexDirection: 'row' },
            }}
        >
            {activeMysterySpot?.timer >= 0 && (
                <ArticlesModal show setShow={() => {}} title="Mystery Spot!" disableClose>
                    <Box>
                        <Box sx={{ mb: 1 }}>{activeMysterySpot?.mysterySpot?.target} - {activeMysterySpot?.mysterySpot?.spaces}</Box>
                        <Box sx={{ mb: 1 }}>{`${activeMysterySpot?.player?.race_game?.nickname || activeMysterySpot?.player?.user_id} landed on a mystery spot!`}</Box>
                        <Box sx={{ fontWeight: 700, mb: 2 }}>{`${activeMysterySpot?.player?.race_game?.nickname || activeMysterySpot?.player?.user_id} goes ${activeMysterySpot?.action?.direction} ${activeMysterySpot?.action?.spaces} spaces!`}</Box>
                        <Box sx={{ color: 'text.secondary' }}>{`Continuing in ${activeMysterySpot?.timer}...`}</Box>
                    </Box>
                </ArticlesModal>
            )}
            {gameState?.winner && <WinnerModal />}
            <Box
                component="img"
                src={`${process.env.NEXT_PUBLIC_CDN}games/Race Game/background.jpg`}
                alt=""
                sx={{ backgroundSize: 'cover', objectFit: 'cover', backgroundPosition: 'center', position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
            />
            <GameMenu />
            <Box sx={{ zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'relative', height: 'calc(100vh - var(--top-position))' }}>
                {gameState?.status === 'In Lobby' && (
                    <Box sx={{ position: 'absolute', right: '1rem', bottom: 'calc(50px + 1rem)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', zIndex: 2, maxWidth: 'calc(100% - 2rem)' }}>
                        <Box
                            sx={{
                                boxShadow: '0 0 0 1px rgba(0,0,0,0.25), 0 2px 3px rgba(0,0,0,0.2)',
                                maxWidth: 350, flexGrow: 1, width: '100%', mx: 'auto', mt: 2, zIndex: 5,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                                '@media (min-width: 992px)': { mt: 'auto', mb: 'auto' },
                            }}
                        >
                            <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', minWidth: 0, bgcolor: 'game.card', color: 'text.primary', border: '1px solid', borderColor: 'divider', borderRadius: '0.375rem', width: '100%' }}>
                                <Box sx={{ px: 2, py: 2, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', height: 200, position: 'relative', mb: 2 }}>
                                        <Box sx={{ width: 200, height: 200, position: 'relative' }}>
                                            {mounted && <QRCodeCanvas value={shareLink} size={200} />}
                                        </Box>
                                    </Box>
                                    <Box sx={{ mb: 1 }}>
                                        <HourglassEmptyIcon sx={{ fontSize: '1.75rem', animation: 'waiting-spin 2s linear infinite', '@keyframes waiting-spin': { to: { transform: 'rotate(360deg)' } } }} />
                                    </Box>
                                    <b>Waiting on more players</b>
                                    <small>Need at least 2 players to start.</small>
                                    <small>Plays best with 4 players.</small>
                                    <small>Up to 100 players supported!</small>
                                </Box>
                                <Box sx={{ flex: '1 1 auto', px: 2, py: 0.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    {((server_type === 'online-socket' && players.find((player) => player.id == socket.id)) || (server_type === 'online-peer' && gameState?.players?.length > 0)) ? (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 200 }}>
                                            {gameState?.players?.map((item, index) => {
                                                let playerLookup = null;
                                                if (server_type === 'online-socket') playerLookup = players?.find((player) => player.id == item);
                                                if (server_type === 'online-peer') playerLookup = item;

                                                return (
                                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                        <Box sx={{ width: 30, height: 30, bgcolor: '#212529', m: 0.5 }} />
                                                        <Box>
                                                            <Box sx={{ fontSize: '0.875em' }}>{item?.nickname}</Box>
                                                            <Box sx={{ fontSize: '0.875em' }}>
                                                                {playerLookup?.bot && <Chip size="small" icon={<SmartToyIcon />} label="Bot" sx={{ bgcolor: '#000', color: '#fff', '& .MuiChip-icon': { color: 'inherit' } }} />}
                                                                {((item !== socket.id && server_type === 'online-socket') || server_type === 'online-peer') ? (
                                                                    <Box
                                                                        component="button"
                                                                        onClick={() => {
                                                                            // Socket removal still follows the existing peer removal handler.
                                                                            if (item.bot) removeBot(item.peer);
                                                                            else removeConnection(item.peer);
                                                                        }}
                                                                        sx={{ display: 'inline-flex', alignItems: 'center', px: '0.65em', py: '0.35em', fontSize: '0.75em', fontWeight: 700, lineHeight: 1, border: 0, borderRadius: '0.375rem', color: '#fff', bgcolor: 'error.main', cursor: 'pointer', opacity: 0.8, transition: 'opacity 200ms', '&:hover': { opacity: 1 } }}
                                                                    >
                                                                        Remove
                                                                    </Box>
                                                                ) : <Chip size="small" label="Game Leader" sx={{ bgcolor: '#000', color: '#fff' }} />}
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                );
                                            })}
                                            {gameState?.players?.length < 4 && Array.from({ length: 4 - gameState.players.length }, (_, index) => (
                                                <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box sx={{ width: 30, height: 30, bgcolor: '#f8f9fa', border: '1px solid #212529', m: 0.5 }} />
                                                    <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.875em' }}>Available spot</Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Box>
                                            <Alert severity="error" sx={{ mb: 0, mt: 1, fontSize: '0.8rem' }}>
                                                You are not playing, please wait for next game or find another lobby.
                                            </Alert>
                                            <ArticlesButton onClick={rejoin} sx={{ display: 'block', mx: 'auto', mt: 1 }}>Reconnect</ArticlesButton>
                                        </Box>
                                    )}
                                </Box>
                                <Box sx={{ display: 'flex', p: 1, bgcolor: 'action.hover', borderTop: '1px solid', borderColor: 'divider' }}>
                                    <ArticlesButton sx={{ width: '50%' }} onClick={() => window.navigator.clipboard.writeText(shareLink)} startIcon={<ContentCopyIcon />}>
                                        Invite Link
                                    </ArticlesButton>
                                    <ArticlesButton sx={{ width: '50%' }} onClick={addBot} endIcon={<SmartToyIcon />}>Add Bot</ArticlesButton>
                                    {isHost && server_type === 'online-peer' && <ArticlesButton sx={{ width: '50%' }} onClick={prepareGame} endIcon={<ArrowForwardIcon />}>Start Game</ArticlesButton>}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                )}
                {showRoomPlayMoveButtons ? <RoomPlayMoveButtons move={move} /> : (
                    <>
                        {(renderMode === '3D' || renderMode === 'Both') && (
                            <Box sx={{ display: renderMode === '3D' ? 'block' : 'none', border: '1px solid #000', bgcolor: '#fff', mb: '3rem', position: 'absolute', left: 0, top: 0, height: 'calc(100vh - 50px - var(--top-position))', width: '100%', '& canvas': { height: '100%', width: '100%' } }}>
                                <Suspense><GameCanvas move={move} /></Suspense>
                            </Box>
                        )}
                        {(renderMode === '2D' || renderMode === 'Both') && <Suspense><GameCanvasFlat /></Suspense>}
                    </>
                )}
            </Box>
            <InfoControls showRoomPlayMoveButtons={showRoomPlayMoveButtons} move={move} />
        </Box>
    );
}

function InfoControls({ showRoomPlayMoveButtons, move }) {
    const showMenu = useStore((state) => state.showMenu);
    const setShowMenu = useStore((state) => state.setShowMenu);
    const sidebar = useStore((state) => state.sidebar);
    const debug = useStore((state) => state.debug);
    const cameraState = useCameraStore((state) => state.cameraState);
    const gameState = useGameStore((state) => state.gameState);

    return (
        <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 50, px: 1, zIndex: 2, borderRadius: 0, minWidth: 0, bgcolor: 'game.card', color: 'text.primary', border: '1px solid', borderColor: 'divider', '@media (min-width: 992px)': { position: 'absolute' } }}>
            <ArticlesButton active={showMenu} onClick={() => setShowMenu(!showMenu)} sx={{ '@media (min-width: 992px)': { display: sidebar ? 'none' : 'inline-flex' } }}>Menu</ArticlesButton>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AlarmIcon sx={{ fontSize: '1.75rem', mr: '0.2rem' }} />
                {gameState?.status === 'In Lobby' && <Box component="h5" sx={{ m: 0, fontSize: '1.25rem', fontWeight: 500 }}>In Lobby</Box>}
                {gameState?.status === 'In Progress' && <Box component="h5" sx={{ m: 0, fontSize: '1.25rem', fontWeight: 500 }}>{gameState?.time}</Box>}
                {gameState?.status === 'In Progress' && gameState?.movesShown !== 0 && <Chip size="small" label={gameState?.movesShown} sx={{ ml: 1, bgcolor: '#212529', color: '#fff' }} />}
            </Box>
            <Box sx={{ fontSize: '0.875em', display: 'none', '@media (min-width: 992px)': { display: 'block' } }}>
                {debug && (
                    <>
                        <Box sx={{ display: 'flex' }}>
                            <Box sx={{ mr: 1 }}>X: {cameraState?.position?.x?.toFixed(2)}</Box>
                            <Box sx={{ mr: 1 }}>Y: {cameraState?.position?.y?.toFixed(2)}</Box>
                            <Box>Z: {cameraState?.position?.z?.toFixed(2)}</Box>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            <Box sx={{ mr: 1 }}>X: {cameraState?.rotation?.x.toFixed(2)}</Box>
                            <Box sx={{ mr: 1 }}>Y: {cameraState?.rotation?.y.toFixed(2)}</Box>
                            <Box>Z: {cameraState?.rotation?.z.toFixed(2)}</Box>
                        </Box>
                    </>
                )}
            </Box>
            {!showRoomPlayMoveButtons && <MoveButtons move={move} />}
        </Box>
    );
}

function MoveButtons({ move, roomPlayControls = false }) {
    const socket = useSocketStore((state) => state.socket);
    const searchParams = useSearchParams();
    const server_type = searchParams.get('server_type');
    const roomPlay = searchParams.get('roomPlay');
    const isHost = useGameStore((state) => state.isHost);
    const gameState = useGameStore((state) => state.gameState);
    const players = useGameStore((state) => state.gameState?.players);
    const myId = useGameStore((state) => state.myId);

    if (gameState?.status !== 'In Progress') return null;

    return (
        <Box>
            {(players.find((player) => player.id == socket.id) || myId) && (
                <Box sx={{ display: isHost && roomPlay ? 'none' : 'flex', ...(roomPlayControls && { width: 300, flexDirection: 'column' }) }}>
                    {[1, 2, 3, 4, ...(process.env.NODE_ENV === 'development' ? [gameState?.boardLength] : [])].map((space) => {
                        let active;
                        if (server_type === 'online-peer') active = players.find((player) => player.peer == myId)?.spaces == space;
                        if (server_type === 'online-socket') active = players.find((player) => player.id == socket.id)?.race_game?.spaces == space;
                        return (
                            <ArticlesButton
                                key={space}
                                disabled={gameState?.movesShown > 0 || players.find((player) => player.id == socket.id)?.race_game?.pickedSpace}
                                active={active}
                                onClick={() => move(space)}
                                sx={roomPlayControls ? { p: '0.5rem', fontSize: '1.5rem !important' } : undefined}
                            >
                                <span>{space}</span>
                                <Box component="span" sx={{ display: 'none', ml: 1, '@media (min-width: 992px)': { display: 'inline-block' } }}>Space</Box>
                            </ArticlesButton>
                        );
                    })}
                </Box>
            )}
        </Box>
    );
}

function RoomPlayMoveButtons({ move }) {
    return <Box><MoveButtons move={move} roomPlayControls /></Box>;
}
