import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useStore = create()(
  persist(
    (set, get, store) => ({

      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        });
      },

      darkMode: true,
      setDarkMode: (value) => set({ darkMode: value }),
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

      sidebar: true,
      setSidebar: (value) => set({ sidebar: value }),
      toggleSidebar: () => set({ sidebar: !get().sidebar }),

      showMenu: false,
      setShowMenu: (value) => set({ showMenu: value }),
      toggleShowMenu: () => set({ showMenu: !get().showMenu }),

      landingModel: false,
      setLandingModel: (value) => set({ landingModel: value }),
      toggleLandingModel: () => set({ landingModel: !get().landingModel }),

      graphicsQuality: "High",
      setGraphicsQuality: (value) => set({ graphicsQuality: value }),

      // audioSettings: {
      //   enabled: false,
      //   // Stored as number from 0 to 100 and converted to 0 to 1 in AudioHandler
      //   game_volume: 50,
      //   music_volume: 50,
      // },
      // setAudioSettings: (settings) => set({ audioSettings: settings }),

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

      // Toontown mode changes graphics to be more ToonTown like
      toontownMode: false,
      setToontownMode: (toontownMode) => set({ toontownMode }),

      character: {
        model: 'Duck',
        color: '#FFD801'
      },
      setCharacter: (character) => set({ character }),

      nickname: "",
      setNickname: (nickname) => set({ nickname }),
      randomNickname: () => {
        const adjectives = [
          "Quacky", "Speedy", "Dashing", "Swift", "Webbed",
          "Golden", "Rapid", "Turbo", "Feathered", "Brave",
          "Zippy", "Flashy", "Mighty", "Quick", "Paddling"
        ];
        const nouns = [
          "Racer", "Driver", "Paddler", "Duck", "Mallard",
          "Waddler", "Sprinter", "Zoomer", "Captain", "Pilot",
          "Wingman", "Flyer", "Scooter", "Speedster", "Drake"
        ];
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        const newNickname = `${randomAdjective} ${randomNoun}`;
        set({ nickname: newNickname });
        return newNickname;
      },

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
      name: 'race-game-storage',
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          // perform migration from version 0 to 1
        }
        return persistedState
      },
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true)
      },
      partialize: (state) => ({
        darkMode: state.darkMode,
        renderMode: state.renderMode,
        // arcadeMode: state.arcadeMode,
        toontownMode: state.toontownMode,
        character: state.character,
        nickname: state.nickname,
        graphicsQuality: state.graphicsQuality,
        landingModel: state.landingModel,
        // audioSettings: state.audioSettings,
        controlSettings: state.controlSettings,
      }),
    },
  ),
)