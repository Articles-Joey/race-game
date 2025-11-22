"use client";

import { useEffect, useRef, useState } from 'react';
import useGameStore from './hooks/useGameStore';
import { useSearchParams } from 'next/navigation';

const PeerLogic = () => {

    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    const {
        server_id,
        server_type
    } = searchParamsObject

    const [targetId, setTargetId] = useState('');

    const myId = useGameStore((state) => state.myId);
    const isHost = useGameStore((state) => state.isHost);
    const hostConn = useGameStore((state) => state.hostConn);
    const connections = useGameStore((state) => state.connections);

    const startPeer = useGameStore((state) => state.startPeer);

    const gameState = useGameStore((state) => state.gameState);
    const startGame = useGameStore((state) => state.startGame);

    const connectToHost = useGameStore((state) => state.connectToHost);
    const disconnect = useGameStore((state) => state.disconnect);
    const sendToHost = useGameStore((state) => state.sendToHost);
    const broadcastToClients = useGameStore((state) => state.broadcastToClients);
    const removeConnection = useGameStore((state) => state.removeConnection);
    const isKicked = useGameStore((state) => state.isKicked);

    const setBoardLength = useGameStore((state) => state.setBoardLength);

    const roomPlayClientRender = useGameStore((state) => state.gameState.roomPlayClientRender);
    const toggleRoomPlayClientRender = useGameStore((state) => state.toggleRoomPlayClientRender);

    const handleStartHost = () => {
        startPeer(true);
    };

    const handleStartClient = () => {
        startPeer(false);
    };

    const handleConnect = () => {
        if (targetId) {
            connectToHost(targetId);
        }
    };

    const handlePing = () => {
        if (isHost) {
            broadcastToClients({ type: 'PING', from: myId });
        } else {
            sendToHost({ type: 'PING', from: myId });
        }
    };

    useEffect(() => {

        setTargetId('')

    }, [
        myId, hostConn
    ]);

    const shouldBecomeHost = useRef(false);
    useEffect(() => {

        if (server_type == "room-play" && !server_id) {
            shouldBecomeHost.current = true;
            console.log("Auto become host check SET TRUE")
            handleStartHost();
        }

    }, [
        server_type,
        server_id
    ]);

    const hasAutoConnected = useRef(false);
    useEffect(() => {

        if (server_type == "room-play") {

            console.log(
                "Auto connect check DETECTED",
                hasAutoConnected.current,
                hostConn,
                server_id,
                myId
            )

            if (!hasAutoConnected.current && !hostConn && server_id) {
                startPeer(false);
                console.log("Auto connect check START CLIENT")
                // setTargetId(server_id);
                // connectToHost(server_id);
                hasAutoConnected.current = true;
            }

            if (hasAutoConnected.current && !hostConn && server_id && myId) {
                // startPeer(false);
                console.log("Auto connect check PASSED")
                setTargetId(server_id);
                connectToHost(server_id);
                // hasAutoConnected.current = true;
            }

        }

    }, [
        myId, server_type, server_id, hostConn
    ]);

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', background: '#f9f9f9', color: '#333' }}>

            <h2>Peer Logic Control</h2>

            <div style={{ marginBottom: '10px' }}>
                <strong>Status: </strong>
                {myId ? (
                    <span style={{ color: 'green' }}>Online ({isHost ? 'Host' : 'Client'})</span>
                ) : (
                    <span style={{ color: 'red' }}>Offline</span>
                )}
                {isKicked && <span style={{ color: 'red', marginLeft: '10px', fontWeight: 'bold' }}>You have been kicked!</span>}
            </div>

            {gameState?.status && (
                <div style={{ marginBottom: '10px', wordBreak: 'break-all' }}>
                    <strong>Status: </strong> {gameState.status}
                </div>
            )}

            {myId && (
                <div
                    style={{ marginBottom: '10px', wordBreak: 'break-all' }}
                    onClick={() => {
                        navigator.clipboard.writeText(myId);
                    }}
                >
                    <strong>My ID: </strong> {myId}
                </div>
            )}

            {!myId && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <button onClick={handleStartHost} style={{ padding: '5px 10px' }}>Start as Host</button>
                    <button onClick={handleStartClient} style={{ padding: '5px 10px' }}>Start as Client</button>
                </div>
            )}

            {isHost && (
                <div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        {roomPlayClientRender ? 'True' : 'False'}
                        <button onClick={toggleRoomPlayClientRender} style={{ padding: '5px 10px' }}>Toggle Client Render</button>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <button
                            onClick={() => {
                                setBoardLength(gameState?.boardLength - 1);
                            }}
                            style={{ padding: '5px 10px' }}>
                            -
                        </button>
                        {gameState?.boardLength}
                        <button
                            onClick={() => {
                                setBoardLength(gameState?.boardLength + 1);
                            }}
                            style={{ padding: '5px 10px' }}>
                            +
                        </button>
                    </div>

                </div>
            )}

            {myId && !isHost && !hostConn && (
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Enter Host ID"
                        value={targetId}
                        onChange={(e) => setTargetId(e.target.value)}
                        style={{ marginRight: '5px', padding: '5px' }}
                    />
                    <button onClick={handleConnect} style={{ padding: '5px 10px' }}>Connect</button>
                </div>
            )}

            {myId && (
                <div style={{ marginBottom: '10px' }}>
                    <button onClick={disconnect} style={{ backgroundColor: '#ff4444', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px' }}>
                        Disconnect
                    </button>
                </div>
            )}

            {/* Debug Info */}
            {myId && (
                <div style={{ marginTop: '20px', fontSize: '0.9em', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                    <h4>Connections</h4>
                    {
                        // isHost 
                        true
                            ? (
                                <div>
                                    Clients: {connections.length}
                                    <ul>
                                        {connections.map((c, i) => (
                                            <li key={i}>
                                                {c.peer}
                                                <button
                                                    onClick={() => removeConnection(c.peer)}
                                                    style={{ marginLeft: '10px', padding: '2px 5px', fontSize: '0.8em', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                                >
                                                    Kick
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    <button onClick={handlePing} style={{ padding: '5px' }}>Broadcast Ping</button>
                                    <button onClick={() => console.log(gameState)} style={{ padding: '5px' }}>Log gameState</button>
                                    <ul>
                                        {gameState?.players?.map((c, i) => (
                                            <li key={i} style={{ border: '1px solid black' }}>
                                                <div>ID: {c.peer}</div>
                                                <div>Nickname: {c.nickname}</div>
                                                <div>Character: {c.character}</div>
                                                <div>Row: {c.row}</div>
                                                <div>X: {c.x}</div>
                                                <div>Spaces: {c.spaces}</div>
                                                <div>race_game_dump:</div>
                                                <div className='small'>
                                                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                                        {JSON.stringify(c.race_game, null, 2)}
                                                    </pre>
                                                </div>
                                                <button
                                                    onClick={() => removeConnection(c.peer)}
                                                    style={{ padding: '2px 5px', fontSize: '0.8em', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                                >
                                                    Kick
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div>
                                    Host: {hostConn ? hostConn.peer : 'Not connected'}
                                    <br />
                                    {hostConn && <button onClick={handlePing} style={{ marginTop: '5px', padding: '5px' }}>Ping Host</button>}
                                </div>
                            )}
                </div>
            )}
        </div>
    );
};

export default PeerLogic;
