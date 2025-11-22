import { add } from 'date-fns';
import { create } from 'zustand';
// import Peer from 'peerjs';

const useChatStore = create((set, get) => ({

    messages: [],
    addFakeMessage: (message) => set((state) => ({
        messages: [...state.messages, {
            sender: "Test",
            text: message,
            date: new Date(),
        }]
    })),
    setMessages: (messages) => set({ messages }),

    enabled: false,
    setEnabled: (enabled) => set({ enabled }),
    toggleEnabled: () => set((state) => ({ enabled: !state.enabled })),

    sendMessage: (message) => set((state) => ({
        // Do over host
        // messages: [...state.messages, message]
    })),

}));

export default useChatStore;