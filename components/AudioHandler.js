"use client";

import { useEffect, useRef } from "react";
// import { useStore } from "./hooks/useStore";
import { useAudioStore } from "./hooks/useAudioStore";

export default function AudioHandler() {

    const audioSettings = useAudioStore((state) => state?.audioSettings);
    const musicRef = useRef(null);

    // Create the Audio object once
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const music = new Audio(`${process.env.NEXT_PUBLIC_CDN}games/Race Game/race-game-audio-loop.mp3`);
        music.onended = function () {
            music.currentTime = 0;
            music.play();
        };
        musicRef.current = music;
        return () => {
            music.pause();
            musicRef.current = null;
        };
    }, []);

    // Start/stop based on enabled state only
    useEffect(() => {
        const music = musicRef.current;
        if (!music) return;
        if (audioSettings?.enabled) {
            music.currentTime = 0;
            music.play();
        } else {
            music.pause();
        }
    }, [audioSettings?.enabled]);

    // Update volume without restarting
    useEffect(() => {
        const music = musicRef.current;
        if (!music) return;
        music.volume = (audioSettings?.music_volume ?? 50) / 100;
    }, [audioSettings?.music_volume]);

    return null;

}