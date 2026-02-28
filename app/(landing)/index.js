"use client"
import { useEffect, useContext, useState, Suspense } from 'react';

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// import GameScoreboard from '@articles-media/articles-dev-box/GameScoreboard';
import Ad from '@articles-media/articles-dev-box/Ad';
import useUserDetails from '@articles-media/articles-dev-box/useUserDetails';
import useUserToken from '@articles-media/articles-dev-box/useUserToken';

// import { useSelector, useDispatch } from 'react-redux'

const ChromePicker = dynamic(() => import('react-color'), {
    ssr: false,
});

const ReturnToLauncherButton = dynamic(() =>
    import('@articles-media/articles-dev-box/ReturnToLauncherButton'),
    { ssr: false }
);

// import useUserDetails from '@/components/hooks/user/useUserDetails';
// import useUserToken from '@/components/hooks/user/useUserToken';

import { useLocalStorageNew } from '@/components/hooks/useLocalStorageNew';

// import { useForm, useWatch } from "react-hook-form";

// import Logo from "public/images/race-game/splash.jpg";

// import ROUTES from 'components/constants/routes'

import ArticlesButton from '@/components/UI/Button';

// const Ad = dynamic(() => import('components/Ads/Ad'), {
//     ssr: false,
// });

const Viewer = dynamic(
    () => import('@/components/Game/Viewer'),
    { ssr: false }
)

const Duck = dynamic(
    () => import('@/components/Game/PlayerModels/Duck'),
    { ssr: false }
)

const Dog = dynamic(
    () => import('@/components/Game/PlayerModels/Dog'),
    { ssr: false }
)

const Bear = dynamic(
    () => import('@/components/Game/PlayerModels/Bear'),
    { ssr: false }
)

const Witch = dynamic(
    () => import('@/components/Game/PlayerModels/Witch'),
    { ssr: false }
)

// import SingleInput from '@/components/Articles/SingleInput';
import IsDev from '@/components/UI/IsDev';
import { useSocketStore } from '@/components/hooks/useSocketStore';
// import ArticlesAd from '@/components/ArticlesAd';
// import CreditsModal from '@/components/UI/CreditsModal';
// import { Settings } from '@mui/icons-material';

import { useStore } from '@/components/hooks/useStore';
// import usePeerConnection from '@/components/hooks/usePeerConnection';
// import PeerLogic from '@/components/PeerLogic';

const LoginInfoModal = dynamic(
    () => import('@/components/UI/LoginInfoModal'),
    { ssr: false }
)

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { PieMenu } from '@articles-media/articles-gamepad-helper';

const assets_src = 'games/Race Game/'

const game_name = "Race Game"

export default function RaceGameLandingPage() {

    const darkMode = useStore((state) => state.darkMode)
    const toggleDarkMode = useStore((state) => state.toggleDarkMode)

    // const peerId = usePeerConnection((state) => state?.peerId);

    // const {
    //     socket,
    // } = useSocketStore(state => ({
    //     socket: state.socket,
    // }));
    const socket = useSocketStore((state) => state.socket)
    const connectSocket = useSocketStore((state) => state.connectSocket)
    const disconnectSocket = useSocketStore((state) => state.disconnectSocket)
    const connected = useSocketStore((state) => state.connected)

    const loginInfoModal = useStore((state) => state.loginInfoModal)
    const toggleLoginInfoModal = useStore((state) => state.toggleLoginInfoModal)

    const infoModal = useStore((state) => state.infoModal)
    const setInfoModal = useStore((state) => state.setInfoModal)
    // const toggleInfoModal = useStore((state) => state.toggleInfoModal)

    // const showSettingsModal = useStore((state) => state.showSettingsModal)
    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)
    // const toggleSettingsModal = useStore((state) => state.toggleSettingsModal)

    // const showCreditsModal = useStore((state) => state.showCreditsModal)
    const setShowCreditsModal = useStore((state) => state.setShowCreditsModal)

    // const [showInfoModal, setShowInfoModal] = useState(false)
    // const [showCreditsModal, setShowCreditsModal] = useState(false)

    // const userReduxState = useSelector((state) => state.auth.user_details)
    const userReduxState = false

    // const {
    //     data: userToken,
    //     error: userTokenError,
    //     isLoading: userTokenLoading,
    //     mutate: userTokenMutate
    // } = useUserToken();

    // const {
    //     data: userDetails,
    //     error: userDetailsError,
    //     isLoading: userDetailsLoading,
    //     mutate: userDetailsMutate
    // } = useUserDetails({
    //     token: userToken
    // });

    const {
        data: userToken,
        error: userTokenError,
        isLoading: userTokenLoading,
        mutate: userTokenMutate
    } = useUserToken(
        "3016"
    );

    const {
        data: userDetails,
        error: userDetailsError,
        isLoading: userDetailsLoading,
        mutate: userDetailsMutate
    } = useUserDetails({
        token: userToken
    });

    const [rulesAnControls, setRulesAnControls] = useState(false);

    // const { register, handleSubmit, watch, formState: { errors } } = useForm({
    //     defaultValues: {
    //         // "Cover Fees": false
    //         ...(typeof window !== 'undefined' && { nickname: localStorage.getItem('game:nickname') || userReduxState.display_name })
    //     }
    // });

    // const nickname = watch("nickname", false);

    // const [nickname, setNickname] = useLocalStorageNew("game:nickname", userReduxState.display_name)

    const nickname = useStore((state) => state.nickname)
    const setNickname = useStore((state) => state.setNickname)

    const [lobbyDetails, setLobbyDetails] = useState({
        players: [],
        games: [],
    })

    useEffect(() => {

        setRulesAnControls(localStorage.getItem('game:race-game:rulesAnControls') === 'true' ? true : false)

        // if (userReduxState._id) {
        //     console.log("Is user")
        // }

        socket.on('game:race-game-landing-details', function (msg) {
            console.log('game:race-game-landing-details', msg)
            setLobbyDetails(msg)
        });

        return () => {
            socket.off('game:race-game-landing-details');
            socket.emit('leave-room', 'game:race-game-landing')
        };

    }, [socket])

    useEffect(() => {

        localStorage.setItem('game:race-game:rulesAnControls', rulesAnControls)

    }, [rulesAnControls])

    // useEffect(() => {

    //     if (nickname) {
    //         localStorage.setItem('game:nickname', nickname)
    //     }

    // }, [nickname])

    useEffect(() => {

        if (socket.connected) {
            socket.emit('join-room', 'game:race-game-landing');
        }

        return function cleanup() {
            // socket.emit('leave-room', 'game:race-game-landing')
        };

    }, [socket.connected]);

    // const [character, setCharacter] = useLocalStorageNew("game:race-game:character", {
    //     model: 'Duck',
    //     color: '#000000'
    // })

    const character = useStore((state) => state.character)
    const setCharacter = useStore((state) => state.setCharacter)

    const characters = [
        {
            name: "Duck",
            image: `${process.env.NEXT_PUBLIC_CDN}${assets_src}duck.png`,
            model: <Duck color={character?.color || '#FFF'} />,
            defaultColor: '#FFFFFF',
        },
        {
            name: "Dog",
            image: `${process.env.NEXT_PUBLIC_CDN}${assets_src}dog.png`,
            model: <Dog color={character?.color || '#FFF'} />,
            defaultColor: '',
        },
        {
            name: "Bear",
            image: `${process.env.NEXT_PUBLIC_CDN}${assets_src}bear.png`,
            model: <Bear color={character?.color || '#FFF'} />,
            defaultColor: '',
        },
        {
            name: "Witch",
            image: `${process.env.NEXT_PUBLIC_CDN}${assets_src}witch.jpg`,
            model: <Witch color={character?.color || '#FFF'} />,
            defaultColor: '',
        },
    ]

    const [characterEdit, setCharacterEdit] = useState()
    const [colorEdit, setColorEdit] = useState()

    const [createCustomGame, setCreateCustomGame] = useState(false)
    const [joinCustomGame, setJoinCustomGame] = useState(false)

    const [showServers, setShowServers] = useState(false)

    return (

        <div className="race-game-landing-page">

            <Suspense>
                <PieMenu
                    options={[
                        {
                            label: 'Settings',
                            icon: 'fad fa-cog',
                            callback: () => {
                                setShowSettingsModal(prev => !prev)
                            }
                        },
                        {
                            label: 'Go Back',
                            icon: 'fad fa-arrow-left',
                            callback: () => {
                                window.history.back()
                            }
                        },
                        {
                            label: 'Credits',
                            icon: 'fad fa-info-circle',
                            callback: () => {
                                setShowCreditsModal(true)
                            }
                        },
                        {
                            label: 'Game Launcher',
                            icon: 'fad fa-gamepad',
                            callback: () => {
                                window.location.href = 'https://games.articles.media';
                            }
                        },
                        {
                            label: `${darkMode ? "Light" : "Dark"} Mode`,
                            icon: 'fad fa-palette',
                            callback: () => {
                                toggleDarkMode()
                            }
                        }
                    ]}
                    onFinish={(event) => {
                        console.log("Event", event)
                        if (event.callback) {
                            event.callback()
                        }
                    }}
                />
            </Suspense>

            {/* {infoModal &&
                <InfoModal
                    show={infoModal}
                    setShow={setInfoModal}
                />
            } */}

            {loginInfoModal &&
                <LoginInfoModal />
            }

            <div className='background-wrap'>
                {
                    darkMode ?
                        <Image
                            src={"/img/background-dark.webp"}
                            fill
                            alt=""
                            style={{
                                objectFit: 'cover',
                                filter: 'blur(3px)',
                            }}
                        />
                        :
                        <Image
                            src={"/img/preview.webp"}
                            fill
                            alt=""
                            style={{
                                objectFit: 'cover',
                                filter: 'blur(3px)',
                            }}
                        />
                }
                {/* <Image
                    src={
                        darkMode ?
                            "img/background-dark.webp"
                            :
                            "img/preview.webp"
                    }
                    fill
                    alt=""
                    style={{
                        objectFit: 'cover',
                        filter: 'blur(3px)',
                    }}
                /> */}
            </div>

            <div className="container d-flex flex-column flex-lg-row justify-content-center align-items-center">

                {(
                    !characterEdit
                    &&
                    !createCustomGame
                    &&
                    joinCustomGame === false
                ) &&
                    <div style={{ "width": "20rem" }}>

                        <div
                            className='hero'
                        >

                            <div className='radial-background-gradient'>
                                <svg width="100%" height="100%" viewBox="0 0 100 100">
                                    <defs>
                                        <radialGradient id="fade" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                            <stop offset="0%" stopColor="black" stopOpacity="1" />
                                            <stop offset="100%" stopColor="black" stopOpacity="0" />
                                        </radialGradient>
                                    </defs>
                                    <circle cx="50" cy="50" r="50" fill="url(#fade)" />
                                </svg>
                            </div>

                            <div className='characters d-flex justify-content-center'>
                                <img
                                    width={50}
                                    style={{
                                        // transform: 'scale(5)'
                                    }}
                                    src="/img/bear.webp"
                                    alt=""
                                    className="bear"
                                />
                                <img
                                    width={50}
                                    style={{
                                        // transform: 'scale(5)'
                                    }}
                                    src="/img/dog.webp"
                                    alt=""
                                    className="dog"
                                />
                                <img
                                    width={50}
                                    style={{
                                        // transform: 'scale(5)'
                                    }}
                                    src="/img/duck.webp"
                                    alt=""
                                    className="duck"
                                />
                                <img
                                    width={50}
                                    style={{
                                        // transform: 'scale(5)'
                                    }}
                                    src="/img/witch.webp"
                                    alt=""
                                    className="witch"
                                />
                            </div>

                            <div className="hero-title luckiest-guy-regular">
                                Race Game
                            </div>

                            <img src="/img/dice.png" alt="" className="dice" />
                            <img src="/img/mystery-spot.png" alt="" className="mystery-spot" />

                        </div>

                        <div className="card card-articles card-sm mb-3" >

                            <div className="card-header d-flex align-items-center">

                                <div className='flex-shrink-0 me-2'>

                                    <div style={{ width: '75px', height: '75px' }} >
                                        <div
                                            className="ratio ratio-1x1 mb-1"

                                        >
                                            <div>
                                                <Suspense>
                                                    <Viewer scale={13}>
                                                        {characters.find(item => item.name == character?.model)?.model}
                                                    </Viewer>
                                                </Suspense>
                                            </div>
                                        </div>
                                    </div>

                                    <ArticlesButton
                                        small
                                        className="w-100"
                                        onClick={() => {
                                            setCharacterEdit(true)
                                        }}
                                    >
                                        Edit
                                    </ArticlesButton>

                                </div>

                                <div className='lh-sm'>

                                    <div className='spacer-wrapper' style={{ height: '75px' }}>
                                        {/* <SingleInput
                                            value={nickname}
                                            setValue={setNickname}
                                            item_key="Nickname"
                                            label="Nickname"
                                            noMargin
                                        /> */}
                                        <input
                                            autoComplete='off'
                                            // id={item_key}
                                            type="text"
                                            className=''
                                            // autoFocus={autoFocus && true}
                                            // onBlur={onBlur}
                                            // placeholder={placeholder}
                                            value={nickname}
                                            // onKeyDown={onKeyDown}
                                            onChange={(e) => {
                                                setNickname(e.target.value)
                                            }}
                                        />

                                        {/* <div className="form-group articles">
                                            <label htmlFor="nickname">Nickname</label>
                                            <input
                                                {...register("nickname", { required: true })}
                                                id="nickname"
                                                placeholder=''
                                                maxlength="15"
                                                className="form-control with-label"
                                            />
                                        </div> */}

                                        <div className='mt-1' style={{ fontSize: '0.8rem' }}>Visible to all players</div>
                                    </div>

                                    <div className='w-100 d-flex'>

                                        <ArticlesButton
                                            className={`w-100`}
                                            small
                                            onClick={() => {
                                                !userDetails?.user_id ?
                                                    window.location.href = process.env.NEXT_PUBLIC_LOCAL_ACCOUNTS_ADDRESS + '/login?redirect=' + window.location.href
                                                    :
                                                    fetch('/api/logout', { method: 'POST' }).then(() => {
                                                        userTokenMutate()
                                                        userDetailsMutate()
                                                    })
                                            }}
                                        >
                                            {!userDetails?.user_id ? 'Log In' : 'Log Out'}
                                        </ArticlesButton>

                                        <ArticlesButton
                                            className={``}
                                            small
                                            onClick={() => {
                                                toggleLoginInfoModal()
                                            }}
                                        >
                                            <i className={`fad fa-info-circle`}></i>
                                        </ArticlesButton>

                                    </div>



                                </div>

                            </div>

                            <div className="card-body p-2">

                                {/* <ArticlesButton
                                    className={`w-100 mb-2`}
                                    small
                                    onClick={() => {
                                        if (connected) {
                                            disconnectSocket()
                                        } else {
                                            connectSocket()
                                        }
                                    }}
                                >
                                    {connected ? 'Disconnect' : 'Connect'}
                                </ArticlesButton> */}

                                <OverlayTrigger placement="right"
                                    overlay={
                                        <Popover id="popover-basic">
                                            <Popover.Header as="h3">Room Play</Popover.Header>
                                            <Popover.Body
                                                className="py-2"
                                            >
                                                <div className="mb-1">
                                                    <span className='badge bg-success'>
                                                        No login required.
                                                    </span>
                                                </div>
                                                Similar to Jackbox Games, one player creates a room and shares the code with friends to join. Game will take place on the hosts screen and others play on their devices.
                                            </Popover.Body>
                                        </Popover>
                                    }
                                >
                                    <Link href="/play?server_id=&server_type=room-play">
                                        <ArticlesButton
                                            className={`w-100 mb-2`}
                                            small
                                            onClick={() => {

                                            }}
                                        >
                                            <i className='fad fa-house'></i>
                                            Room Play
                                        </ArticlesButton>
                                    </Link>
                                </OverlayTrigger>

                                <OverlayTrigger placement="right"
                                    overlay={
                                        <Popover id="popover-basic">
                                            <Popover.Header as="h3">Peer Multiplayer</Popover.Header>
                                            <Popover.Body
                                                className="py-2"
                                            >
                                                <div className="mb-1">
                                                    <span className='badge bg-success'>
                                                        No login required.
                                                    </span>
                                                </div>
                                                Connect directly to other players using Peer-to-Peer technology.
                                            </Popover.Body>
                                        </Popover>
                                    }
                                >
                                    <Link href="/play?server_id=&server_type=online-peer">
                                        <ArticlesButton
                                            className={`w-100 mb-2`}
                                            small
                                            onClick={() => {

                                            }}
                                        >
                                            <i className='fad fa-link'></i>
                                            Peer Multiplayer
                                        </ArticlesButton>
                                    </Link>
                                </OverlayTrigger>

                                <OverlayTrigger placement="right"
                                    overlay={
                                        <Popover id="popover-basic">
                                            <Popover.Header as="h3">Socket Multiplayer</Popover.Header>
                                            <Popover.Body
                                                className="py-2"
                                            >
                                                <div className="mb-1">
                                                    <span className='badge bg-warning text-black'>
                                                        Login required.
                                                    </span>
                                                </div>
                                                Game takes place on a dedicated server. Anti-cheat! Join public lobbies, save stats, collect rewards!
                                            </Popover.Body>
                                        </Popover>
                                    }
                                >
                                    <div>
                                        <ArticlesButton
                                            className={`w-100 mb-2`}
                                            small
                                            disabled
                                            onClick={() => {
                                                setShowServers(!showServers)
                                            }}
                                        >
                                            <i className='fad fa-users'></i>
                                            Socket Multiplayer
                                            <span className='badge bg-secondary ms-2'>Offline</span>
                                        </ArticlesButton>
                                    </div>
                                </OverlayTrigger>

                                {/* <PeerLogic /> */}

                                {showServers &&
                                    <div>

                                        <div className="fw-bold mb-1 small text-center">
                                            {lobbyDetails.players.length || 0} player{lobbyDetails.players.length > 1 && 's'} in the lobby.
                                        </div>

                                        <div className="servers mb-2">

                                            {[1, 2, 3, 4].map(id => {

                                                let lobbyLookup = lobbyDetails?.raceGameGlobalState?.games?.find(lobby =>
                                                    parseInt(lobby.server_id) == id
                                                )

                                                return (
                                                    <div key={id} className="server">

                                                        <div className='d-flex justify-content-between align-items-center w-100 mb-2'>
                                                            <div className="mb-0" style={{ fontSize: '0.9rem' }}><b>Server {id}</b></div>
                                                            <div className='mb-0'>{lobbyLookup?.players?.length || 0}/4</div>
                                                        </div>

                                                        <div className='d-flex justify-content-around w-100 mb-1'>
                                                            {[1, 2, 3, 4].map(player_count => {

                                                                let playerLookup = false

                                                                if (lobbyLookup?.players?.length >= player_count) playerLookup = true

                                                                return (
                                                                    <div
                                                                        key={player_count}
                                                                        className="icon"
                                                                        style={{
                                                                            width: '20px',
                                                                            height: '20px',
                                                                            ...(playerLookup ? {
                                                                                backgroundColor: 'black',
                                                                            } : {
                                                                                backgroundColor: 'gray',
                                                                            }),
                                                                            border: '1px solid black'
                                                                        }}
                                                                    >

                                                                    </div>
                                                                )

                                                            })}
                                                        </div>

                                                        <Link
                                                            className={``}
                                                            href={{
                                                                pathname: `/play`,
                                                                query: {
                                                                    server_id: id,
                                                                    server_type: 'online-socket',
                                                                }
                                                            }}
                                                        >
                                                            <ArticlesButton
                                                                small
                                                                className="px-5"
                                                            >
                                                                Join
                                                            </ArticlesButton>
                                                        </Link>

                                                    </div>
                                                )

                                            })}

                                        </div>

                                    </div>
                                }

                                <IsDev>
                                    <div className='d-flex flex-column align-items-center py-3'>

                                        <ArticlesButton
                                            small
                                            className={`mb-1`}
                                            onClick={() => {
                                                setCreateCustomGame({
                                                    url: `custom-${Math.random().toString(36).substring(2, 6)}`,
                                                    players: 4,
                                                    length: 16,
                                                    maxMoves: 4
                                                })
                                            }}
                                        >
                                            <i className="fad fa-hammer"></i>
                                            Create Custom Game
                                        </ArticlesButton>

                                        <ArticlesButton
                                            small
                                            className={`flex-shrink-0`}
                                            onClick={() => {
                                                setJoinCustomGame('')
                                            }}
                                        >
                                            <i className="fad fa-wifi"></i>
                                            Join Custom Game
                                        </ArticlesButton>

                                    </div>
                                </IsDev>

                            </div>

                            <div className="card-footer d-flex flex-wrap justify-content-center">

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
                                    onClick={() => {
                                        setInfoModal(true)
                                    }}
                                >
                                    <i className="fad fa-info-square"></i>
                                    Info & Rules
                                </ArticlesButton>

                                <a className='w-50' target='_blank' href='https://github.com/Articles-Joey/race-game'>
                                    <ArticlesButton
                                        className={`w-100`}
                                        small
                                        onClick={() => {

                                        }}
                                    >
                                        <i className="fab fa-github"></i>
                                        GitHub
                                    </ArticlesButton>
                                </a>

                                <ArticlesButton
                                    className={`w-50`}
                                    small
                                    onClick={() => {
                                        setShowCreditsModal(true)
                                    }}
                                >
                                    <i className="fad fa-users"></i>
                                    Credits
                                </ArticlesButton>

                            </div>

                        </div>

                        <ReturnToLauncherButton />

                    </div>
                }

                {createCustomGame &&
                    <div
                        className="card card-articles card-sm"
                        style={{ "width": "20rem" }}
                    >
                        <div className="card-header">
                            Create Custom Game
                        </div>

                        <div className="card-body">

                            <div className="small text-muted">Game Code</div>
                            {/* <SingleInput
                                value={createCustomGame?.url}
                                setValue={setCreateCustomGame}
                                noMargin
                            /> */}
                            <input
                                autoComplete='off'
                                // id={item_key}
                                type="text"
                                className='text-center'
                                // autoFocus={autoFocus && true}
                                // onBlur={onBlur}
                                // placeholder={placeholder}
                                value={createCustomGame?.url}
                                // onKeyDown={onKeyDown}
                                onChange={(e) => {
                                    setCreateCustomGame(e.target.value)
                                }}
                            />
                            <div style={{ fontSize: '0.75rem' }} className="text-muted mb-2">Give this to friends once you start the game!</div>

                            <div className="small text-muted">Players</div>
                            <div className="d-flex align-items-center mb-3">
                                <ArticlesButton
                                    small
                                    disabled={createCustomGame?.players <= 2}
                                    className={`px-2`}
                                    onClick={() => {
                                        setCreateCustomGame(prev => ({
                                            ...prev,
                                            players: createCustomGame?.players - 1
                                        }))
                                    }}
                                >
                                    -
                                </ArticlesButton>
                                <b className='px-2'>{createCustomGame?.players}</b>
                                <ArticlesButton
                                    small
                                    className={`px-2`}
                                    onClick={() => {
                                        setCreateCustomGame(prev => ({
                                            ...prev,
                                            players: createCustomGame?.players + 1
                                        }))
                                    }}
                                >
                                    +
                                </ArticlesButton>
                            </div>

                            <div>
                                <div className="small text-muted">Board Length</div>
                                <div className="d-flex align-items-center mb-3">
                                    <ArticlesButton
                                        small
                                        disabled={createCustomGame?.length <= 10}
                                        className={`px-2`}
                                        onClick={() => {
                                            setCreateCustomGame(prev => ({
                                                ...prev,
                                                length: createCustomGame?.length - 1
                                            }))
                                        }}
                                    >
                                        -
                                    </ArticlesButton>
                                    <b className='px-2'>{createCustomGame?.length}</b>
                                    <ArticlesButton
                                        small
                                        disabled={createCustomGame?.length >= 100}
                                        className={`px-2`}
                                        onClick={() => {
                                            setCreateCustomGame(prev => ({
                                                ...prev,
                                                length: createCustomGame?.length + 1
                                            }))
                                        }}
                                    >
                                        +
                                    </ArticlesButton>
                                </div>
                            </div>

                            <div>
                                <div className="small text-muted">Max Moves</div>
                                <div className="d-flex align-items-center mb-3">
                                    <ArticlesButton
                                        small
                                        disabled={createCustomGame?.maxMoves <= 4}
                                        className={`px-2`}
                                        onClick={() => {
                                            setCreateCustomGame(prev => ({
                                                ...prev,
                                                maxMoves: createCustomGame?.maxMoves - 1
                                            }))
                                        }}
                                    >
                                        -
                                    </ArticlesButton>
                                    <b className='px-2'>{createCustomGame?.maxMoves}</b>
                                    <ArticlesButton
                                        small
                                        disabled={createCustomGame?.maxMoves >= 100}
                                        className={`px-2`}
                                        onClick={() => {
                                            setCreateCustomGame(prev => ({
                                                ...prev,
                                                maxMoves: createCustomGame?.maxMoves + 1
                                            }))
                                        }}
                                    >
                                        +
                                    </ArticlesButton>
                                </div>
                            </div>

                        </div>

                        <div className="card-footer">

                            <ArticlesButton
                                small
                                className={`w-50`}
                                onClick={() => {
                                    setCreateCustomGame(false)
                                }}
                            >
                                <i className="fad fa-minus-square"></i>
                                Cancel
                            </ArticlesButton>

                            <ArticlesButton
                                variant={"success"}
                                small
                                className={`w-50`}
                                onClick={() => {

                                }}
                            >
                                <i className="fad fa-check-square"></i>
                                Start
                            </ArticlesButton>

                        </div>
                    </div>
                }

                {joinCustomGame !== false &&
                    <div
                        className="card card-articles card-sm"
                        style={{ "width": "20rem" }}
                    >

                        <div className="card-header">
                            Join Custom Game
                        </div>

                        <div className="card-body">
                            <div className="small text-muted">Game Code</div>
                            {/* <SingleInput
                                value={joinCustomGame}
                                setValue={setJoinCustomGame}
                            /> */}
                            <input
                                autoComplete='off'
                                // id={item_key}
                                type="text"
                                className='text-center'
                                // autoFocus={autoFocus && true}
                                // onBlur={onBlur}
                                // placeholder={placeholder}
                                value={joinCustomGame}
                                // onKeyDown={onKeyDown}
                                onChange={(e) => {
                                    setJoinCustomGame(e.target.value)
                                }}
                            />
                        </div>

                        <div className="card-footer">

                            <ArticlesButton
                                small
                                className={`w-50`}
                                onClick={() => {
                                    setJoinCustomGame(false)
                                }}
                            >
                                <i className="fad fa-minus-square"></i>
                                Cancel
                            </ArticlesButton>

                            <ArticlesButton
                                variant={"success"}
                                small
                                className={`w-50`}
                                onClick={() => {

                                }}
                            >
                                <i className="fad fa-check-square"></i>
                                Start
                            </ArticlesButton>

                        </div>

                    </div>
                }

                {/* Node mounting insertBefore issues if mounted now? */}
                {true &&
                    <div
                        className="card card-articles card-sm"
                        style={{
                            "width": "20rem",
                            "display": characterEdit ? 'block' : 'none'
                        }}
                    >

                        <div className="card-header d-flex align-items-center">

                            Character Selector

                        </div>

                        <div className="card-body p-2">

                            <div className="selection-grid mb-2">
                                {characters.map(item => {

                                    let active = character?.model == item.name

                                    return (
                                        <div
                                            key={item.name}
                                            className={`item ${active && 'active'}`}
                                            onClick={() => {
                                                setCharacter({
                                                    ...character,
                                                    model: item.name
                                                })
                                            }}
                                        >
                                            <div className="ratio ratio-1x1">

                                                {active &&
                                                    <div className=''>
                                                        <Viewer>
                                                            {item.model}
                                                        </Viewer>
                                                    </div>
                                                }

                                                {!active &&
                                                    <img
                                                        className='img-fluid'
                                                        style={{ objectFit: 'cover' }}
                                                        src={item.image}
                                                        alt=""
                                                    />
                                                }

                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {colorEdit &&
                                <div className='mb-2'>
                                    <ChromePicker
                                        // color={color}
                                        width={"100%"}
                                        color={character?.color || '#000000'}
                                        onChange={(color, e) => {

                                            console.log(color)

                                            setCharacter({
                                                ...character,
                                                color: color.hex
                                            })

                                        }}
                                        onChangeComplete={(color, e) => {
                                            console.log("Change Complete", color.rgb)
                                        }}
                                    />
                                </div>
                            }

                            <div className='d-flex justify-content-center'>

                                <ArticlesButton
                                    small
                                    className="w-50"
                                    disabled={!character?.color}
                                    onClick={() => {

                                        let character_copy = { ...character }

                                        delete character_copy.color

                                        setCharacter(character_copy)

                                    }}
                                >
                                    <i className="fad fa-redo"></i>
                                    Reset Color
                                </ArticlesButton>

                                <ArticlesButton
                                    small
                                    className="w-50"
                                    // active={colorEdit}
                                    onClick={() => {

                                        setColorEdit(prev => !prev)

                                    }}
                                >

                                    {colorEdit ? <i className="fad fa-check"></i> : <i className="fad fa-palette"></i>}
                                    {colorEdit ? 'Done' : 'Select Color'}
                                </ArticlesButton>

                            </div>

                        </div>

                        <div className="card-footer d-flex justify-content-center">

                            <ArticlesButton
                                className="w-50"
                                onClick={() => {
                                    setCharacterEdit(false)
                                }}
                            >
                                <i className="fad fa-arrow-alt-left"></i>
                                Return
                            </ArticlesButton>

                            <ArticlesButton
                                className="w-50"
                                onClick={() => {
                                    setCharacterEdit(false)
                                }}
                            >
                                <i className="fad fa-save"></i>
                                Save
                            </ArticlesButton>

                        </div>

                    </div>
                }

                {/* <ArticlesAd
                    section={"Games"}
                    section_id={'Race Game'}
                /> */}

                {/* <GameScoreboard
                    game={game_name}
                    style="Default"
                    darkMode={darkMode ? true : false}
                /> */}

                <Ad
                    style="Default"
                    section={"Games"}
                    section_id={game_name}
                    darkMode={darkMode ? true : false}
                    user_ad_token={userToken}
                    userDetails={userDetails}
                    userDetailsLoading={userDetailsLoading}
                />

            </div>
        </div >
    );
}