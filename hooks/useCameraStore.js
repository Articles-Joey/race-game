import { create } from 'zustand';
// import Peer from 'peerjs';

const useCameraStore = create((set, get) => ({

    cameraState: { position: [0, 0, 5] },
    cameraUpdate: false,
    setCameraState: (cameraState) => set({ cameraState }),
    setCameraUpdate: (cameraUpdate) => set({ cameraUpdate }),

    // startGame: () => {

    //     set({ 
    //         gameState: { status: 'In Progress' } 
    //     });

    // }

}));

export default useCameraStore;