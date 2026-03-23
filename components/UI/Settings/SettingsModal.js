import { useEffect, useState } from "react";

import { Modal, Form } from "react-bootstrap"

import ArticlesButton from "@/components/UI/Button";
import { useStore } from "../../hooks/useStore";
import useChatStore from "../../hooks/useChatStore";

import "styles/components/SettingsModal.scss";
import AudioTab from "./AudioTab";
import GraphicsTab from "./GraphicsTab";

export default function SettingsModal({
    show,
    setShow,
}) {

    const [showModal, setShowModal] = useState(true)

    const [lightboxData, setLightboxData] = useState(null)

    const [tab, setTab] = useState('Controls')

    const socketServerHost = useStore((state) => state.socketServerHost);
    const setSocketServerHost = useStore((state) => state.setSocketServerHost);
    const reset = useStore((state) => state.reset);

    const controlSettings = useStore((state) => state.controlSettings);
    const setControlSettings = useStore((state) => state.setControlSettings);

    const enabled = useChatStore((state) => state.enabled);
    const speechBubblesEnabled = useChatStore((state) => state.speechBubblesEnabled);

    // const audioSettings = useAudioStore((state) => state.audioSettings);
    // const setAudioSettings = useAudioStore((state) => state.setAudioSettings);

    const arcadeMode = useStore((state) => state.arcadeMode);
    const setArcadeMode = useStore((state) => state.setArcadeMode);

    const toontownMode = useStore((state) => state.toontownMode);
    const setToontownMode = useStore((state) => state.setToontownMode);

    const darkMode = useStore((state) => state.darkMode);
    const toggleDarkMode = useStore((state) => state.toggleDarkMode);

    const [listenForKey, setListenForKey] = useState(false)

    useEffect(() => {
        if (listenForKey) {
            const handleKeyDown = (e) => {
                e.preventDefault()
                setListenForKey(prev => ({ ...prev, lastKey: e.key }))
            }
            window.addEventListener('keydown', handleKeyDown)
            return () => window.removeEventListener('keydown', handleKeyDown)
        }
    }, [listenForKey])

    if (listenForKey) {
        return (
            <div className="listen-for-key-overlay d-flex flex-column justify-content-center align-items-center">

                <div className="mb-3">Listening for key...</div>

                <div className="h2 border rounded p-3 px-5 mb-3 bg-dark text-white">
                    {listenForKey.lastKey || 'Press a key'}
                </div>

                <div className="d-flex">
                    <ArticlesButton
                        variant="warning"
                        onClick={() => {
    
                            setControlSettings({
                                ...controlSettings,
                                [listenForKey.action]: false,
                            })
    
                            setListenForKey(false)
    
                        }}
                    >
                        <i className="fas fa-undo me-2"></i>
                        Cancel
                    </ArticlesButton>
                    <ArticlesButton onClick={() => {
    
                        setControlSettings({
                            ...controlSettings,
                            [listenForKey.action]: listenForKey.lastKey,
                        })
    
                        setListenForKey(false)
    
                    }}>
                        Confirm
                    </ArticlesButton>
                </div>

            </div>
        )
    }

    return (
        <>
            {/* {lightboxData && (
                <Lightbox
                    mainSrc={lightboxData?.location}
                    onCloseRequest={() => setLightboxData(null)}
                    reactModalStyle={{
                        overlay: {
                            zIndex: '2000'
                        }
                    }}
                />
            )} */}

            {listenForKey && (
                <div className="listen-for-key-overlay">
                    Listening for key...
                </div>
            )}

            <Modal
                className="articles-modal"
                size='md'
                show={showModal}
                // To much jumping with little content for now
                centered
                scrollable
                onExited={() => {
                    setShow(false)
                }}
                onHide={() => {
                    setShowModal(false)
                }}
            >

                <Modal.Header closeButton>
                    <Modal.Title>Game Settings</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-0">

                    <div className='p-2'>
                        {[
                            'Controls',
                            'Graphics',
                            'Audio',
                            'Multiplayer',
                            // 'Chat',
                            'Other',
                        ].map(item =>
                            <ArticlesButton
                                key={item}
                                active={tab == item}
                                onClick={() => { setTab(item) }}
                            >
                                {item}
                            </ArticlesButton>
                        )}
                    </div>

                    <hr className="my-0" />

                    <div className="p-2">

                        {tab == 'Controls' &&
                            <div>

                                <div className="small pb-3 pt-2  border-bottom">
                                    Assign a key to a movement action. 1-4 are the defaults and are already assigned.
                                </div>

                                <div>
                                    {[
                                        {
                                            action: 'Move 1 Space',
                                            defaultKeyboardKey: '1'
                                        },
                                        {
                                            action: 'Move 2 Space',
                                            defaultKeyboardKey: '2'
                                        },
                                        {
                                            action: 'Move 3 Space',
                                            defaultKeyboardKey: '3'
                                        },
                                        {
                                            action: 'Move 4 Space',
                                            defaultKeyboardKey: '4'
                                        },
                                    ].map(obj =>
                                        <div key={obj.action}>
                                            <div className="flex-header border-bottom py-1 mb-1">

                                                <div>
                                                    <div>{obj.action}</div>
                                                    {obj.emote && <div className="span badge bg-dark">Emote</div>}
                                                </div>

                                                <div>

                                                    {/* <div className="badge badge-hover bg-articles me-1">{obj.defaultKeyboardKey}</div> */}

                                                    {controlSettings[obj.action] &&
                                                        <div className="badge bg-secondary me-1">
                                                            {controlSettings[obj.action]}
                                                        </div>
                                                    }

                                                    <ArticlesButton
                                                        className=""
                                                        small
                                                        onClick={() => setListenForKey({
                                                            action: obj.action,
                                                            lastKey: false
                                                        })}
                                                    >
                                                        Select Key
                                                    </ArticlesButton>

                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        }

                        {tab == 'Graphics' &&
                            <GraphicsTab/>
                        }

                        {tab == 'Audio' &&
                            <AudioTab/>
                        }

                        {tab == 'Multiplayer' &&
                            <div className="p-2">

                                <Form.Label className="mb-0">Socket Server Host</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={socketServerHost}
                                    onChange={(e) => setSocketServerHost(e.target.value)}
                                />
                                <Form.Label className="mb-0">Edit this to connect to a different multiplayer host!</Form.Label>

                                <div className="mt-3">
                                    <ArticlesButton
                                        className="mb-1"
                                    >
                                        Retry
                                    </ArticlesButton>
                                    <div>Status: <span className="badge bg-danger">Offline</span></div>
                                </div>

                            </div>
                        }
                        {tab == 'Chat' &&
                            <div className="mx-4">
                                <Form.Check
                                    type="switch"
                                    id="chat-enabled-switch"
                                    label="Game chat panel"
                                    // value={enabled}
                                    checked={enabled}
                                    onChange={() => {
                                        console.log("TEST")
                                        useChatStore.setState({ enabled: !enabled });
                                    }}
                                />
                                {/* <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Censor chat"
                                /> */}
                                <Form.Check
                                    type="switch"
                                    id="chat-speech-bubbles-switch"
                                    label="Game chat speech bubbles"
                                    checked={speechBubblesEnabled}
                                    onChange={() => {
                                        console.log("TEST")
                                        useChatStore.setState({ speechBubblesEnabled: !speechBubblesEnabled });
                                    }}
                                />
                            </div>
                        }
                        {tab == 'Other' &&
                            <div className="mx-4 pt-3">

                                <div className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <Form.Check
                                            type="switch"
                                            id="dark-mode-switch"
                                            label="Dark Mode"
                                            // value={enabled}
                                            checked={darkMode}
                                            onChange={() => {
                                                toggleDarkMode();
                                            }}
                                        />
                                    </div>
                                    <div className="small mt-2">
                                        {`Dark Mode changes the game's color scheme to be easier on the eyes in low light environments.`}
                                    </div>
                                </div>

                                <hr />

                                <div className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <Form.Check
                                            type="switch"
                                            id="arcade-mode-switch"
                                            label="Arcade Mode"
                                            // value={enabled}
                                            checked={arcadeMode}
                                            onChange={() => {
                                                setArcadeMode(!arcadeMode);
                                            }}
                                        />
                                    </div>
                                    <div className="small mt-2">Arcade Mode automates the end of game and starting new ones for hands off arcade fun.</div>
                                </div>

                                <hr />

                                <div className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <Form.Check
                                            type="switch"
                                            id="toontown-mode-switch"
                                            label="Toontown Mode"
                                            // value={enabled}
                                            checked={toontownMode}
                                            onChange={() => {
                                                setToontownMode(!toontownMode);
                                            }}
                                        />
                                    </div>
                                    <div className="small mt-2">Toontown Mode reskins the game to look like the classic Toontown Online game.</div>
                                </div>

                            </div>
                        }

                    </div>

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    {/* <div></div> */}


                    <div>

                        <ArticlesButton
                            variant="outline-dark"
                            onClick={() => {
                                setShow(false)
                            }}
                        >
                            Close
                        </ArticlesButton>

                        <ArticlesButton
                            variant="outline-danger ms-3"
                            onClick={() => {
                                reset()
                                // setShow(false)
                            }}
                        >
                            Reset
                        </ArticlesButton>

                    </div>


                    {/* <ArticlesButton variant="success" onClick={() => setValue(false)}>
                    Save
                </ArticlesButton> */}

                </Modal.Footer>

            </Modal>
        </>
    )

}