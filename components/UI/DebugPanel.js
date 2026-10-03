"use client";

import { useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArticlesButton from './Button';
import IsDev from './IsDev';
import useCameraStore from '@/hooks/useCameraStore';
import useGameStore from '@/hooks/useGameStore';
import { useSocketStore } from '@/hooks/useSocketStore';
import { useSearchParams } from 'next/navigation';

const cameraPresets = [
    { name: 'Starting', position: [19, 10, 15] },
    { name: 'Bleacher', position: [28.32, 5.38, -6.30] },
    { name: 'First Person', position: [0, 3.5, 0] },
    { name: 'Wind Turbine', position: [42.50, 16.94, -125.86] },
];

export default function DebugPanel() {
    const setCameraUpdate = useCameraStore((state) => state.setCameraUpdate);
    const startGame = useGameStore((state) => state.startGame);
    const socket = useSocketStore((state) => state.socket);
    const searchParams = useSearchParams();
    const server = searchParams.get('server');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    return (
        <Box>
            <IsDev>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ fontSize: '0.875em', textAlign: 'center' }}>Dev Debug</Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', mb: 1 }}>
                    <ArticlesButton small variant="warning" sx={{ mb: 1 }} onClick={() => {}}>Reset Room</ArticlesButton>
                    <ArticlesButton small variant="warning" sx={{ mb: 1 }} onClick={startGame}>Force Start</ArticlesButton>
                    <ArticlesButton
                        small
                        variant="warning"
                        sx={{ mb: 1 }}
                        onClick={() => socket?.emit('race-game-generate-mystery-spots', { server, settings: {} })}
                    >
                        Generate Mystery Spots
                    </ArticlesButton>
                </Box>
            </IsDev>
            <ArticlesButton
                id="camera-presets-button"
                sx={{ width: '100%' }}
                aria-haspopup="menu"
                aria-controls={open ? 'camera-presets-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                onClick={(event) => setAnchorEl(event.currentTarget)}
                endIcon={<ExpandMoreIcon />}
            >
                Camera Presets
            </ArticlesButton>
            <Menu
                id="camera-presets-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                slotProps={{ list: { 'aria-labelledby': 'camera-presets-button' } }}
            >
                {cameraPresets.map((preset) => (
                    <MenuItem
                        key={preset.name}
                        onClick={() => {
                            setCameraUpdate({ position: preset.position });
                            setAnchorEl(null);
                        }}
                    >
                        {preset.name}
                    </MenuItem>
                ))}
            </Menu>
            <Box sx={{ display: 'none' }}>
                <Box sx={{ textAlign: 'center' }}>Camera Positions</Box>
                <Box sx={{ display: 'grid', gap: '5px', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    {cameraPresets.map((preset) => (
                        <ArticlesButton key={preset.name} small onClick={() => setCameraUpdate({ position: preset.position })}>
                            {preset.name}
                        </ArticlesButton>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
