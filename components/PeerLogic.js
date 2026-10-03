"use client";
import Box from "@mui/material/Box";

import ArticlesButton from "@/components/UI/Button";
import TextField from "@mui/material/TextField";
import { useEffect, useRef, useState } from 'react';
import useGameStore from '@/hooks/useGameStore';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/hooks/useStore';

const PeerLogic = () => {

    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    const {
        server,
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

    const nickname = useStore((state) => state.nickname)
    const character = useStore((state) => state.character)

    useEffect(() => {

        if (!hostConn || !nickname) return;

        setTargetId('')

        sendToHost({
            event: "PlayerNickname",
            nickname: nickname,
            character: character
        })

    }, [
        myId, hostConn, nickname, character
    ]);

    const shouldBecomeHost = useRef(false);
    useEffect(() => {

        // if (server_type == "room-play" && !server && !shouldBecomeHost.current) {
        //     shouldBecomeHost.current = true;
        //     console.log("Auto become host check SET TRUE")
        //     handleStartHost();
        // }

        if (server_type == "online-peer" && !server && !shouldBecomeHost.current) {
            shouldBecomeHost.current = true;
            console.log("Auto become host check SET TRUE")
            handleStartHost();
        }

    }, [
        server_type,
        server
    ]);

    const hasAutoConnected = useRef(false);
    useEffect(() => {

        // Auto connects to room-play and online-peer host when loading page from link
        if (
            // server_type == "room-play"
            // ||
            server_type == "online-peer"
        ) {

            console.log(
                "Auto connect check DETECTED",
                hasAutoConnected.current,
                hostConn,
                server,
                myId
            )

            if (!hasAutoConnected.current && !hostConn && server) {
                startPeer(false);
                console.log("Auto connect check START CLIENT")
                // setTargetId(server_id);
                // connectToHost(server_id);
                hasAutoConnected.current = true;
            }

            if (hasAutoConnected.current && !hostConn && server && myId) {
                // startPeer(false);
                console.log("Auto connect check PASSED")
                setTargetId(server);
                connectToHost(server);
                // hasAutoConnected.current = true;
            }

        }

    }, [
        myId, server_type, server, hostConn
    ]);

    return (
        <Box sx={{
            position: 'relative', display: 'flex', flexDirection: 'column', minWidth: 0,
            bgcolor: 'game.card', color: 'text.primary', border: '1px solid',
            borderColor: 'divider', borderRadius: '0.375rem', maxWidth: 400,
        }}>

            <Box sx={{ flex: '1 1 auto', p: 2 }}>

                <h6>PeerLogic.js</h6>

                {!isHost &&
                    <Box>
                        hostConn: {hostConn ? 'Connected' : 'Not Connected'}
                    </Box>
                }

                {
                    (!isHost && myId && !hostConn)
                    &&
                    <Box>
                        Connection Issues? VPN Strict NAT (type 3) will prevent connections.<br />
                        Try using a VPN with Open NAT 1 or Moderate NAT 2 settings.<br />
                    </Box>
                }

                <Box sx={{ marginBottom: '10px' }} >
                    <strong>Status: </strong>
                    {myId ? (
                        <Box component="span" sx={{ color: 'green' }} >Online ({isHost ? 'Host' : 'Client'})</Box>
                    ) : (
                        <Box component="span" sx={{ color: 'red' }} >Offline</Box>
                    )}
                    {isKicked && <Box component="span" sx={{ color: 'red', marginLeft: '10px', fontWeight: 'bold' }} >You have been kicked!</Box>}
                </Box>

                {gameState?.status && (
                    <Box sx={{ marginBottom: '10px', wordBreak: 'break-all' }} >
                        <strong>Status: </strong> {gameState?.status}
                    </Box>
                )}

                {myId && (
                    <Box
                        
                        onClick={() => {
                            navigator.clipboard.writeText(myId);
                        }} sx={{ marginBottom: '10px', wordBreak: 'break-all' }} >
                        <strong>My ID: </strong> {myId}
                    </Box>
                )}

                {!myId && (
                    <Box sx={{ display: 'flex', gap: '10px', marginBottom: '10px' }} >
                        <ArticlesButton onClick={handleStartHost} sx={{ padding: '5px 10px' }} >Start as Host</ArticlesButton>
                        <ArticlesButton onClick={handleStartClient} sx={{ padding: '5px 10px' }} >Start as Client</ArticlesButton>
                    </Box>
                )}

                {isHost && (
                    <Box>

                        <Box sx={{ display: 'flex', gap: '10px', marginBottom: '10px' }} >
                            {roomPlayClientRender ? 'True' : 'False'}
                            <ArticlesButton onClick={toggleRoomPlayClientRender} sx={{ padding: '5px 10px' }} >Toggle Client Render</ArticlesButton>
                        </Box>

                        <Box sx={{ display: 'flex', gap: '10px', marginBottom: '10px' }} >
                            <ArticlesButton
                                onClick={() => {
                                    setBoardLength(gameState?.boardLength - 1);
                                }} sx={{ padding: '5px 10px' }} >
                                -
                            </ArticlesButton>
                            {gameState?.boardLength}
                            <ArticlesButton
                                onClick={() => {
                                    setBoardLength(gameState?.boardLength + 1);
                                }} sx={{ padding: '5px 10px' }} >
                                +
                            </ArticlesButton>
                        </Box>

                    </Box>
                )}

                {myId && !isHost && !hostConn && (
                    <Box sx={{ marginBottom: '10px' }} >
                        <TextField size="small"
                            type="text"
                            placeholder="Enter Host ID"
                            value={targetId}
                            onChange={(e) => setTargetId(e.target.value)} sx={{ marginRight: '5px', padding: '5px' }} />
                        <ArticlesButton onClick={handleConnect} sx={{ padding: '5px 10px' }} >Connect</ArticlesButton>
                    </Box>
                )}

                {myId && (
                    <Box sx={{ marginBottom: '10px' }} >
                        <ArticlesButton onClick={disconnect} sx={{ backgroundColor: '#ff4444', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px' }} >
                            Disconnect
                        </ArticlesButton>
                    </Box>
                )}

                
                {myId && (
                    <Box sx={{ marginTop: '20px', fontSize: '0.9em', borderTop: '1px solid #eee', paddingTop: '10px' }} >
                        <h4>Connections</h4>
                        {
                            // isHost 
                            true
                                ? (
                                    <Box>
                                        Clients: {connections.length}
                                        <ul>
                                            {connections.map((c, i) => (
                                                <li key={i}>
                                                    {c.peer}
                                                    <ArticlesButton
                                                        onClick={() => removeConnection(c.peer)} sx={{ marginLeft: '10px', padding: '2px 5px', fontSize: '0.8em', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }} >
                                                        Kick
                                                    </ArticlesButton>
                                                </li>
                                            ))}
                                        </ul>
                                        <ArticlesButton onClick={handlePing} sx={{ padding: '5px' }} >Broadcast Ping</ArticlesButton>
                                        <ArticlesButton onClick={() => console.log(gameState)} sx={{ padding: '5px' }} >Log gameState</ArticlesButton>
                                        <ul>
                                            {gameState?.players?.map((c, i) => (
                                                <Box component="li" key={i} sx={{ border: '1px solid black' }} >
                                                    <Box>ID: {c.peer}</Box>
                                                    <Box>Nickname: {c.nickname}</Box>
                                                    <Box>Character: {JSON.stringify(c.character)}</Box>
                                                    <Box>Row: {c.row}</Box>
                                                    <Box>X: {c.x}</Box>
                                                    <Box>Spaces: {c.spaces}</Box>
                                                    <Box>canMove: {c.canMove ? 'True' : 'False'}</Box>
                                                    <Box>race_game_dump:</Box>
                                                    <Box sx={{"fontSize":"0.875em"}} >
                                                        <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }} >
                                                            {JSON.stringify(c.race_game, null, 2)}
                                                        </Box>
                                                    </Box>
                                                    <ArticlesButton
                                                        onClick={() => removeConnection(c.peer)} sx={{ padding: '2px 5px', fontSize: '0.8em', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }} >
                                                        Kick
                                                    </ArticlesButton>
                                                </Box>
                                            ))}
                                        </ul>
                                    </Box>
                                ) : (
                                    <Box>
                                        Host: {hostConn ? hostConn.peer : 'Not connected'}
                                        <br />
                                        {hostConn && <ArticlesButton onClick={handlePing} sx={{ marginTop: '5px', padding: '5px' }} >Ping Host</ArticlesButton>}
                                    </Box>
                                )}
                    </Box>
                )}

            </Box>

        </Box>
    );
};

export default PeerLogic;
