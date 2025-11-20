"use client";

import { add } from "date-fns";
import { createWithEqualityFn as create } from "zustand/traditional";

const usePeerConnection = create((set) => ({
  peerRef: null,
  setPeerRef: (peerRef) => set({ peerRef }),

  peerId: null,
  connect: null,
  isReady: false,
  connections: [],
  setPeerId: (peerId) => set({ peerId }),
  setConnect: (connect) => set({ connect }),
  setIsReady: (isReady) => set({ isReady }),
  setConnections: (connections) => set({ connections }),
  addConnection: (connection) =>
    set((state) => ({ connections: [...state.connections, connection] })),
  removeConnection: (peerId) =>
    set((state) => ({
      connections: state.connections.filter(
        (conn) => conn.peer !== peerId
      ),
    }))
}));

export default usePeerConnection;
