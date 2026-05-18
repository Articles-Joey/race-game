import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import typicalZustandStoreExcludes from '@articles-media/articles-dev-box/typicalZustandStoreExcludes';
import typicalZustandStoreStateSlice from '@articles-media/articles-dev-box/typicalZustandStoreStateSlice';

import randomNicknameConfig from '@/util/randomNicknameConfig';

const assets_src = 'games/Race Game/'

export const useStore = create()(
  persist(
    (set, get, store) => ({

      ...typicalZustandStoreStateSlice(
        set,
        get,
        randomNicknameConfig,
      ),

      // 2D or 3D
      renderMode: '3D',
      setRenderMode: (mode) => set({ renderMode: mode }),

      landingModel: true,
      setLandingModel: (value) => set({ landingModel: value }),
      toggleLandingModel: () => set({ landingModel: !get().landingModel }),

      controlSettings: {
        "Move 1 Space": false,
        "Move 2 Space": false,
        "Move 3 Space": false,
        "Move 4 Space": false,
      },
      setControlSettings: (settings) => set({ controlSettings: settings }),

      // Automates end of game and starting new ones for hands off arcade fun
      arcadeMode: false,
      setArcadeMode: (arcadeMode) => set({ arcadeMode }),

      character: {
        model: 'Duck',
        color: '#FFD801'
      },
      setCharacter: (character) => set({ character }),
      characters: [
        {
          name: "Duck",
          image: `${process.env.NEXT_PUBLIC_CDN}${assets_src}duck.png`,
          // model: <Duck color={character?.color || '#FFF'} />,
          defaultColor: '#FFFFFF',
        },
        {
          name: "Dog",
          image: `${process.env.NEXT_PUBLIC_CDN}${assets_src}dog.png`,
          // model: <Dog color={character?.color || '#FFF'} />,
          defaultColor: '',
        },
        {
          name: "Bear",
          image: `${process.env.NEXT_PUBLIC_CDN}${assets_src}bear.png`,
          // model: <Bear color={character?.color || '#FFF'} />,
          defaultColor: '',
        },
        {
          name: "Witch",
          image: `${process.env.NEXT_PUBLIC_CDN}${assets_src}witch.jpg`,
          // model: <Witch color={character?.color || '#FFF'} />,
          defaultColor: '',
        },
      ],

      kicked: null,
      setKicked: (reason) => set({ kicked: reason }),

      reset: () => {
        set(store.getInitialState())
      },

    }),
    {
      name: `${process.env.NEXT_PUBLIC_GAME_KEY}-site-storage`,
      version: 2,
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true)
      },
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => ![
            ...typicalZustandStoreExcludes,
          ].includes(key))
        ),
    },
  ),
)