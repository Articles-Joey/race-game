"use client"
import { add } from 'date-fns';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useStore } from './useStore';
import useGameStore from './useGameStore';
// import Peer from 'peerjs';

const useChatStore = create(persist((set, get) => ({

    messages: [],
    addFakeMessage: (message) => {

        console.log("addFakeMessage called", message)

        set((state) => ({
            messages: [...state.messages, {
                sender: "Test",
                text: message,
                date: new Date(),
            }]
        }))

    },
    setMessages: (messages) => set({ messages }),
    addMessage: (msg) => {

        console.log("Adding chat message in addMessage:", msg)

        set((state) => ({
            messages: [...state.messages, msg]
        }))

    },

    speechBubblesEnabled: false,
    setSpeechBubblesEnabled: (speechBubblesEnabled) => set({ speechBubblesEnabled }),
    toggleSpeechBubblesEnabled: () => set((state) => ({ speechBubblesEnabled: !state.speechBubblesEnabled })),

    enabled: false,
    setEnabled: (enabled) => set({ enabled }),
    toggleEnabled: () => set((state) => ({ enabled: !state.enabled })),

    sendMessage: (message, isHost) => {

        const urlParams = new URLSearchParams(window.location.search)
        const server_type = urlParams.get('server_type');

        const nickname = useStore.getState().nickname || "None";

        const myId = useGameStore.getState().myId;
        const sendToHost = useGameStore.getState().sendToHost;
        // const sendToHost = useGameStore((state) => state.sendToHost);

        console.log("server_type:", server_type, nickname);

        if (
            (
                server_type === "room-play"
                ||
                server_type === "online-peer"
            )
            &&
            isHost
        ) {

            const newMessage = {
                sender: myId,
                nickname: nickname,
                text: message,
                date: new Date(),
            }

            console.log("Peer host sending message:", newMessage);

            let addMessage = get().addMessage;
            let addFakeMessage = get().addFakeMessage;

            // const addMessage = useChatStore.getState().addMessage;

            addMessage(newMessage);

            const broadcastPeerChatMessage = useGameStore.getState().broadcastPeerChatMessage;
            // const { broadcastPeerChatMessage } = get();
            broadcastPeerChatMessage(
                myId,
                message,
                nickname
            );

            // addFakeMessage("TEST")

            // sendToHost({
            //     event: "ChatMessage",
            //     message
            // })
        }

        if (
            (
                server_type === "room-play"
                ||
                server_type === "online-peer"
            )
            &&
            !isHost
        ) {
            console.log("Peer client sending message:", message);
            sendToHost({
                event: "ChatMessage",
                message
            })
        }

        if (
            server_type === "online-socket"
        ) {
            console.log("Socket sending message:", message);
        }

        // return {

        //     messages: [
        //         ...state.messages,
        //         // {
        //         //     sender: "You",
        //         //     text: message,
        //         //     date: new Date(),
        //         // }
        //     ]

        // }

    },

}), {
    name: 'chat-storage',
    partialize: (state) => ({
        speechBubblesEnabled: state.speechBubblesEnabled,
        enabled: state.enabled,
    }),
}));

export default useChatStore;