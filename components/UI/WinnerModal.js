"use client";

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import useGameStore from '@/hooks/useGameStore';
import { useStore } from '@/hooks/useStore';
import ArticlesButton from './Button';

const ArticlesModal = dynamic(() => import('./ArticlesModal'), { ssr: false });

export default function WinnerModal() {
    const gameState = useGameStore((state) => state.gameState);
    const isHost = useGameStore((state) => state.isHost);
    const broadcastToClients = useGameStore((state) => state.broadcastToClients);
    const restartGame = useGameStore((state) => state.restartGame);
    const arcadeMode = useStore((state) => state.arcadeMode);

    useEffect(() => {
        if (!arcadeMode || !gameState?.winner) return;
        const timer = setTimeout(() => window.location.reload(), 5000);
        return () => clearTimeout(timer);
    }, [gameState, arcadeMode]);

    if (!gameState?.winner) return null;

    return (
        <ArticlesModal
            show
            setShow={() => {}}
            title="Game Over!"
            disableClose
            footerOverride={
                <Box sx={{ width: '100%' }}>
                    {isHost && (
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <ArticlesButton onClick={() => {
                                broadcastToClients({ event: 'ReturnToLobby' });
                                window.location.href = '/';
                            }}>
                                Close Lobby
                            </ArticlesButton>
                            <ArticlesButton onClick={restartGame}>Play Again</ArticlesButton>
                        </Box>
                    )}
                </Box>
            }
        >
            <Box sx={{ my: 1 }}>
                <b>{gameState?.winner?.nickname || gameState?.winner?.peer}</b> has won the race!
            </Box>
        </ArticlesModal>
    );
}
