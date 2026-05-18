// README - Zustand store to manage game state and peer-to-peer connections using PeerJS. Also handles the game loop for peer games.

"use client"
import { create } from 'zustand';
import Peer from 'peerjs';
import { useStore } from './useStore';
import useChatStore from './useChatStore';

function getFirstAvailableRow(players) {
    if (!players || players.length === 0) return 1;

    const occupiedRows = new Set(players.map(p => p.row));
    let row = 1;
    while (occupiedRows.has(row)) {
        row++;
    }
    return row;
}

// Shared function to minimize code
function createPlayer(id, players, bot, nickname, character) {

    let firstAvailableRow = getFirstAvailableRow(players);

    let duplicateStructure = {
        position: 0,
        nickname: nickname || 'Guest',
        character: character || false,
        x: 0,
        row: firstAvailableRow,
        spaces: 0,
        model: "Duck",
        color: "Yellow",
        bot: bot || false,
    }

    return {
        peer: id,
        ...duplicateStructure,
        race_game: {
            ...duplicateStructure
        }
    }

}

function setPlayerMove(peerId, spaces) {

    const urlParams = new URLSearchParams(window.location.search);
    const server_type = urlParams.get('server_type');

    if (server_type == 'online-peer') {

    }

    if (server_type == 'room-play') {

    }

    if (server_type == 'online-socket') {

    }

    return;

    // unverified code below

    const tempPlayers = get().gameState.players;

    const newPlayers = tempPlayers.map(player => {
        if (player.peer === peerId) {
            return {
                ...player,
                spaces: spaces,
            };
        }
        return player;
    });

    set({
        gameState: {
            ...get().gameState,
            players: newPlayers
        }
    });

}

const initialGameStoreState = {
    // Whether client rendering is enabled in room play, off to preserve client battery and shared experience forcing users to look up.
    roomPlayClientRender: false,
    // If user is one away from winning, they must make exact moves to finish, so four would not win
    strictMovesToFinish: false,
    time: 0,
    status: 'In Lobby', // 'In Lobby', 'In Progress', 'Finished'
    players: [],
    movesShown: 0,
    boardLength: 15,
    mysterySpots: [
        // Generate on game start
    ],
}

const useGameStore = create((set, get) => ({
    peer: null,
    myId: null,
    isHost: false,
    hostConn: null,
    connections: [],
    timerInterval: null,
    gameState: {
        ...initialGameStoreState
    },
    setGameState: (newState) => {

        set({
            gameState: newState
        });

        get().handleGameTimer();

    },
    resetGameState: () => {
        set({
            gameState: {
                ...initialGameStoreState
            }
        });
    },
    createBot: () => {
        const botId = `Bot_${Math.floor(Math.random() * 10000)}`;

        let newPlayers = get().gameState.players;
        newPlayers.push(
            createPlayer(
                botId,
                newPlayers,
                true,
                botId
            ),
        );
        set({
            gameState: {
                ...get().gameState,
                players: newPlayers
            }
        });
    },
    kickedIds: [],
    isKicked: false,

    startPeer: (isHost = false) => {
        // Ensure we are in the browser
        if (typeof window === 'undefined') return;

        const oldPeer = get().peer;
        if (oldPeer) oldPeer.destroy();

        const randomFourDigit = Math.floor(1000 + Math.random() * 9000);

        const peer = new Peer(`articles-media-race-game-${randomFourDigit}`);

        peer.on('open', (id) => {

            console.log('Peer opened with ID:', id);

            const urlParams = new URLSearchParams(window.location.search);
            const server_type = urlParams.get('server_type')
            console.log('server_type:', server_type);

            set({ peer, myId: id, isHost });

            if (server_type == 'online-peer') {

                let newPlayers = get().gameState.players

                const nickname = useStore.getState().nickname || "Guest";
                const character = useStore.getState().character

                newPlayers.push(
                    createPlayer(
                        id,
                        newPlayers,
                        false,
                        nickname,
                        character || false
                    ),
                );

                console.log('New players with injected host for online-peer game!:', newPlayers);

                set({
                    gameState: {
                        ...get().gameState,
                        players: newPlayers
                    }
                });

            }

        });

        peer.on('connection', (conn) => {

            console.log('Incoming connection from:', conn.peer);

            if (get().kickedIds.includes(conn.peer)) {
                console.log('Connection rejected (kicked):', conn.peer);
                conn.on('open', () => {
                    conn.send({ event: 'Kicked' });
                    setTimeout(() => conn.close(), 500);
                });
                return;
            }

            conn.on('open', () => {

                console.log('Connection opened:', conn.peer);

                let newPlayers = get().gameState.players

                // let firstAvailableRow = getFirstAvailableRow(newPlayers);

                // let duplicateStructure = {
                //     position: 0,
                //     nickname: 'Guest',
                //     x: 0,
                //     row: firstAvailableRow,
                //     spaces: 0,
                //     model: "Duck",
                //     color: "Yellow"
                // }

                // newPlayers.push({
                //     peer: conn.peer,
                //     ...duplicateStructure,
                //     race_game: {
                //         ...duplicateStructure
                //     }
                // });

                newPlayers.push(
                    createPlayer(
                        conn.peer,
                        newPlayers
                    ),
                );

                const arcadeMode = useStore.getState().arcadeMode;

                if (
                    newPlayers?.length >= 2
                    &&
                    arcadeMode
                ) {
                    console.log("TODO - Arcade mode logic");
                    // Let any user start game in arcade mode or auto start when enough players?
                }

                set((state) => ({

                    connections: [...state.connections, conn],

                    gameState: {
                        ...get().gameState,
                        players: newPlayers
                    }

                }));

                const { broadcastGameState } = get();
                broadcastGameState();

            });

            conn.on('data', (data) => {

                console.log('Received data from client:', data);
                // Handle game state updates here if needed

                if (data?.event === 'PlayerMove') {

                    console.log("PlayerMove data received", conn.peer, data);

                    // const newCharacterState = data.characterState;

                    let tempPlayers = get().gameState.players;

                    const newPlayers = tempPlayers.map(player => {
                        if (player.peer === conn.peer) {
                            return {
                                ...player,
                                spaces: data.spaces,
                                race_game: {
                                    ...player.race_game,
                                    spaces: data.spaces
                                }
                            };
                        }
                        return player;
                    });

                    set({
                        gameState: {
                            ...get().gameState,
                            players: newPlayers
                        }
                    });

                }

                // Does nickname and character state update
                if (data?.event === 'PlayerNickname') {

                    console.log("PlayerNickname data received", conn.peer, data);

                    // const newCharacterState = data.characterState;

                    let tempPlayers = get().gameState.players;

                    const newPlayers = tempPlayers.map(player => {
                        if (player.peer === conn.peer) {
                            return {
                                ...player,
                                nickname: data.nickname,
                                character: data.character,
                                race_game: {
                                    ...player.race_game,
                                    nickname: data.nickname,
                                    character: data.character
                                }
                            };
                        }
                        return player;
                    });

                    set({
                        gameState: {
                            ...get().gameState,
                            players: newPlayers
                        }
                    });

                    const { broadcastGameState } = get();
                    broadcastGameState();

                }

                if (data?.event === 'ChatMessage') {

                    let players = get().gameState.players
                    let playerNicknameLookup = players.find(p => p.peer === conn.peer);

                    console.log("ChatMessage data received", conn.peer, data, playerNicknameLookup);

                    const simpleCensor = (text) => {
                        // TODO - Use package for better censorship
                        // const bannedWords = ['retard', 'nigger'];
                        // for (const word of bannedWords) {
                        //     const regex = new RegExp(word, 'gi');
                        //     if (regex.test(text)) {
                        //         return "REDACTED";
                        //     }
                        // }
                        return text;
                    }

                    let finalMessage = simpleCensor(data.message);

                    // Host adds their own message
                    const addMessage = useChatStore.getState().addMessage;
                    addMessage({
                        sender: conn.peer,
                        text: finalMessage,
                        nickname: playerNicknameLookup?.nickname || null
                    });

                    const { broadcastPeerChatMessage } = get();
                    broadcastPeerChatMessage(
                        conn.peer,
                        finalMessage,
                        playerNicknameLookup?.nickname || null
                    );

                }

            });

            conn.on('close', () => {

                console.log('Connection closed:', conn.peer);

                set((state) => ({
                    connections: state.connections.filter((c) => c.peer !== conn.peer),
                    gameState: {
                        ...state.gameState,
                        players: state.gameState.players.filter((p) => p.peer !== conn.peer)
                    }
                }));

            });

            conn.on('error', (err) => {
                console.error('Connection error:', err);
            });

        });

        peer.on('error', (err) => {
            console.error('Peer error:', err);
        });
    },

    connectToHost: (hostId) => {
        set({ isKicked: false });
        const { peer } = get();
        if (!peer) {
            console.error('Peer not initialized');
            return;
        }

        console.log('Connecting to host:', hostId);
        const conn = peer.connect(hostId);

        conn.on('open', () => {
            console.log('Connected to host');
            set({ hostConn: conn });
        });

        conn.on('data', (data) => {
            console.log('Received data from host:', data);

            if (data?.event === 'Kicked') {
                console.log('Kicked by host!!!!!!!!!!');
                window.location.href = '/?kicked=true'
                // router.push('/');
                // set({ isKicked: true });
            }

            if (data?.event === 'GameStateUpdate') {
                set({ gameState: data.gameState });
            }

            if (data?.event === 'ChatMessage') {
                // TODO - Handle incoming chat message
                console.log('Chat message received:', data);
                const addMessage = useChatStore.getState().addMessage;
                addMessage({
                    ...data,
                    sender: data.id,
                    text: data.message
                });
            }

            if (data?.event === 'ReturnToLobby') {
                // TODO
            }

            // if (data?.event === 'CharacterUpdate') {

            //     const newCharacterState = data.characterState;

            //     set({
            //         gameState: {
            //             ...get().gameState,
            //             players: {
            //                 ...get().gameState.players,
            //                 [conn.peer]: newCharacterState
            //             }
            //         }
            //     });
            // }

            // Handle game state updates here
        });

        conn.on('close', () => {
            console.log('Disconnected from host');
            set({ hostConn: null });
        });

        conn.on('error', (err) => {
            console.error('Connection to host error:', err);
        });
    },

    sendToHost: (data) => {
        const { hostConn } = get();
        if (hostConn) {
            hostConn.send(data);
        } else {
            console.warn('Cannot send: No connection to host');
        }
    },

    broadcastToClients: (data) => {
        const { connections } = get();
        connections.forEach((conn) => {
            if (conn.open) {
                conn.send(data);
            }
        });
    },

    removeConnection: (peerId) => {

        console.log("Removing connection for peerId:", peerId);

        const { connections } = get();
        const conn = connections.find((c) => c.peer === peerId);
        if (conn) {
            conn.send({ event: 'Kicked' });
            setTimeout(() => conn.close(), 500);
        }
        set((state) => ({ kickedIds: [...state.kickedIds, peerId] }));

        const { broadcastGameState } = get();
        broadcastGameState();

    },

    removeBot: (id) => {

        console.log("Removing bot for id:", id);

        // const { connections } = get();
        // const conn = connections.find((c) => c.id === id);
        // if (conn) {
        //     conn.send({ event: 'Kicked' });
        //     setTimeout(() => conn.close(), 500);
        // }
        // set((state) => ({ kickedIds: [...state.kickedIds, peerId] }));

        let newPlayers = get().gameState.players;
        newPlayers = newPlayers.filter((player) => player.peer !== id);
        set({
            gameState: {
                ...get().gameState,
                players: newPlayers
            }
        });

        const { broadcastGameState } = get();
        broadcastGameState();

    },

    broadcastGameState: () => {

        const { connections, gameState } = get();

        connections.forEach((conn) => {
            if (conn.open) {
                conn.send({
                    event: 'GameStateUpdate',
                    gameState
                });
            }
        });
    },

    broadcastPeerChatMessage: (id, message, nickname) => {

        const { connections } = get();

        connections.forEach((conn) => {
            if (conn.open) {
                conn.send({
                    event: 'ChatMessage',
                    id,
                    message,
                    nickname
                });
            }
        });

    },

    disconnect: () => {
        const { peer, hostConn, connections, timerInterval } = get();
        if (timerInterval) clearInterval(timerInterval);
        if (hostConn) hostConn.close();
        connections.forEach((c) => c.close());
        if (peer) peer.destroy();

        set({
            peer: null,
            myId: null,
            hostConn: null,
            connections: [],
            timerInterval: null,
            isHost: false,
            kickedIds: [],
            gameState: {
                ...get().gameState,
                status: 'In Lobby'
            },
        });
    },

    handleGameTimer: () => {
        const { isHost } = get();
        if (!isHost) return;

        if (get().timerInterval) clearInterval(get().timerInterval);

        const interval = setInterval(() => {
            const { gameState, broadcastGameState } = get();

            if (gameState.status !== 'In Progress') {
                clearInterval(get().timerInterval);
                set({ timerInterval: null });
                return;
            }

            if (gameState.movesShown > 0) {

                const newMovesShown = gameState.movesShown - 1;

                if (newMovesShown === 0) {

                    const currentPlayers = get().gameState.players;

                    const updatedPlayers = currentPlayers.map((player) => {

                        let newPlayer = { ...player };
                        let newPlayerRaceGame = { ...player?.race_game };

                        if (newPlayer.canMove) {
                            let tempNewPlayerX = (newPlayer.spaces)
                            newPlayer.x += tempNewPlayerX;
                            newPlayerRaceGame.x += tempNewPlayerX;
                        }

                        newPlayer.spaces = 0;
                        newPlayerRaceGame.spaces = 0;
                        newPlayer.race_game = newPlayerRaceGame;

                        return newPlayer;
                    });

                    // Check for mystery spots
                    let activeMysterySpot = null;
                    let updatedMysterySpots = [...(get().gameState.mysterySpots || [])];

                    for (const player of updatedPlayers) {

                        const spotIndex = updatedMysterySpots.findIndex(s => s.x === player.x && s.row === player.row);

                        if (spotIndex !== -1) {
                            const spot = updatedMysterySpots[spotIndex];
                            activeMysterySpot = {
                                mysterySpot: spot,
                                player: player,
                                timer: 5
                            };
                            updatedMysterySpots.splice(spotIndex, 1);
                            break;
                        }

                    }

                    // TODO - If two people win at same time it just picks first one in list, fix that

                    let winner = null;
                    const boardLength = get().gameState.boardLength;

                    for (const player of updatedPlayers) {
                        if (player.x >= boardLength - 1) {
                            winner = player;
                            break;
                        }
                    }

                    set((state) => ({
                        gameState: {
                            ...state.gameState,
                            players: updatedPlayers,
                            movesShown: 0,
                            time: 10,
                            winner: winner || state.gameState.winner,
                            status: winner ? 'Finished' : state.gameState.status,
                            activeMysterySpot: activeMysterySpot || null,
                            mysterySpots: updatedMysterySpots
                        }
                    }));

                } else {

                    set((state) => ({
                        gameState: {
                            ...state.gameState,
                            movesShown: newMovesShown
                        }
                    }));

                }

                broadcastGameState();
                return;
            }

            if (gameState.activeMysterySpot) {
                const newTimer = gameState.activeMysterySpot.timer - 1;

                if (newTimer <= 0) {

                    const { mysterySpot, player: triggeringPlayer } = gameState.activeMysterySpot;
                    const { target, spaces } = mysterySpot;

                    console.log("Applying mystery spot effect:", target, spaces);

                    const currentPlayers = get().gameState.players;
                    const updatedPlayers = currentPlayers.map(p => {
                        // Create a deep copy of the player and race_game to avoid mutation issues
                        let newP = {
                            ...p,
                            race_game: { ...p.race_game }
                        };

                        if (target === 'Player') {
                            if (p.peer === triggeringPlayer.peer) {
                                newP.x = Math.max(0, newP.x + spaces);
                                newP.race_game.x = newP.x;
                            }
                        } else if (target === 'Others') {
                            if (p.peer !== triggeringPlayer.peer) {
                                newP.x = Math.max(0, newP.x + spaces);
                                newP.race_game.x = newP.x;
                            }
                        }
                        return newP;
                    });

                    set((state) => ({
                        gameState: {
                            ...state.gameState,
                            players: updatedPlayers,
                            activeMysterySpot: null
                        }
                    }));

                } else {
                    set((state) => ({
                        gameState: {
                            ...state.gameState,
                            activeMysterySpot: {
                                ...state.gameState.activeMysterySpot,
                                timer: newTimer
                            }
                        }
                    }));
                }
                broadcastGameState();
                return;
            }

            const allPlayersPicked = gameState.players.length > 0 && gameState.players.every(p => p.bot || p.spaces !== 0);

            let newTime = gameState.time - 1;

            if (allPlayersPicked) {
                newTime = -1;
            }

            if (newTime < 0) {
                console.log("Timer hit 0");

                let currentPlayers = get().gameState.players;

                // 1. Handle Bot Moves
                currentPlayers = currentPlayers.map((player) => {
                    if (player.bot) {
                        const randomSpaces = Math.floor(Math.random() * 4) + 1;
                        return {
                            ...player,
                            spaces: randomSpaces,
                            race_game: {
                                ...player.race_game,
                                spaces: randomSpaces
                            }
                        };
                    }
                    return player;
                });

                // 2. Calculate Collisions (canMove)
                const spacesCounts = {};
                currentPlayers.forEach((p) => {
                    if (p.spaces > 0) {
                        spacesCounts[p.spaces] = (spacesCounts[p.spaces] || 0) + 1;
                    }
                });

                const playersWithStatus = currentPlayers.map((player) => {
                    let newPlayer = { ...player };
                    // If duplicate spaces found, set canMove to false
                    if (spacesCounts[newPlayer.spaces] > 1) {
                        newPlayer.canMove = false;
                    } else {
                        newPlayer.canMove = true;
                    }
                    return newPlayer;
                });

                set((state) => ({
                    gameState: {
                        ...state.gameState,
                        players: playersWithStatus,
                        movesShown: 3
                    }
                }));

            } else {
                set((state) => ({
                    gameState: {
                        ...state.gameState,
                        time: newTime
                    }
                }));
            }

            broadcastGameState();

        }, 1000);

        set({ timerInterval: interval });
    },

    startGame: () => {

        const currentPlayers = get().gameState.players;
        const currentBoardLength = get().gameState.boardLength;

        const randomSpaces = (Math.floor(Math.random() * 4) + 1) * (Math.random() < 0.5 ? -1 : 1);

        const mysterySpots = Array.from({ length: currentPlayers.length }, () => ({
            x: Math.floor(Math.random() * currentBoardLength) + 1,
            row: Math.floor(Math.random() * currentPlayers.length) + 1,

            // -4 to 4, excluding 0
            target: Math.random() < 0.5 ? 'Player' : 'Others',
            spaces: randomSpaces,

            action: {
                direction: randomSpaces,
                spaces: randomSpaces > 0 ? 'Forward' : 'Backward',
            }
        }));

        console.log("Starting game:", currentPlayers, mysterySpots);

        set({
            gameState: {
                ...get().gameState,
                status: 'In Progress',
                time: 10,
                mysterySpots,
            }
        });

        get().handleGameTimer();

    },

    toggleRoomPlayClientRender: () => {
        const { broadcastGameState } = get();

        set((state) => ({
            gameState: {
                ...state.gameState,
                roomPlayClientRender: !state.gameState.roomPlayClientRender,
            }
        }));

        broadcastGameState();

    },

    setBoardLength: (size) => {
        const { broadcastGameState } = get();

        set((state) => ({
            gameState: {
                ...state.gameState,
                boardLength: size,
            }
        }));

        broadcastGameState();

    },

    restartGame: () => {
        const { timerInterval, broadcastGameState } = get();
        if (timerInterval) clearInterval(timerInterval);

        const currentPlayers = get().gameState.players;
        const resetPlayers = currentPlayers.map(player => ({
            ...player,
            x: 0,
            spaces: 0,
            race_game: {
                ...player.race_game,
                x: 0,
                spaces: 0
            }
        }));

        set((state) => ({
            timerInterval: null,
            gameState: {
                ...state.gameState,
                status: 'In Lobby',
                time: 0,
                movesShown: 0,
                winner: null,
                players: resetPlayers
            }
        }));

        broadcastGameState();
    }

}));

export default useGameStore;
