"use client";

import { memo, Suspense, useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useSearchParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import LinkIcon from '@mui/icons-material/Link';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import GameMenuPrimaryButtonGroup from '@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup';
import ArticlesButton from './Button';
import DebugPanel from './DebugPanel';
import GameChat from './GameChat';
import PeerLogic from '../PeerLogic';
import { useStore } from '@/hooks/useStore';
import { useAudioStore } from '@/hooks/useAudioStore';
import useGameStore from '@/hooks/useGameStore';

function GameMenu() {
    const searchParams = useSearchParams();
    const server = searchParams.get('server');
    const server_type = searchParams.get('server_type');
    const showMenu = useStore((state) => state.showMenu);
    const setShowMenu = useStore((state) => state.setShowMenu);
    const sidebar = useStore((state) => state.sidebar);
    const debug = useStore((state) => state.debug);
    const renderMode = useStore((state) => state.renderMode);
    const setRenderMode = useStore((state) => state.setRenderMode);
    const audioSettings = useAudioStore((state) => state.audioSettings);
    const setAudioSettings = useAudioStore((state) => state.setAudioSettings);
    const gameState = useGameStore((state) => state.gameState);
    const players = useGameStore((state) => state.gameState?.players);
    const connections = useGameStore((state) => state.connections);
    const broadcastGameState = useGameStore((state) => state.broadcastGameState);
    const startGame = useGameStore((state) => state.startGame);
    const myId = useGameStore((state) => state.myId);
    const isHost = useGameStore((state) => state.isHost);
    const [peerId, setPeerId] = useState(false);
    const shareLink = `/play?server=${peerId}&server_type=${server_type || 'error'}`;

    useEffect(() => setPeerId(myId), [myId]);

    return (
        <Box sx={{ display: showMenu ? 'block' : 'none', '@media (min-width: 992px)': { display: sidebar || showMenu ? 'block' : 'none' } }}>
            {showMenu && (
                <Box
                    onClick={() => setShowMenu(false)}
                    sx={{ position: 'fixed', inset: 0, width: '100%', height: '100%', bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', zIndex: 2 }}
                />
            )}
            <Box
                sx={{
                    position: 'fixed',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    maxWidth: 400,
                    height: 'calc(100vh - 50px)',
                    top: 'var(--top-position)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    transitionDuration: '200ms',
                    zIndex: 10,
                    mx: 'auto',
                    overflowY: 'auto',
                    bgcolor: 'game.card',
                    color: 'text.primary',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 0,
                    '@media (min-width: 992px)': sidebar ? {
                        display: 'block', position: 'relative', top: 0, left: 0, transform: 'none',
                        width: 300, minWidth: 300, fontSize: '0.8rem',
                    } : { fontSize: '0.8rem' },
                }}
            >
                <Box sx={{ p: 1, mt: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', mb: 1 }}>
                        <GameMenuPrimaryButtonGroup useStore={useStore} type="GameMenu" useRouter={useRouter} />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 1, mt: 'auto' }}>
                        {server_type === 'online-socket' && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#212529', color: '#fff', p: 0.5, mb: 1 }}>
                                <Box>
                                    <Box>Room: {server}</Box>
                                    <Box>
                                        <span>Status: </span>
                                        {gameState?.status === 'In Lobby' && <Box component="span" sx={{ color: 'error.main' }}>In Lobby | Need Players</Box>}
                                        {gameState?.status === 'In Progress' && <Box component="span" sx={{ color: 'success.main' }}>In Progress | Pick Space</Box>}
                                    </Box>
                                </Box>
                            </Box>
                        )}
                        {server_type === 'online-peer' && <Box sx={{ p: 0.5, mb: 1 }}><Suspense><PeerLogic /></Suspense></Box>}
                        <Box sx={{ border: '1px solid', borderColor: 'divider', p: 0.5, mb: 1 }}>
                            <Box sx={{ display: 'flex' }}>
                                <ArticlesButton
                                    small
                                    sx={{ width: '50%', mb: 1 }}
                                    startIcon={<ContentPasteIcon />}
                                    onClick={() => navigator.clipboard.writeText(`${window.location.host}${shareLink}`)}
                                >
                                    Share Link
                                </ArticlesButton>
                                <ArticlesButton component="a" href={shareLink} target="_blank" rel="noopener noreferrer" small sx={{ width: '50%', mb: 1 }} startIcon={<LinkIcon />}>
                                    Dev
                                </ArticlesButton>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
                                {peerId && <QRCodeCanvas value={`${window.location.host}${shareLink}`} size={150} />}
                            </Box>
                        </Box>
                        <ArticlesButton
                            small
                            sx={{ width: '100%', mb: 1 }}
                            startIcon={<PlayArrowIcon />}
                            disabled={server_type === 'online-peer' && (!isHost || gameState?.status === 'In Progress')}
                            onClick={() => {
                                if (server_type === 'online-peer' && isHost) {
                                    startGame();
                                    broadcastGameState();
                                }
                            }}
                        >
                            Start Game
                            <Chip size="small" label={`${connections?.length || 0} / 2+`} sx={{ ml: 1, bgcolor: '#212529', color: '#fff' }} />
                        </ArticlesButton>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ width: '50%', '@media (min-width: 992px)': { m: 0.5 } }}>
                            <Box sx={{ fontSize: '0.875em', textAlign: 'center' }}>Audio</Box>
                            <Box sx={{ display: 'flex' }}>
                                {[false, true].map((enabled) => (
                                    <ArticlesButton key={String(enabled)} small sx={{ width: '50%' }} active={Boolean(audioSettings?.enabled) === enabled} onClick={() => setAudioSettings({ ...audioSettings, enabled })}>
                                        {enabled ? 'On' : 'Off'}
                                    </ArticlesButton>
                                ))}
                            </Box>
                        </Box>
                        <Box sx={{ width: '50%', '@media (min-width: 992px)': { m: 0.5 } }}>
                            <Box sx={{ fontSize: '0.875em', textAlign: 'center' }}>Game Style</Box>
                            <Box sx={{ display: 'flex' }}>
                                {['2D', '3D'].map((mode) => <ArticlesButton key={mode} small sx={{ width: '50%', mb: 1 }} active={renderMode === mode} onClick={() => setRenderMode(mode)}>{mode}</ArticlesButton>)}
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <GameChat />
                {debug && (
                    <>
                        <Box>
                            <Box><b>Players</b></Box>
                            {players?.map((player, index) => (
                                <Box key={`${index}-${player.id}`} sx={{ border: '1px solid', borderColor: 'divider', p: 0.5 }}>
                                    <Box>Id: {player.id}</Box>
                                    {player.user_id && <Box>User: {player.user_id}</Box>}
                                    <Box sx={{ display: 'flex', mt: 1 }}><Box sx={{ mr: 3 }}>X = {player.race_game.x}</Box><Box>Y = {player.race_game.y}</Box></Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}><Box sx={{ mr: 3 }}>Row = {player.race_game.row}</Box><Box>Picked = {player.race_game.pickedSpace ? 'True' : 'False'} - {player.race_game.spaces}</Box></Box>
                                </Box>
                            ))}
                        </Box>
                        <DebugPanel />
                    </>
                )}
            </Box>
        </Box>
    );
}

export default memo(GameMenu);
