// import { create } from "zustand";
import { createWithEqualityFn as create } from 'zustand/traditional'

export const useAdStore = create((set, get) => ({

    recentlyShownAds: [],
    addRecentlyShownAd: (adId) => {
        const currentAds = get().recentlyShownAds;
        const updatedAds = [...currentAds, adId];
        set({ recentlyShownAds: updatedAds });
    },

}));