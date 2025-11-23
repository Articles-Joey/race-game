import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useStore = create()(
  persist(
    (set, get, store) => ({

      darkMode: true,
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),

      infoModal: false,
      setInfoModal: (value) => set({ infoModal: value }),
      toggleInfoModal: () => set({ infoModal: !get().infoModal }),

      loginInfoModal: false,
      setLoginInfoModal: (value) => set({ loginInfoModal: value }),
      toggleLoginInfoModal: () => set({ loginInfoModal: !get().loginInfoModal }),

      showSettingsModal: false,
      setShowSettingsModal: (value) => set({ showSettingsModal: value }),
      toggleSettingsModal: () => set({ showSettingsModal: !get().showSettingsModal }),

      showCreditsModal: false,
      setShowCreditsModal: (value) => set({ showCreditsModal: value }),
      toggleCreditsModal: () => set({ showCreditsModal: !get().showCreditsModal }),

      // 2D or 3D
      renderMode: '3D',
      setRenderMode: (mode) => set({ renderMode: mode }),

      devDebug: false,
      setDevDebug: (value) => set({ devDebug: value }),
      toggleDevDebug: () => set({ devDebug: !get().devDebug }),

      showMenu: false,
      setShowMenu: (value) => set({ showMenu: value }),
      toggleShowMenu: () => set({ showMenu: !get().showMenu }),

      audioSettings: {
        enabled: false,
        // Stored as number from 0 to 100 and converted to 0 to 1 in AudioHandler
        game_volume: 50,
        music_volume: 50,
      },
      setAudioSettings: (settings) => set({ audioSettings: settings }),

      // Automates end of game and starting new ones for hands off arcade fun
      arcadeMode: false,
      setArcadeMode: (arcadeMode) => set({ arcadeMode }),

      character: {
        model: 'Duck',
        color: '#FFD801'
      },
      setCharacter: (character) => set({ character }),

      gameState: {},
      setGameState: (gameState) => set({ gameState }),

      kicked: null,
      setKicked: (reason) => set({ kicked: reason }),

      socketServerHost: process.env.NEXT_PUBLIC_NODE_SERVER,
      setSocketServerHost: (host) => set({ socketServerHost: host }),

      reset: () => {
        set(store.getInitialState())
      },

    }),
    {
      name: 'race-game-storage', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)