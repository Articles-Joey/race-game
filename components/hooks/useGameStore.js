import { create } from 'zustand';
import Peer from 'peerjs';

function getFirstAvailableRow(players) {
    if (!players || players.length === 0) return 1;

    const occupiedRows = new Set(players.map(p => p.row));
    let row = 1;
    while (occupiedRows.has(row)) {
        row++;
    }
    return row;
}

const useGameStore = create((set, get) => ({
    peer: null,
    myId: null,
    isHost: false,
    hostConn: null,
    connections: [],
    timerInterval: null,
    gameState: {
        // Whether client rendering is enabled in room play, off to preserve client battery and shared experience forcing users to look up.
        roomPlayClientRender: false,
        // If user is one away from winning, they must make exact moves to finish, so four would not win
        strictMovesToFinish: false,
        time: 0,
        status: 'In Lobby', // 'In Lobby', 'In Progress', 'Finished'
        players: [],
        movesShown: 0,
        boardLength: 15,
    },
    kickedIds: [],
    isKicked: false,

    startPeer: (isHost = false) => {
        // Ensure we are in the browser
        if (typeof window === 'undefined') return;

        const oldPeer = get().peer;
        if (oldPeer) oldPeer.destroy();

        const peer = new Peer();

        peer.on('open', (id) => {
            console.log('Peer opened with ID:', id);
            set({ peer, myId: id, isHost });
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

                let firstAvailableRow = getFirstAvailableRow(newPlayers);

                let duplicateStructure = {
                    position: 0,
                    nickname: 'Guest',
                    x: 0,
                    row: firstAvailableRow,
                    spaces: 0,
                    model: "Duck",
                    color: "Yellow"
                }

                newPlayers.push({
                    peer: conn.peer,
                    ...duplicateStructure,
                    race_game: {
                        ...duplicateStructure
                    }
                });

                set((state) => ({

                    connections: [...state.connections, conn],

                    gameState: {
                        ...get().gameState,
                        players: newPlayers
                    }

                }));

                // TODO - Call this or just have this being called periodically during game 
                // broadcastGameState();

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
        const { connections } = get();
        const conn = connections.find((c) => c.peer === peerId);
        if (conn) {
            conn.send({ event: 'Kicked' });
            setTimeout(() => conn.close(), 500);
        }
        set((state) => ({ kickedIds: [...state.kickedIds, peerId] }));
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
                    const spacesCounts = {};

                    // Count occurrences of each 'spaces' value
                    currentPlayers.forEach((p) => {
                        spacesCounts[p.spaces] = (spacesCounts[p.spaces] || 0) + 1;
                    });

                    const updatedPlayers = currentPlayers.map((player) => {

                        let newPlayer = { ...player };
                        let newPlayerRaceGame = { ...player?.race_game };

                        // If duplicate spaces found, set canMove to false
                        if (spacesCounts[newPlayer.spaces] > 1) {
                            newPlayer.canMove = false;
                        } else {
                            // If not colliding, ensure canMove is true (resetting previous state)
                            newPlayer.canMove = true;

                            let tempNewPlayerX = (newPlayer.spaces)

                            newPlayer.x += tempNewPlayerX;
                            newPlayer.spaces = 0;

                            // Add spaces to x and reset spaces
                            // newPlayer.x += newPlayer.spaces;
                            // newPlayer.spaces = 0;

                            newPlayerRaceGame.x += tempNewPlayerX;
                            newPlayerRaceGame.spaces = 0;

                            newPlayer.race_game = newPlayerRaceGame;
                        }
                        return newPlayer;
                    });

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
                            status: winner ? 'Finished' : state.gameState.status
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

            const allPlayersPicked = gameState.players.length > 0 && gameState.players.every(p => p.spaces !== 0);

            let newTime = gameState.time - 1;

            if (allPlayersPicked) {
                newTime = -1;
            }

            if (newTime < 0) {
                console.log("Timer hit 0");

                set((state) => ({
                    gameState: {
                        ...state.gameState,
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

        set({
            gameState: {
                ...get().gameState,
                status: 'In Progress',
                time: 10
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
