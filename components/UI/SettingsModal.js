import { useState } from "react";

import { Modal, Form } from "react-bootstrap"

import ArticlesButton from "@/components/UI/Button";
import { useStore } from "../hooks/useStore";
import useChatStore from "../hooks/useChatStore";

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

    const enabled = useChatStore((state) => state.enabled);
    const speechBubblesEnabled = useChatStore((state) => state.speechBubblesEnabled);

    const audioSettings = useStore((state) => state.audioSettings);
    const setAudioSettings = useStore((state) => state.setAudioSettings);

    const arcadeMode = useStore((state) => state.arcadeMode);
    const setArcadeMode = useStore((state) => state.setArcadeMode);

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
                            'Audio',
                            'Multiplayer',
                            'Chat',
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
                                        <div className="flex-header border-bottom pb-1 mb-1">

                                            <div>
                                                <div>{obj.action}</div>
                                                {obj.emote && <div className="span badge bg-dark">Emote</div>}
                                            </div>

                                            <div>

                                                <div className="badge badge-hover bg-articles me-1">{obj.defaultKeyboardKey}</div>

                                                <ArticlesButton
                                                    className=""
                                                    small
                                                >
                                                    Change Key
                                                </ArticlesButton>

                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                        {tab == 'Audio' &&
                            <>
                                <Form.Label className="mb-0">Game Volume</Form.Label>
                                <Form.Range 
                                    value={audioSettings?.game_volume}
                                    onChange={(value) => {
                                        console.log("Value", value)
                                        setAudioSettings({
                                            ...audioSettings,
                                            game_volume: value.target.value
                                        });
                                    }}
                                />

                                <Form.Label className="mb-0">Music Volume</Form.Label>
                                <Form.Range 
                                    value={audioSettings?.music_volume}
                                    onChange={(value) => {
                                        console.log("Value", value)
                                        setAudioSettings({
                                            ...audioSettings,
                                            music_volume: value.target.value
                                        });
                                    }}
                                />
                            </>
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
                            <div className="mx-4">
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