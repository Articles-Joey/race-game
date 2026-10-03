"use client"
import Box from "@mui/material/Box";
import TextField from '@mui/material/TextField';
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckIcon from "@mui/icons-material/Check";
import PaletteIcon from "@mui/icons-material/Palette";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
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
            <Box sx={{ ...{"position":"relative","display":"flex","flexDirection":"column","minWidth":0,"bgcolor":"game.card","color":"text.primary","border":"1px solid","borderColor":"divider","borderRadius":"0.375rem","fontSize":"0.875rem","mb":"1rem"}, ...{
                    "width": "20rem",
                    "display": characterEdit ? 'block' : 'none'
                } }} >

                <Box sx={{"px":"1rem","py":"0.5rem","bgcolor":"action.hover","borderBottom":"1px solid","borderColor":"divider","display":"flex","alignItems":"center"}} >
                    Character Selector
                </Box>

                <Box sx={{"flex":"1 1 auto","p":"0.5rem"}} >
                    <Box sx={{"display":"grid","gap":"5px","gridTemplateColumns":"repeat(2, minmax(0, 1fr))","mb":"0.5rem"}} >
                        {characters.map(item => {
                            let active = character?.model == item.name
                            return (
                                <Box
                                    key={item.name}
                                    
                                    onClick={() => {
                                        setCharacter({
                                            ...character,
                                            model: item.name
                                        })
                                    }} sx={{ cursor: "pointer", transition: "transform 200ms, box-shadow 200ms", border: active ? "2px solid #000" : "2px solid transparent", "&:hover": { transform: "scale(1.025)", boxShadow: "0 0 0 1px rgba(0,0,0,0.25), 0 2px 3px rgba(0,0,0,0.2)" } }} >
                                    <Box sx={{"position":"relative","width":"100%","& > *":{"position":"absolute","inset":0,"width":"100%","height":"100%"},"aspectRatio":"1 / 1"}} >
                                        {active &&
                                            <Box >
                                                <Viewer>
                                                    <RenderCharacter
                                                        character={item}
                                                    />
                                                </Viewer>
                                            </Box>
                                        }

                                        {!active &&
                                            <Box component="img"
                                                
                                                
                                                src={item.image}
                                                alt="" sx={{ ...{"maxWidth":"100%","height":"auto"}, ...{ objectFit: 'cover' } }} />
                                        }
                                    </Box>
                                </Box>
                            )
                        })}
                    </Box>

                    {colorEdit &&
                        <Box sx={{"mb":"0.5rem"}} >
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
                        </Box>
                    }

                    <Box sx={{"display":"flex","justifyContent":"center"}} >
                        <ArticlesButton
                            small
                            
                            disabled={!character?.color}
                            onClick={() => {
                                let character_copy = { ...character }
                                delete character_copy.color
                                setCharacter(character_copy)
                            }} sx={{"width":"50%"}} >
                            <RestartAltIcon sx={{"fontSize":"1.2em","verticalAlign":"middle","mr":"0.2rem"}} />
                            Reset Color
                        </ArticlesButton>

                        <ArticlesButton
                            small
                            
                            onClick={() => {
                                setColorEdit(prev => !prev)
                            }} sx={{"width":"50%"}} >
                            {colorEdit ? <CheckIcon sx={{"fontSize":"1.2em","verticalAlign":"middle","mr":"0.2rem"}} /> : <PaletteIcon sx={{"fontSize":"1.2em","verticalAlign":"middle","mr":"0.2rem"}} />}
                            {colorEdit ? 'Done' : 'Select Color'}
                        </ArticlesButton>
                    </Box>
                </Box>

                <Box sx={{"px":"1rem","py":"0.5rem","bgcolor":"action.hover","borderTop":"1px solid","borderColor":"divider","display":"flex","justifyContent":"center"}} >
                    <ArticlesButton
                        
                        onClick={() => {
                            setCharacterEdit(false)
                        }} sx={{"width":"50%"}} >
                        <ArrowBackIcon sx={{"fontSize":"1.2em","verticalAlign":"middle","mr":"0.2rem"}} />
                        Return
                    </ArticlesButton>

                    <ArticlesButton
                        
                        onClick={() => {
                            setCharacterEdit(false)
                        }} sx={{"width":"50%"}} >
                        <SaveIcon sx={{"fontSize":"1.2em","verticalAlign":"middle","mr":"0.2rem"}} />
                        Save
                    </ArticlesButton>
                </Box>
            </Box>
        )
    }

    if (createCustomGame) {
        return (
            <Box sx={{ ...{"position":"relative","display":"flex","flexDirection":"column","minWidth":0,"bgcolor":"game.card","color":"text.primary","border":"1px solid","borderColor":"divider","borderRadius":"0.375rem","fontSize":"0.875rem","mb":"1rem"}, ...{ "width": "20rem" } }} >
                <Box sx={{"px":"1rem","py":"0.5rem","bgcolor":"action.hover","borderBottom":"1px solid","borderColor":"divider"}} >
                    Create Custom Game
                </Box>

                <Box sx={{"flex":"1 1 auto","p":"1rem"}} >
                    <Box sx={{"fontSize":"0.875em","color":"text.secondary"}} >Game Code</Box>
                    <TextField size="small"
                        autoComplete='off'
                        type="text"
                        
                        value={createCustomGame?.url || ''}
                        onChange={(e) => {
                            setCreateCustomGame({
                                ...createCustomGame,
                                url: e.target.value
                            })
                        }} sx={{ width: '100%', mb: '0.5rem', '& input': { textAlign: 'center' } }}
                        slotProps={{ htmlInput: { 'aria-label': 'Game code' } }}
                    />
                    <Box sx={{ ...{"color":"text.secondary","mb":"0.5rem"}, ...{ fontSize: '0.75rem' } }} >Give this to friends once you start the game!</Box>

                    <Box sx={{"fontSize":"0.875em","color":"text.secondary"}} >Players</Box>
                    <Box sx={{"display":"flex","alignItems":"center","mb":"1rem"}} >
                        <ArticlesButton
                            small
                            disabled={createCustomGame?.players <= 2}
                            
                            onClick={() => {
                                setCreateCustomGame(prev => ({
                                    ...prev,
                                    players: (prev?.players || 2) - 1
                                }))
                            }} sx={{"px":"0.5rem"}} >
                            -
                        </ArticlesButton>
                        <Box component="b" sx={{"px":"0.5rem"}} >{createCustomGame?.players}</Box>
                        <ArticlesButton
                            small
                            
                            onClick={() => {
                                setCreateCustomGame(prev => ({
                                    ...prev,
                                    players: (prev?.players || 4) + 1
                                }))
                            }} sx={{"px":"0.5rem"}} >
                            +
                        </ArticlesButton>
                    </Box>

                    <Box>
                        <Box sx={{"fontSize":"0.875em","color":"text.secondary"}} >Board Length</Box>
                        <Box sx={{"display":"flex","alignItems":"center","mb":"1rem"}} >
                            <ArticlesButton
                                small
                                disabled={createCustomGame?.length <= 10}
                                
                                onClick={() => {
                                    setCreateCustomGame(prev => ({
                                        ...prev,
                                        length: (prev?.length || 10) - 1
                                    }))
                                }} sx={{"px":"0.5rem"}} >
                                -
                            </ArticlesButton>
                            <Box component="b" sx={{"px":"0.5rem"}} >{createCustomGame?.length}</Box>
                            <ArticlesButton
                                small
                                disabled={createCustomGame?.length >= 100}
                                
                                onClick={() => {
                                    setCreateCustomGame(prev => ({
                                        ...prev,
                                        length: (prev?.length || 10) + 1
                                    }))
                                }} sx={{"px":"0.5rem"}} >
                                +
                            </ArticlesButton>
                        </Box>
                    </Box>

                    <Box>
                        <Box sx={{"fontSize":"0.875em","color":"text.secondary"}} >Max Moves</Box>
                        <Box sx={{"display":"flex","alignItems":"center","mb":"1rem"}} >
                            <ArticlesButton
                                small
                                disabled={createCustomGame?.maxMoves <= 4}
                                
                                onClick={() => {
                                    setCreateCustomGame(prev => ({
                                        ...prev,
                                        maxMoves: (prev?.maxMoves || 4) - 1
                                    }))
                                }} sx={{"px":"0.5rem"}} >
                                -
                            </ArticlesButton>
                            <Box component="b" sx={{"px":"0.5rem"}} >{createCustomGame?.maxMoves}</Box>
                            <ArticlesButton
                                small
                                disabled={createCustomGame?.maxMoves >= 100}
                                
                                onClick={() => {
                                    setCreateCustomGame(prev => ({
                                        ...prev,
                                        maxMoves: (prev?.maxMoves || 4) + 1
                                    }))
                                }} sx={{"px":"0.5rem"}} >
                                +
                            </ArticlesButton>
                        </Box>
                    </Box>

                    <Box>
                        Enable Room Play?
                    </Box>

                    <Box sx={{"fontSize":"0.875em"}} >
                        Similar to Jackbox Games, the game will take place on the host's screen and others play on their devices.
                    </Box>

                    <Box sx={{"display":"flex","justifyContent":"center","mb":"1rem"}} >
                        <ArticlesButton
                            small
                            
                            active={!createCustomGame?.roomPlay}
                            onClick={() => {
                                setCreateCustomGame({
                                    ...createCustomGame,
                                    roomPlay: false
                                })
                            }} sx={{"width":"50%"}} >
                            <IndeterminateCheckBoxIcon sx={{"fontSize":"1.2em","verticalAlign":"middle","mr":"0.2rem"}} />
                            Disable
                        </ArticlesButton>
                        <ArticlesButton
                            small
                            
                            active={createCustomGame?.roomPlay}
                            onClick={() => {
                                setCreateCustomGame({
                                    ...createCustomGame,
                                    roomPlay: true
                                })
                            }} sx={{"width":"50%"}} >
                            <IndeterminateCheckBoxIcon sx={{"fontSize":"1.2em","verticalAlign":"middle","mr":"0.2rem"}} />
                            Enable
                        </ArticlesButton>
                    </Box>

                    <Box>
                        Enable P2P
                    </Box>

                    <Box sx={{"fontSize":"0.875em"}} >
                        Use Peer to Peer connections instead of server connections. This may reduce latency but can cause connectivity issues for some players.
                    </Box>

                    <Box sx={{"display":"flex","justifyContent":"center","mb":"1rem"}} >
                        <ArticlesButton
                            small
                            
                            active={!createCustomGame?.p2p}
                            onClick={() => {
                                setCreateCustomGame({
                                    ...createCustomGame,
                                    p2p: false
                                })
                            }} sx={{"width":"50%"}} >
                            <IndeterminateCheckBoxIcon sx={{"fontSize":"1.2em","verticalAlign":"middle","mr":"0.2rem"}} />
                            Disable
                        </ArticlesButton>
                        <ArticlesButton
                            small
                            
                            active={createCustomGame?.p2p}
                            onClick={() => {
                                setCreateCustomGame({
                                    ...createCustomGame,
                                    p2p: true
                                })
                            }} sx={{"width":"50%"}} >
                            <IndeterminateCheckBoxIcon sx={{"fontSize":"1.2em","verticalAlign":"middle","mr":"0.2rem"}} />
                            Enable
                        </ArticlesButton>
                    </Box>

                </Box>

                <Box sx={{"px":"1rem","py":"0.5rem","bgcolor":"action.hover","borderTop":"1px solid","borderColor":"divider","display":"flex"}} >
                    <ArticlesButton
                        small
                        
                        onClick={() => {
                            setCreateCustomGame(false)
                        }} sx={{"width":"50%"}} >
                        <IndeterminateCheckBoxIcon sx={{"fontSize":"1.2em","verticalAlign":"middle","mr":"0.2rem"}} />
                        Cancel
                    </ArticlesButton>

                    <ArticlesButton
                        variant={"success"}
                        small
                        
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
                        }} sx={{"width":"50%"}} >
                        <CheckBoxIcon sx={{"fontSize":"1.2em","verticalAlign":"middle","mr":"0.2rem"}} />
                        Start
                    </ArticlesButton>
                </Box>
            </Box>
        )
    }

    if (joinGame !== false) {
        return (
            <Box sx={{ ...{"position":"relative","display":"flex","flexDirection":"column","minWidth":0,"bgcolor":"game.card","color":"text.primary","border":"1px solid","borderColor":"divider","borderRadius":"0.375rem","fontSize":"0.875rem","mb":"1rem"}, ...{ "width": "20rem" } }} >
                <Box sx={{"px":"1rem","py":"0.5rem","bgcolor":"action.hover","borderBottom":"1px solid","borderColor":"divider"}} >
                    Join a Game
                </Box>

                <Box sx={{"flex":"1 1 auto","p":"1rem"}} >
                    <Box sx={{"fontSize":"0.875em","color":"text.secondary"}} >Enter Game Code</Box>
                    <TextField size="small"
                        autoComplete='off'
                        type="text"
                        
                        value={joinGame.code || ''}
                        onChange={(e) => {
                            setJoinGame({
                                ...joinGame,
                                code: e.target.value
                            })
                        }} sx={{ width: '100%', '& input': { textAlign: 'center' } }}
                        slotProps={{ htmlInput: { 'aria-label': 'Game code to join' } }}
                    />
                </Box>

                <Box sx={{"flex":"1 1 auto","p":"1rem"}} >

                    <Box sx={{"fontWeight":700,"mb":"0.25rem","fontSize":"0.875em","textAlign":"center"}} >
                        Public Servers
                    </Box>

                    <Box sx={{"display":"grid","gap":"5px","gridTemplateColumns":"repeat(2, minmax(0, 1fr))","mb":"0.5rem"}} >

                        {[1, 2].map(id => {

                            let lobbyLookup = lobbyDetails?.raceGameGlobalState?.games?.find(lobby =>
                                parseInt(lobby.server_id) == id
                            )

                            return (
                                <Box key={id} sx={{"p":"0.5rem","border":"1px solid rgba(0,0,0,0.25)","display":"flex","flexDirection":"column","alignItems":"center"}} >

                                    <Box sx={{"display":"flex","justifyContent":"space-between","alignItems":"center","width":"100%","mb":"0.5rem"}} >
                                        <Box sx={{ ...{"mb":"0px"}, ...{ fontSize: '0.9rem' } }} ><b>Server {id}</b></Box>
                                        <Box sx={{"mb":"0px"}} >{lobbyLookup?.players?.length || 0}/4</Box>
                                    </Box>

                                    <Box sx={{"display":"flex","justifyContent":"space-around","width":"100%","mb":"0.25rem"}} >
                                        {[1, 2, 3, 4].map(player_count => {

                                            let playerLookup = false

                                            if (lobbyLookup?.players?.length >= player_count) playerLookup = true

                                            return (
                                                <Box
                                                    key={player_count} sx={{
                                                        width: '20px',
                                                        height: '20px',
                                                        ...(playerLookup ? {
                                                            backgroundColor: 'black',
                                                        } : {
                                                            backgroundColor: 'gray',
                                                        }),
                                                        border: '1px solid black'
                                                    }} >

                                                </Box>
                                            )

                                        })}
                                    </Box>

                                    <Link
                                        
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
                                            small sx={{"px":"3rem"}} >
                                            Join
                                        </ArticlesButton>
                                    </Link>

                                </Box>
                            )

                        })}

                    </Box>

                </Box>

                <Box sx={{"px":"1rem","py":"0.5rem","bgcolor":"action.hover","borderTop":"1px solid","borderColor":"divider","display":"flex"}} >
                    <ArticlesButton
                        small
                        
                        onClick={() => {
                            setJoinGame(false)
                        }} sx={{"width":"50%"}} >
                        <IndeterminateCheckBoxIcon sx={{"fontSize":"1.2em","verticalAlign":"middle","mr":"0.2rem"}} />
                        Cancel
                    </ArticlesButton>

                    <ArticlesButton
                        variant={"success"}
                        small
                        
                        onClick={() => {
                            // Logic to join the game can be added here or passed via props
                        }} sx={{"width":"50%"}} >
                        <CheckBoxIcon sx={{"fontSize":"1.2em","verticalAlign":"middle","mr":"0.2rem"}} />
                        Start
                    </ArticlesButton>
                </Box>
            </Box>
        )
    }

    return null;
}
