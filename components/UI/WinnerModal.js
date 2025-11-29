"use client"
import dynamic from "next/dynamic";

import useGameStore from "../hooks/useGameStore";
import ArticlesButton from "./Button";
import { useEffect } from "react";
import { useStore } from "../hooks/useStore";

const ArticlesModal = dynamic(() => import('@/components/UI/ArticlesModal'), {
    ssr: false,
});

export default function WinnerModal() {

    const gameState = useGameStore((state) => state.gameState);
    const isHost = useGameStore((state) => state.isHost);
    const broadcastToClients = useGameStore((state) => state.broadcastToClients);
    const restartGame = useGameStore((state) => state.restartGame);
    const arcadeMode = useStore((state) => state.arcadeMode);

    useEffect(() => {

        if (arcadeMode && gameState?.winner) {

            console.log("WinnerModal: Detected winner in arcade mode, restarting game in 5 seconds.");

            setTimeout(() => {

                // Not only restart game but dump all players and connections
                // restartGame();
                // setGameState()

                // Easier to just refresh the page, assumes room-play and also dumps all connections and memory to avoid long term leaks
                window.location.reload();

            }, 5000);
        }

    }, [gameState, arcadeMode]);

    return (
        <>
            {gameState?.winner &&
                <ArticlesModal
                    show={true}
                    setShow={() => { }}
                    title="Game Over!"
                    disableClose
                    footerOverride={
                        <div>

                            {isHost ?
                                <div className="w-100 flex-header">

                                    <ArticlesButton
                                        className=""
                                        onClick={() => {
                                            broadcastToClients({ event: 'ReturnToLobby' });

                                            // TODO - Then return self to lobby
                                            window.location.href = '/';
                                        }}
                                    >
                                        Close Lobby
                                    </ArticlesButton>

                                    <ArticlesButton
                                        className=""
                                        onClick={() => {
                                            restartGame();
                                        }}
                                    >
                                        Play Again
                                    </ArticlesButton>

                                </div>
                                :
                                <div>

                                </div>
                            }

                        </div>
                    }
                >
                    <div>

                        <div className='my-2'>
                            <b>{gameState?.winner?.nickname || gameState?.winner?.peer}</b><span>{` has won the race!`}</span>
                        </div>

                        {/* <div className='fw-bold mb-3'>Congratulations!</div> */}

                    </div>

                </ArticlesModal>
            }
        </>
    )

}