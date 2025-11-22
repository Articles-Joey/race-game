import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useStore = create()(
  persist(
    (set, get) => ({

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
        volume: 0.25
      },
      setAudioSettings: (settings) => set({ audioSettings: settings }),

      character: {
        model: 'Duck',
        color: '#FFD801'
      },
      setCharacter: (character) => set({ character }),

      gameState: {},
      setGameState: (gameState) => set({ gameState }),

      kicked: null,
      setKicked: (reason) => set({ kicked: reason }),

    }),
    {
      name: 'race-game-storage', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)