"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/hooks/useStore';
import ArticlesModal from './ArticlesModal';

export default function KickedModal() {
    const searchParams = useSearchParams();
    const kicked = searchParams.get('kicked');
    const kickedStore = useStore((state) => state.kicked);
    const setKickedStore = useStore((state) => state.setKicked);

    useEffect(() => {
        if (!kicked) return;
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('kicked');
        window.history.replaceState({}, '', `${window.location.pathname}?${newSearchParams}`);
        setKickedStore({ message: 'You have been removed from the game by the host.' });
    }, [kicked, searchParams, setKickedStore]);

    return (
        <ArticlesModal
            show={Boolean(kickedStore)}
            setShow={setKickedStore}
            title="Removed from Game"
        >
            Kicked: {kickedStore?.message}
        </ArticlesModal>
    );
}
