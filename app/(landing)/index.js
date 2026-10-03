"use client";

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PaletteIcon from '@mui/icons-material/Palette';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { PieMenu } from '@articles-media/articles-gamepad-helper';
import PageTemplateLandingPage from '@articles-media/articles-dev-box/PageTemplateLandingPage';
import ArticlesButton from '@/components/UI/Button';
import LandingCardOverride from '@/components/UI/LandingCardOverride';
import RotatingMascot from '@/components/UI/RotatingMascot';
import RenderCharacter from '@/components/Game/RenderCharacter';
import { useSocketStore } from '@/hooks/useSocketStore';
import { useStore } from '@/hooks/useStore';
import useGameStore from '@/hooks/useGameStore';

const Viewer = dynamic(() => import('@/components/Game/Viewer'), { ssr: false });
const LandingBackgroundAnimation = dynamic(() => import('@/components/Game/LandingBackgroundAnimation'), { ssr: false });

export default function RaceGameLandingPage() {
    const darkMode = useStore((state) => state.darkMode);
    const character = useStore((state) => state.character);
    const setCharacter = useStore((state) => state.setCharacter);
    const lobbyDetails = useStore((state) => state.lobbyDetails);
    const characters = useStore((state) => state.characters);
    const [characterEdit, setCharacterEdit] = useState(false);
    const [colorEdit, setColorEdit] = useState(false);
    const [createCustomGame, setCreateCustomGame] = useState(false);
    const [joinGame, setJoinGame] = useState(false);

    useEffect(() => {
        const { gameState, setGameState } = useGameStore.getState();
        setGameState({ ...gameState, players: [], mysterySpots: [] });
    }, []);

    function randomNumbers(length) {
        let result = '';
        for (let index = 0; index < length; index++) result += Math.floor(Math.random() * 10);
        return result;
    }

    const pieOptions = [
        { label: 'Settings', Icon: SettingsIcon, callback: () => useStore.getState().setShowSettingsModal(true) },
        { label: 'Go Back', Icon: ArrowBackIcon, callback: () => window.history.back() },
        { label: 'Credits', Icon: InfoIcon, callback: () => useStore.getState().setShowCreditsModal(true) },
        { label: 'Game Launcher', Icon: SportsEsportsIcon, callback: () => { window.location.href = 'https://games.articles.media'; } },
        { label: `${darkMode ? 'Light' : 'Dark'} Mode`, Icon: PaletteIcon, callback: () => useStore.getState().toggleDarkMode() },
    ];

    return (
        <Box
            sx={{
                position: 'relative',
                isolation: 'isolate',
                '& .landing-page': {
                    position: 'relative', width: '100%', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', p: 2, minHeight: '100vh', overflow: 'hidden',
                },
                '& .ad-wrap': {
                    position: 'fixed', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                    display: 'none', '@media (min-width: 992px)': { display: 'block' },
                },
                '& .background-wrap': { position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: -1 },
                '& .landing-model-wrapper': { position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0 },
                '& .rules-media-wrap img': { position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' },
                '& .image-wrap': {
                    position: 'relative', width: '15rem', height: '15rem', mx: 'auto',
                    '& img': { position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' },
                },
                '& .servers': { display: 'grid', gap: '5px', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
                '& .server': { p: 1, border: '1px solid rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
            }}
        >
            <Suspense>
                <PieMenu
                    options={pieOptions.map(({ label, Icon, callback }) => ({
                        label: <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}><Icon fontSize="small" />{label}</Box>,
                        callback,
                    }))}
                    onFinish={(event) => event.callback?.()}
                />
            </Suspense>
            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                RotatingMascot={RotatingMascot}
                Link={Link}
                useRouter={useRouter}
                LandingBackgroundAnimation={<LandingBackgroundAnimation />}
                CardOverride={(characterEdit || joinGame !== false || createCustomGame) ? (
                    <Box>
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
                    </Box>
                ) : null}
                CardBodyOverride={
                    <Box sx={{ p: 2 }}>
                        <Box sx={{ fontWeight: 700, fontSize: '0.875em', textAlign: 'center', mb: 1 }}>
                            {lobbyDetails?.online_player_count || 0} player{lobbyDetails?.online_player_count !== 1 && 's'} are online.
                        </Box>
                        <Box>
                            <ArticlesButton
                                small
                                sx={{ width: '100%', mb: 1 }}
                                startIcon={<AddIcon />}
                                onClick={() => setCreateCustomGame({ url: randomNumbers(4), players: 4, length: 16, maxMoves: 4 })}
                            >
                                Create Game
                            </ArticlesButton>
                            <ArticlesButton small sx={{ width: '100%', mb: 1 }} startIcon={<SearchIcon />} onClick={() => setJoinGame({ code: '' })}>
                                Join Game
                            </ArticlesButton>
                        </Box>
                    </Box>
                }
                heroOverride={
                    <Box sx={{ position: 'relative', zIndex: 0, mb: '2rem' }}>
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%', transform: 'translate(-50%, -50%) scale(5)', zIndex: -1 }}>
                            <svg width="100%" height="100%" viewBox="0 0 100 100">
                                <defs>
                                    <radialGradient id="fade" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                        <stop offset="0%" stopColor="black" stopOpacity="1" />
                                        <stop offset="100%" stopColor="black" stopOpacity="0" />
                                    </radialGradient>
                                </defs>
                                <circle cx="50" cy="50" r="50" fill="url(#fade)" />
                            </svg>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', mb: '1rem' }}>
                            <Box component="img" width={50} src="/img/bear.webp" alt="" sx={{ transform: 'scale(5) rotateZ(-20deg) translateY(4px)' }} />
                            <Box component="img" width={50} src="/img/dog.webp" alt="" sx={{ transform: 'scale(5) rotateZ(-10deg) translateY(0px)' }} />
                            <Box component="img" width={50} src="/img/duck.webp" alt="" sx={{ transform: 'scale(5) rotateZ(10deg) translateY(1.5px)' }} />
                            <Box component="img" width={50} src="/img/witch.webp" alt="" sx={{ transform: 'scale(5) rotateZ(20deg) translateY(4px)' }} />
                        </Box>
                        <Box sx={{ fontFamily: '"Luckiest Guy", cursive', fontWeight: 400, fontStyle: 'normal', fontSize: '5rem', textAlign: 'center', color: '#f9edcd', WebkitTextStroke: '4px rgb(160,120,73)', lineHeight: 0.8, transform: 'scale(1.15)' }}>
                            Race Game
                        </Box>
                        <Box component="img" src="/img/dice.png" alt="" sx={{ position: 'absolute', bottom: 0, left: '-3rem' }} />
                        <Box component="img" src="/img/mystery-spot.png" alt="" sx={{ position: 'absolute', bottom: 0, right: '-4rem' }} />
                    </Box>
                }
                backgroundImage={darkMode ? '/img/background-dark.webp' : '/img/preview.webp'}
                singlePlayerConfig={{}}
                NicknameInputConfig={{
                    PreComponent: (
                        <Box sx={{ flexShrink: 0, mr: 1 }}>
                            <Box sx={{ width: 75, height: 75 }}>
                                <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', mb: 0.5, border: '1px solid', borderColor: 'divider' }}>
                                    <Box sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                                        <Suspense>
                                            <Viewer scale={13}><RenderCharacter character={characters.find((item) => item.name === character?.model)} /></Viewer>
                                        </Suspense>
                                    </Box>
                                </Box>
                            </Box>
                            <ArticlesButton small sx={{ width: '100%' }} onClick={() => setCharacterEdit(true)}>Edit</ArticlesButton>
                        </Box>
                    ),
                }}
                multiplayerConfig={{}}
                gameScoreboardConfig={{
                    append_score_text: 'm',
                    metrics: [
                        { label: 'Games Won', key: 'score', format: (value) => `${value} m` },
                        { label: 'Distance Traveled', key: 'total_distance', format: (value) => `${value} m` },
                    ],
                }}
                disableGameScoreboard={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== 'true'}
                disableAd={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== 'true'}
            />
        </Box>
    );
}
