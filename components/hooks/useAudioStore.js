import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useAudioStore = create()(
    persist(
        (set, get, store) => ({

            audioSettings: {
                enabled: false,
                // Stored as number from 0 to 100 and converted to 0 to 1 in AudioHandler
                game_volume: 50,
                music_volume: 50,
            },
            setAudioSettings: (settings) => set({ audioSettings: settings }),

        }),
        {
            name: 'race-game-audio-storage',
            version: 1,
        },
    ),
)