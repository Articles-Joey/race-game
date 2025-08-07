"use client"
import { useEffect, useContext, useState, Suspense } from 'react';

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// import { useSelector, useDispatch } from 'react-redux'

const ChromePicker = dynamic(() => import('react-color'), {
    ssr: false,
});

import useUserDetails from '@/hooks/user/useUserDetails';
import useUserToken from '@/hooks/user/useUserToken';

import { useLocalStorageNew } from '@/hooks/useLocalStorageNew';

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
import { useSocketStore } from '@/hooks/useSocketStore';
import ArticlesAd from '@/components/ArticlesAd';
import CreditsModal from '@/components/UI/CreditsModal';
import { Settings } from '@mui/icons-material';
import SettingsModal from '@/components/UI/SettingsModal';
import { useStore } from '@/hooks/useStore';

const InfoModal = dynamic(
    () => import('@/components/UI/InfoModal'),
    { ssr: false }
)

const assets_src = 'games/Race Game/'

export default function RaceGameLandingPage() {

    // const {
    //     socket,
    // } = useSocketStore(state => ({
    //     socket: state.socket,
    // }));
    const socket = useSocketStore((state) => state.socket)
    const connectSocket = useSocketStore((state) => state.connectSocket)
    const disconnectSocket = useSocketStore((state) => state.disconnectSocket)
    const connected = useSocketStore((state) => state.connected)

    const infoModal = useStore((state) => state.infoModal)
    const setInfoModal = useStore((state) => state.setInfoModal)
    // const toggleInfoModal = useStore((state) => state.toggleInfoModal)

    const showSettingsModal = useStore((state) => state.showSettingsModal)
    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)
    // const toggleSettingsModal = useStore((state) => state.toggleSettingsModal)

    const showCreditsModal = useStore((state) => state.showCreditsModal)
    const setShowCreditsModal = useStore((state) => state.setShowCreditsModal)

    // const [showInfoModal, setShowInfoModal] = useState(false)
    // const [showCreditsModal, setShowCreditsModal] = useState(false)

    // const userReduxState = useSelector((state) => state.auth.user_details)
    const userReduxState = false

    const {
        data: userToken,
        error: userTokenError,
        isLoading: userTokenLoading,
        mutate: userTokenMutate
    } = useUserToken();

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

    const [nickname, setNickname] = useLocalStorageNew("game:nickname", userReduxState.display_name)

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

    const [character, setCharacter] = useLocalStorageNew("game:race-game:character", {
        model: 'Duck',
        color: '#000000'
    })

    const characters = [
        {
            name: "Duck",
            image: `${process.env.NEXT_PUBLIC_CDN}${assets_src}duck.png`,
            model: <Duck color={character.color} />,
            defaultColor: '#FFFFFF',
        },
        {
            name: "Dog",
            image: `${process.env.NEXT_PUBLIC_CDN}${assets_src}dog.png`,
            model: <Dog color={character.color} />,
            defaultColor: '',
        },
        {
            name: "Bear",
            image: `${process.env.NEXT_PUBLIC_CDN}${assets_src}bear.png`,
            model: <Bear color={character.color} />,
            defaultColor: '',
        },
        {
            name: "Witch",
            image: `${process.env.NEXT_PUBLIC_CDN}${assets_src}witch.jpg`,
            model: <Witch color={character.color} />,
            defaultColor: '',
        },
    ]

    const [characterEdit, setCharacterEdit] = useState()
    const [colorEdit, setColorEdit] = useState()

    const [createCustomGame, setCreateCustomGame] = useState(false)
    const [joinCustomGame, setJoinCustomGame] = useState(false)

    return (

        <div className="race-game-landing-page">

            {infoModal &&
                <InfoModal
                    show={infoModal}
                    setShow={setInfoModal}
                />
            }

            {showSettingsModal &&
                <SettingsModal
                    show={showSettingsModal}
                    setShow={setShowSettingsModal}
                />
            }

            {showCreditsModal &&
                <CreditsModal
                    show={showCreditsModal}
                    setShow={setShowCreditsModal}
                />
            }

            <div className='background-wrap'>
                <Image
                    src={`${process.env.NEXT_PUBLIC_CDN}games/Race Game/background.jpg`}
                    fill
                    alt=""
                    style={{
                        objectFit: 'cover'
                    }}
                />
            </div>

            <div className="container d-flex flex-column-reverse flex-lg-row justify-content-center align-items-center">

                {(
                    !characterEdit
                    &&
                    !createCustomGame
                    &&
                    joinCustomGame === false
                ) &&
                    <div className="card card-articles card-sm" style={{ "width": "20rem" }}>

                        <div className="card-header d-flex align-items-center">

                            <div className='flex-shrink-0 me-2'>

                                <div style={{ width: '50px', height: '50px' }} >
                                    <div
                                        className="ratio ratio-1x1 mb-1"

                                    >
                                        <div>
                                            <Suspense>
                                                <Viewer scale={13}>
                                                    {characters.find(item => item.name == character.model)?.model}
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

                        </div>

                        <div className="card-body p-2">

                            <ArticlesButton
                                className={`w-100 mb-2`}
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
                            </ArticlesButton>

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

                            <ArticlesButton
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setShowSettingsModal(true)
                                }}
                            >
                                <i className="fad fa-cog"></i>
                                Settings
                            </ArticlesButton>

                            <ArticlesButton
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setInfoModal(true)
                                }}
                            >
                                <i className="fad fa-info-square"></i>
                                Rules & Controls
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

                {characterEdit &&
                    <div
                        className="card card-articles card-sm"
                        style={{ "width": "20rem" }}
                    >

                        <div className="card-header d-flex align-items-center">

                            Character Selector

                        </div>

                        <div className="card-body p-2">

                            <div className="selection-grid mb-2">
                                {characters.map(item => {

                                    let active = character.model == item.name

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
                                        color={character.color}
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
                                    disabled={!character.color}
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

                <ArticlesAd
                    section={"Games"}
                    section_id={'Race Game'}
                />

            </div>
        </div >
    );
}