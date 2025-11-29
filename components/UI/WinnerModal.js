"use client"
import dynamic from "next/dynamic";

import useGameStore from "../hooks/useGameStore";
import ArticlesButton from "./Button";

const ArticlesModal = dynamic(() => import('@/components/UI/ArticlesModal'), {
    ssr: false,
});

export default function WinnerModal() {
    
    const gameState = useGameStore((state) => state.gameState);
    const isHost = useGameStore((state) => state.isHost);
    const broadcastToClients = useGameStore((state) => state.broadcastToClients);
    const restartGame = useGameStore((state) => state.restartGame);

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