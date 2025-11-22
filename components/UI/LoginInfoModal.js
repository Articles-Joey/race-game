import { useState } from "react";

import { Modal } from "react-bootstrap"

import ArticlesButton from "./Button";
import { useStore } from "../hooks/useStore";

export default function LoginInfoModal({
    // show,
    // setShow,
}) {

    const loginInfoModal = useStore((state) => state.loginInfoModal)
    const toggleLoginInfoModal = useStore((state) => state.toggleLoginInfoModal)

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
                    setShowModal(false)
                }}
                onHide={() => {
                    toggleLoginInfoModal(false)
                }}
            >

                <Modal.Header closeButton>
                    <Modal.Title>Login Details</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-3">

                    {`...`}

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    <div></div>

                    <ArticlesButton variant="outline-dark" onClick={() => {
                        setShowModal(false)
                    }}>
                        Close
                    </ArticlesButton>

                </Modal.Footer>

            </Modal>
        </>
    )

}