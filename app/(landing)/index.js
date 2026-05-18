"use client"
import { useEffect, useContext, useState, Suspense } from 'react';

import Link from 'next/link'
import dynamic from 'next/dynamic'

import useUserDetails from '@articles-media/articles-dev-box/useUserDetails';
import useUserToken from '@articles-media/articles-dev-box/useUserToken';

import ArticlesButton from '@/components/UI/Button';
import LandingCardOverride from '@/components/UI/LandingCardOverride';

const Viewer = dynamic(
    () => import('@/components/Game/Viewer'),
    { ssr: false }
)

import IsDev from '@/components/UI/IsDev';
import { useSocketStore } from '@/hooks/useSocketStore';

import { useStore } from '@/hooks/useStore';

const LandingBackgroundAnimation = dynamic(
    () => import('@/components/Game/LandingBackgroundAnimation'),
    { ssr: false }
)

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { PieMenu } from '@articles-media/articles-gamepad-helper';
import useGameStore from '@/hooks/useGameStore';
import RotatingMascot from '@/components/UI/RotatingMascot';
import PageTemplateLandingPage from '@articles-media/articles-dev-box/PageTemplateLandingPage';
import RenderCharacter from '@/components/Game/RenderCharacter';

export default function RaceGameLandingPage() {

    const connected = useSocketStore((state) => state.connected)

    const darkMode = useStore((state) => state.darkMode)
    const toggleDarkMode = useStore((state) => state.toggleDarkMode)

    // const showSettingsModal = useStore((state) => state.showSettingsModal)
    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)
    // const toggleSettingsModal = useStore((state) => state.toggleSettingsModal)

    // const showCreditsModal = useStore((state) => state.showCreditsModal)
    const setShowCreditsModal = useStore((state) => state.setShowCreditsModal)

    const restartGame = useGameStore((state) => state.restartGame)

    const {
        data: userToken,
        error: userTokenError,
        isLoading: userTokenLoading,
        mutate: userTokenMutate
    } = useUserToken(
        process.env.NEXT_PUBLIC_GAME_PORT
    );

    const {
        data: userDetails,
        error: userDetailsError,
        isLoading: userDetailsLoading,
        mutate: userDetailsMutate
    } = useUserDetails({
        token: userToken
    });

    useEffect(() => {

        const gameState = useGameStore.getState().gameState
        const setGameState = useGameStore.getState().setGameState

        setGameState({
            ...gameState,
            players: [],
            mysterySpots: [],
        })

        // restartGame();

    }, [])

    const character = useStore((state) => state.character)
    const setCharacter = useStore((state) => state.setCharacter)
    const lobbyDetails = useStore(state => state.lobbyDetails)
    const characters = useStore(state => state.characters)

    const [characterEdit, setCharacterEdit] = useState(false)
    const [colorEdit, setColorEdit] = useState()

    const [createCustomGame, setCreateCustomGame] = useState(false)
    const [joinGame, setJoinGame] = useState(false)

    const [showServers, setShowServers] = useState(false)

    function randomNumbers(length) {
        let result = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    return (
        <>
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
            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                RotatingMascot={RotatingMascot}
                Link={Link}
                // logoImage={logo.src}
                LandingBackgroundAnimation={
                    <LandingBackgroundAnimation />
                }
                CardOverride={
                    (characterEdit || joinGame !== false || createCustomGame) ?
                        <div>
                            <LandingCardOverride
                                characterEdit={characterEdit}
                                setCharacterEdit={setCharacterEdit}
                                character={character}
                                setCharacter={setCharacter}
                                characters={characters}
                                colorEdit={colorEdit}
                                setColorEdit={setColorEdit}
                                createCustomGame={createCustomGame}
                                setCreateCustomGame={setCreateCustomGame}
                                joinGame={joinGame}
                                setJoinGame={setJoinGame}
                            />
                        </div>
                        :
                        null
                }
                CardBodyOverride={<>

                    <div className="p-3">

                        <div className="fw-bold small text-center mb-2">
                            <div>{lobbyDetails.online_player_count || 0} player{(lobbyDetails.online_player_count !== 1) && 's'} are online.</div>
                        </div>

                        {/* Old card-body */}
                        <div className="old-card-body">

                            <ArticlesButton
                                className={`w-100 mb-2`}
                                small
                                onClick={() => {
                                    setCreateCustomGame({
                                        url: randomNumbers(4),
                                        players: 4,
                                        length: 16,
                                        maxMoves: 4
                                    })
                                }}
                            >
                                <i className='fad fa-plus'></i>
                                Create Game
                            </ArticlesButton>

                            <ArticlesButton
                                className={`w-100 mb-2`}
                                small
                                onClick={() => {
                                    setJoinGame({
                                        code: "",
                                    })
                                }}
                            >
                                <i className='fad fa-search'></i>
                                Join Game
                            </ArticlesButton>

                        </div>

                    </div>

                </>}
                // disableHero
                heroOverride={<>
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
                </>}
                backgroundImage={
                    darkMode ? "/img/background-dark.webp" : "/img/preview.webp"
                }
                singlePlayerConfig={{

                }}
                NicknameInputConfig={{
                    PreComponent: <div className='flex-shrink-0 me-2'>

                        <div style={{ width: '75px', height: '75px' }} >
                            <div
                                className="ratio ratio-1x1 mb-1 border"

                            >
                                <div>
                                    <Suspense>
                                        <Viewer scale={13}>
                                            <RenderCharacter
                                                character={
                                                    characters.find(item => item.name == character?.model)
                                                }
                                            />
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
                }}
                multiplayerConfig={{
                    // type: "WebSocket",
                    // comingSoon: true,
                    // defaultServers: 2,
                    // privateServerSupport: false,
                }}
                gameScoreboardConfig={{
                    append_score_text: "m",
                    metrics: [
                        {
                            label: 'Games Won',
                            key: "score",
                            format: (value) => `${value} m`
                        },
                        {
                            label: 'Distance Traveled',
                            key: "total_distance",
                            format: (value) => `${value} m`
                        }
                    ]
                }}
                // brandingTextClass="jaro-primary"
                disableGameScoreboard={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== 'true'}
                disableAd={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== 'true'}
            />
        </>
    );
}