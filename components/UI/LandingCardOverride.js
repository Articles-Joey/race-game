"use client"
import React from 'react';
import dynamic from 'next/dynamic';
import ArticlesButton from '@/components/UI/Button';
import RenderCharacter from '@/components/Game/RenderCharacter';
import { useStore } from '@/hooks/useStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ChromePicker = dynamic(() => import('react-color').then(mod => mod.ChromePicker), {
    ssr: false,
});

const Viewer = dynamic(
    () => import('@/components/Game/Viewer'),
    { ssr: false }
)

export default function LandingCardOverride({
    characterEdit,
    setCharacterEdit,
    character,
    setCharacter,
    characters,
    colorEdit,
    setColorEdit,
    createCustomGame,
    setCreateCustomGame,
    joinGame,
    setJoinGame
}) {

    const router = useRouter()

    const lobbyDetails = useStore(state => state.lobbyDetails)

    if (characterEdit) {
        return (
            <div
                className="card card-articles card-sm mb-3"
                style={{
                    "width": "20rem",
                    "display": characterEdit ? 'block' : 'none'
                }}
            >

                <div className="card-header d-flex align-items-center">
                    Character Selector
                </div>

                <div className="card-body p-2">
                    <div className="selection-grid mb-2">
                        {characters.map(item => {
                            let active = character?.model == item.name
                            return (
                                <div
                                    key={item.name}
                                    className={`item ${active && 'active'}`}
                                    onClick={() => {
                                        setCharacter({
                                            ...character,
                                            model: item.name
                                        })
                                    }}
                                >
                                    <div className="ratio ratio-1x1">
                                        {active &&
                                            <div className=''>
                                                <Viewer>
                                                    <RenderCharacter
                                                        character={item}
                                                    />
                                                </Viewer>
                                            </div>
                                        }

                                        {!active &&
                                            <img
                                                className='img-fluid'
                                                style={{ objectFit: 'cover' }}
                                                src={item.image}
                                                alt=""
                                            />
                                        }
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {colorEdit &&
                        <div className='mb-2'>
                            <ChromePicker
                                width={"100%"}
                                color={character?.color || '#000000'}
                                onChange={(color) => {
                                    setCharacter({
                                        ...character,
                                        color: color.hex
                                    })
                                }}
                            />
                        </div>
                    }

                    <div className='d-flex justify-content-center'>
                        <ArticlesButton
                            small
                            className="w-50"
                            disabled={!character?.color}
                            onClick={() => {
                                let character_copy = { ...character }
                                delete character_copy.color
                                setCharacter(character_copy)
                            }}
                        >
                            <i className="fad fa-redo"></i>
                            Reset Color
                        </ArticlesButton>

                        <ArticlesButton
                            small
                            className="w-50"
                            onClick={() => {
                                setColorEdit(prev => !prev)
                            }}
                        >
                            {colorEdit ? <i className="fad fa-check"></i> : <i className="fad fa-palette"></i>}
                            {colorEdit ? 'Done' : 'Select Color'}
                        </ArticlesButton>
                    </div>
                </div>

                <div className="card-footer d-flex justify-content-center">
                    <ArticlesButton
                        className="w-50"
                        onClick={() => {
                            setCharacterEdit(false)
                        }}
                    >
                        <i className="fad fa-arrow-alt-left"></i>
                        Return
                    </ArticlesButton>

                    <ArticlesButton
                        className="w-50"
                        onClick={() => {
                            setCharacterEdit(false)
                        }}
                    >
                        <i className="fad fa-save"></i>
                        Save
                    </ArticlesButton>
                </div>
            </div>
        )
    }

    if (createCustomGame) {
        return (
            <div
                className="card card-articles card-sm mb-3"
                style={{ "width": "20rem" }}
            >
                <div className="card-header">
                    Create Custom Game
                </div>

                <div className="card-body">
                    <div className="small text-muted">Game Code</div>
                    <input
                        autoComplete='off'
                        type="text"
                        className='text-center w-100 mb-2'
                        value={createCustomGame?.url || ''}
                        onChange={(e) => {
                            setCreateCustomGame({
                                ...createCustomGame,
                                url: e.target.value
                            })
                        }}
                    />
                    <div style={{ fontSize: '0.75rem' }} className="text-muted mb-2">Give this to friends once you start the game!</div>

                    <div className="small text-muted">Players</div>
                    <div className="d-flex align-items-center mb-3">
                        <ArticlesButton
                            small
                            disabled={createCustomGame?.players <= 2}
                            className={`px-2`}
                            onClick={() => {
                                setCreateCustomGame(prev => ({
                                    ...prev,
                                    players: (prev?.players || 2) - 1
                                }))
                            }}
                        >
                            -
                        </ArticlesButton>
                        <b className='px-2'>{createCustomGame?.players}</b>
                        <ArticlesButton
                            small
                            className={`px-2`}
                            onClick={() => {
                                setCreateCustomGame(prev => ({
                                    ...prev,
                                    players: (prev?.players || 4) + 1
                                }))
                            }}
                        >
                            +
                        </ArticlesButton>
                    </div>

                    <div>
                        <div className="small text-muted">Board Length</div>
                        <div className="d-flex align-items-center mb-3">
                            <ArticlesButton
                                small
                                disabled={createCustomGame?.length <= 10}
                                className={`px-2`}
                                onClick={() => {
                                    setCreateCustomGame(prev => ({
                                        ...prev,
                                        length: (prev?.length || 10) - 1
                                    }))
                                }}
                            >
                                -
                            </ArticlesButton>
                            <b className='px-2'>{createCustomGame?.length}</b>
                            <ArticlesButton
                                small
                                disabled={createCustomGame?.length >= 100}
                                className={`px-2`}
                                onClick={() => {
                                    setCreateCustomGame(prev => ({
                                        ...prev,
                                        length: (prev?.length || 10) + 1
                                    }))
                                }}
                            >
                                +
                            </ArticlesButton>
                        </div>
                    </div>

                    <div>
                        <div className="small text-muted">Max Moves</div>
                        <div className="d-flex align-items-center mb-3">
                            <ArticlesButton
                                small
                                disabled={createCustomGame?.maxMoves <= 4}
                                className={`px-2`}
                                onClick={() => {
                                    setCreateCustomGame(prev => ({
                                        ...prev,
                                        maxMoves: (prev?.maxMoves || 4) - 1
                                    }))
                                }}
                            >
                                -
                            </ArticlesButton>
                            <b className='px-2'>{createCustomGame?.maxMoves}</b>
                            <ArticlesButton
                                small
                                disabled={createCustomGame?.maxMoves >= 100}
                                className={`px-2`}
                                onClick={() => {
                                    setCreateCustomGame(prev => ({
                                        ...prev,
                                        maxMoves: (prev?.maxMoves || 4) + 1
                                    }))
                                }}
                            >
                                +
                            </ArticlesButton>
                        </div>
                    </div>

                    <div>
                        Enable Room Play?
                    </div>

                    <div className="small">
                        Similar to Jackbox Games, the game will take place on the host's screen and others play on their devices.
                    </div>

                    <div className='d-flex justify-content-center mb-3'>
                        <ArticlesButton
                            small
                            className={`w-50`}
                            active={!createCustomGame?.roomPlay}
                            onClick={() => {
                                setCreateCustomGame({
                                    ...createCustomGame,
                                    roomPlay: false
                                })
                            }}
                        >
                            <i className="fad fa-minus-square"></i>
                            Disable
                        </ArticlesButton>
                        <ArticlesButton
                            small
                            className={`w-50`}
                            active={createCustomGame?.roomPlay}
                            onClick={() => {
                                setCreateCustomGame({
                                    ...createCustomGame,
                                    roomPlay: true
                                })
                            }}
                        >
                            <i className="fad fa-minus-square"></i>
                            Enable
                        </ArticlesButton>
                    </div>

                    <div>
                        Enable P2P
                    </div>

                    <div className="small">
                        Use Peer to Peer connections instead of server connections. This may reduce latency but can cause connectivity issues for some players.
                    </div>

                    <div className='d-flex justify-content-center mb-3'>
                        <ArticlesButton
                            small
                            className={`w-50`}
                            active={!createCustomGame?.p2p}
                            onClick={() => {
                                setCreateCustomGame({
                                    ...createCustomGame,
                                    p2p: false
                                })
                            }}
                        >
                            <i className="fad fa-minus-square"></i>
                            Disable
                        </ArticlesButton>
                        <ArticlesButton
                            small
                            className={`w-50`}
                            active={createCustomGame?.p2p}
                            onClick={() => {
                                setCreateCustomGame({
                                    ...createCustomGame,
                                    p2p: true
                                })
                            }}
                        >
                            <i className="fad fa-minus-square"></i>
                            Enable
                        </ArticlesButton>
                    </div>

                </div>

                <div className="card-footer d-flex">
                    <ArticlesButton
                        small
                        className={`w-50`}
                        onClick={() => {
                            setCreateCustomGame(false)
                        }}
                    >
                        <i className="fad fa-minus-square"></i>
                        Cancel
                    </ArticlesButton>

                    <ArticlesButton
                        variant={"success"}
                        small
                        className={`w-50`}
                        onClick={() => {
                            let finalLinkSearchParams = new URLSearchParams()

                            finalLinkSearchParams.set('players', createCustomGame?.players || 2)
                            finalLinkSearchParams.set('length', createCustomGame?.length || 10)
                            finalLinkSearchParams.set('maxMoves', createCustomGame?.maxMoves || 4)
                            if (createCustomGame?.roomPlay) finalLinkSearchParams.set('roomPlay', 'true')

                            if (createCustomGame?.p2p) {
                                finalLinkSearchParams.set('server_type', 'online-peer')
                            } else {
                                finalLinkSearchParams.set('server_type', 'online-socket')
                            }

                            // Logic to start the game can be added here or passed via props

                            const finalLink = `/play?${finalLinkSearchParams.toString()}`

                            console.log(finalLink)

                            router.push(finalLink)
                        }}
                    >
                        <i className="fad fa-check-square"></i>
                        Start
                    </ArticlesButton>
                </div>
            </div>
        )
    }

    if (joinGame !== false) {
        return (
            <div
                className="card card-articles card-sm mb-3"
                style={{ "width": "20rem" }}
            >
                <div className="card-header">
                    Join a Game
                </div>

                <div className="card-body">
                    <div className="small text-muted">Enter Game Code</div>
                    <input
                        autoComplete='off'
                        type="text"
                        className='text-center w-100'
                        value={joinGame.code || ''}
                        onChange={(e) => {
                            setJoinGame({
                                ...joinGame,
                                code: e.target.value
                            })
                        }}
                    />
                </div>

                <div className="card-body">

                    <div className="fw-bold mb-1 small text-center">
                        Public Servers
                    </div>

                    <div className="servers mb-2">

                        {[1, 2].map(id => {

                            let lobbyLookup = lobbyDetails?.raceGameGlobalState?.games?.find(lobby =>
                                parseInt(lobby.server_id) == id
                            )

                            return (
                                <div key={id} className="server">

                                    <div className='d-flex justify-content-between align-items-center w-100 mb-2'>
                                        <div className="mb-0" style={{ fontSize: '0.9rem' }}><b>Server {id}</b></div>
                                        <div className='mb-0'>{lobbyLookup?.players?.length || 0}/4</div>
                                    </div>

                                    <div className='d-flex justify-content-around w-100 mb-1'>
                                        {[1, 2, 3, 4].map(player_count => {

                                            let playerLookup = false

                                            if (lobbyLookup?.players?.length >= player_count) playerLookup = true

                                            return (
                                                <div
                                                    key={player_count}
                                                    className="icon"
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        ...(playerLookup ? {
                                                            backgroundColor: 'black',
                                                        } : {
                                                            backgroundColor: 'gray',
                                                        }),
                                                        border: '1px solid black'
                                                    }}
                                                >

                                                </div>
                                            )

                                        })}
                                    </div>

                                    <Link
                                        className={``}
                                        prefetch={false}
                                        href={{
                                            pathname: `/play`,
                                            query: {
                                                server: id,
                                                server_type: 'online-socket',
                                            }
                                        }}
                                    >
                                        <ArticlesButton
                                            small
                                            className="px-5"
                                        >
                                            Join
                                        </ArticlesButton>
                                    </Link>

                                </div>
                            )

                        })}

                    </div>

                </div>

                <div className="card-footer d-flex">
                    <ArticlesButton
                        small
                        className={`w-50`}
                        onClick={() => {
                            setJoinGame(false)
                        }}
                    >
                        <i className="fad fa-minus-square"></i>
                        Cancel
                    </ArticlesButton>

                    <ArticlesButton
                        variant={"success"}
                        small
                        className={`w-50`}
                        onClick={() => {
                            // Logic to join the game can be added here or passed via props
                        }}
                    >
                        <i className="fad fa-check-square"></i>
                        Start
                    </ArticlesButton>
                </div>
            </div>
        )
    }

    return null;
}
