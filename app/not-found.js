"use client";

import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';
import ArticlesButton from '@/components/UI/Button';

export default function NotFound() {
    return (
        <Box sx={{ position: 'relative', isolation: 'isolate', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, minHeight: '100vh' }}>
            <Box sx={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: -1 }}>
                <Image
                    src={`${process.env.NEXT_PUBLIC_CDN}games/Race Game/background.jpg`}
                    fill
                    alt=""
                    style={{ objectFit: 'cover', filter: 'blur(3px)' }}
                />
            </Box>
            <Box sx={{ bgcolor: 'game.card', color: 'text.primary', border: '1px solid', borderColor: 'divider', borderRadius: 0, boxShadow: '0 1rem 3rem rgba(0,0,0,0.175)', textAlign: 'center' }}>
                <Box sx={{ px: 2, py: 1, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}><b>404 - Not Found</b></Box>
                <Box sx={{ p: 2 }}>Could not find the requested page</Box>
                <Box sx={{ px: 2, py: 1, bgcolor: 'action.hover', borderTop: '1px solid', borderColor: 'divider' }}>
                    <ArticlesButton component={Link} href="/" startIcon={<HomeIcon />}>Return to Home</ArticlesButton>
                </Box>
            </Box>
        </Box>
    );
}
