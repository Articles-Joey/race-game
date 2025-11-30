import { useEffect, useContext, useRef, useState, Suspense } from 'react';

import { useStore } from "../hooks/useStore";
import { useSearchParams } from 'next/navigation';
import { useSocketStore } from '../hooks/useSocketStore';
import useGameStore from '../hooks/useGameStore';

export default function GameCanvasFlat() {

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    const server = searchParamsObject?.server_id

    const renderMode = useStore((state) => state?.renderMode);
    const setRenderMode = useStore((state) => state?.setRenderMode);

    const canvasRef = useRef(null);
    const [canvasRefContext, setCanvasRefContext] = useState(null);

    const [mounted, setMounted] = useState(false)

    const canvasPlayersRef = useRef(null);
    const [canvasPlayersRefContext, setCanvasPlayersRefContext] = useState(null);

    const [threeDimensionalLoaded, setThreeDimensionalLoaded] = useState(false)

    const [roundTimer, setRoundTimer] = useState(null);

    const darkMode = useStore((state) => state.darkMode);

    const gameState = useGameStore((state) => state?.gameState);
    const players = useGameStore((state) => state?.gameState?.players);

    useEffect(() => {

        if (canvasRef && mounted) {
            setCanvasRefContext(
                canvasRef.current.getContext('2d')
            )
        }

    }, [canvasRef, mounted]);

    useEffect(() => {

        if (renderMode == "3D") {
            setThreeDimensionalLoaded(true)
        }

    }, [renderMode])

    const [boardPainted, setBoardPainted] = useState()

    function drawBoard() {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        // setCanvasRefContext(context)


        // const contextPlayers = canvasPlayers.getContext('2d')
        // setCanvasPlayersRefContext(contextPlayers)

        canvasRef.current.width = 1500;
        canvasRef.current.height = 400;



        context.fillStyle = 'rgba(0, 0, 0, .5)';
        context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Start
        context.fillStyle = 'rgb(160, 120, 73)';
        context.fillRect(1400, 0, 100, canvasRef.current.height);

        // Finish
        context.fillStyle = 'rgb(160, 120, 73)';
        context.fillRect(0, 0, 100, canvasRef.current.height);

        // context.fillStyle = '#000';
        // context.font = "60px Arial";
        // context.fillText("Start", 10, 50);

        // context.fillStyle = '#000';
        // context.font = "60px Arial";
        // context.fillText("Finish", canvas.width - 170, 50);

        // Vertical Lines
        var i;
        for (i = 100; i < 1600; i += 100) {
            context.fillStyle = 'rgb(0 0 0 / 47%)';
            context.fillRect(i, 0, 2, canvasRef.current.height);
        }

        // Horizontal Lines
        var i;
        for (i = 100; i < 400; i += 100) {
            context.fillStyle = 'rgb(0 0 0 / 47%)';
            context.fillRect(100, i, canvasRef.current.width - 200, 2);
        }

        // drawPlayer(10, 10);
        // drawPlayer(10, 110);
        // drawPlayer(10, 210);
        // drawPlayer(10, 310);

        // const context = canvasPlayersRef.current.getContext('2d')
    }

    // useEffect(() => {

    //     // if (server && mounted && !boardPainted) {
    //     //     drawBoard()
    //     //     setBoardPainted(true)
    //     // }

    //     drawBoard()
    //     setBoardPainted(true)

    // }, [
    //     // server, mounted
    // ])

    useEffect(() => {

        // if (canvasRef && mounted) {
        //     setCanvasRefContext(
        //         canvasRef.current.getContext('2d')
        //     )
        // }

        drawBoard()
        setBoardPainted(true)

    }, [gameState]);

    useEffect(() => {

        const canvasPlayers = canvasPlayersRef.current
        canvasPlayersRef.current.width = 1500;
        canvasPlayersRef.current.height = 400;

        const canvas = canvasPlayersRef.current
        const context = canvas.getContext('2d')

        context.clearRect(0, 0, 1500, 400);

        // msg.map(player => {
        //     drawPlayer( player.x, player.y, context )
        // })

        gameState?.mysterySpots?.map(mystery_obj => {
            drawMysterySpot(
                (mystery_obj.x * 100),
                (mystery_obj.y * 100),
                context,
                false,
            )
        })

        players.map(player_obj => {
            drawPlayer(
                (player_obj.race_game.x * 100),
                (
                    (player_obj.race_game.row - 1)
                    *
                    100
                ),
                context,
                player_obj.id == socket.id,
                player_obj,
                gameState?.movesShown,
            )
        })


    }, [players]);

    useEffect(() => {

        if (server) {
            // console.log(Background)

            // drawBoard()



            socket.on('race-game-round-timer', function (msg) {
                // console.log(`Just received this message from server`);
                console.log('race-game-round-timer', msg)
                setRoundTimer(msg)

            });

            socket.on(`game:race-game-room-${server}`, function (data) {

                if (!mounted) return

                const canvasPlayers = canvasPlayersRef.current
                canvasPlayersRef.current.width = 1500;
                canvasPlayersRef.current.height = 400;

                const canvas = canvasPlayersRef.current
                const context = canvas.getContext('2d')

                // return
                console.log(`race-game-room-${server}`);

                console.log(data)

                setPlayers(data?.players || [])

                setGameState(data?.game_state)

                if (data?.game_state?.activeMysterySpot) {
                    console.log("activeMysterySpot found", data?.game_state?.activeMysterySpot)
                    setActiveMysterySpot(data?.game_state?.activeMysterySpot)
                } else {
                    setActiveMysterySpot(false)
                }

                // return

                // setRoundTimer(msg)

                // setPlayers(playersObj)

                // console.log(playersObj)

                context.clearRect(0, 0, 1500, 400);

                // msg.map(player => {
                //     drawPlayer( player.x, player.y, context )
                // })

                // TODO change socket server to mysterySpots
                data?.game_state?.mystery_spots?.map(mystery_obj => {
                    drawMysterySpot(
                        (mystery_obj.x * 100),
                        (mystery_obj.y * 100),
                        context,
                        false,
                    )
                })

                data?.players.map(player_obj => {
                    drawPlayer(
                        (player_obj.race_game.x * 100),
                        (player_obj.race_game.y * 100),
                        context,
                        player_obj.id == socket.id,
                        player_obj,
                        data?.game_state?.movesShown,
                    )
                })

                // for (var id in playersObj) {
                //     var player = playersObj[id];
                //     // console.log(`${player.x} - ${player.y}`)
                //     drawPlayer(player.x, player.y, context, id == socket.id)
                // }

            });

            socket.on('race-game-round-players-picks', function (playersObj) {
                // return
                // console.log(`Just received this message from server`);
                // setRoundTimer(msg)

                // setPlayers(playersObj)

                // console.log("playersObj", playersObj)

                // console.log(playersObj)

                // context.clearRect(0, 0, 1500, 400);

                // msg.map(player => {
                //     drawPlayer( player.x, player.y, context )
                // })

                // for (var id in playersObj) {
                //     var player = playersObj[id];
                //     drawPlayerPick(player.x, player.y, context, id == socket.id)
                // }

            });

        }

        // return () => {
        //     socket.off(`game:race-game-room-${server}`);
        //     socket.off('race-game-round-timer');
        //     socket.emit('leave-room', `game:race-game-room-${server}`, {
        //         client_version: '1',
        //         game_id: server
        //     });
        // }

    }, [server, mounted]);

    useEffect(() => {

        // TODO - App Router - Double check
        if (server) {
            // rejoin()
        }

        return () => {
            if (server) {
                socket.off(`game:race-game-room-${server}`);
                socket.off('race-game-round-timer');
                socket.emit('leave-room', `game:race-game-room-${server}`, {
                    client_version: '1',
                    game_id: server
                });
            }
        }

    }, [server]);

    // useEffect(() => {

    //     if (router.isReady && server) {
    //         rejoin()
    //     }

    // }, [router])

    useEffect(() => {

        setMounted(true)

    }, [])

    function drawMysterySpot(x, y, context, isSelf) {
        console.log("Drawing Player")

        context.fillStyle = '#ffc107';
        context.fillRect(x, y, 100, 100);

        context.font = "10px Arial";
        context.fillStyle = "#000";
        context.textAlign = "center";

        context.fillText(`?`, x + 50, y + 50);
    };

    function drawPlayer(x, y, context, isSelf, player_obj, movesShown) {

        console.log("Drawing Player")

        context.fillStyle = 'rgb( 255, 255, 255, .5 )';
        context.fillRect(x, y, 100, 100);

        context.font = "10px Arial";
        context.fillStyle = "#000";
        context.textAlign = "center";
        // var playerNickname = player.nickname;
        context.fillText(`${isSelf ? 'You' : (player_obj?.race_game?.nickname || '')}`, x + 50, y + 50);

        if (player_obj?.race_game?.spaces) {
            context.font = "16px Arial";
            context.fillText(`🔒`, x + 50, y + 70);
        }

        if (movesShown > 0 && player_obj?.race_game?.spaces) {
            context.font = "16px Arial";
            context.fillText(`${player_obj?.race_game?.spaces}`, x + 50, y + 30);
        }

        context.font = "10px Arial";

    };

    return (
        <div className={`canvas-flat-wrap ${renderMode == '3D' && 'd-none'}`}>

            <canvas onClick={(e) => console.log(e)} className='fill' ref={canvasRef}></canvas>

            <canvas onClick={(e) => {
                const canvas = canvasPlayersRef.current;
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                console.log(`Clicked at coordinates: (${x}, ${y})`);
            }} ref={canvasPlayersRef}></canvas>

        </div>
    );
}