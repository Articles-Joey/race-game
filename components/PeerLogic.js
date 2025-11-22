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

    const hasAutoConnected = useRef(false);

    useEffect(() => {

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

    }, [
        myId, server_id, hostConn
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
