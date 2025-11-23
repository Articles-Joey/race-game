"use client"
import { useState } from "react";

import { Modal } from "react-bootstrap"

import ArticlesButton from "./Button";

export default function GameInfoModal({
    show,
    setShow,
}) {

    const [showModal, setShowModal] = useState(true)

    return (
        <>

            <Modal
                className="articles-modal games-info-modal"
                size='md'
                show={showModal}
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
                    <Modal.Title>Race Game Info</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-3">

                    {`Get to the finish line first in this exciting multiplayer racing game! Don't get to greedy though, moving can only happen if no other player picks the same number of spaces as you.`}

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    <div></div>

                    <ArticlesButton variant="outline-dark" onClick={() => {
                        setShow(false)
                    }}>
                        Close
                    </ArticlesButton>

                </Modal.Footer>

            </Modal>
        </>
    )

}