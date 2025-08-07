import { useState } from "react";

import { Modal } from "react-bootstrap"

import ArticlesButton from "./Button";

export default function CreditsModal({
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
                    <Modal.Title>Race Game Credits</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-3">

                    {/* <div></div> */}

                    <div>Developed by: ArticlesJoey </div>
                    <div>Published by: Articles Media </div>

                    <div className="mb-3"></div>

                    <div>Attributions</div>
                    <div>Windmill Model:</div>
                    <div>Player Models:</div>
                    <div>Bleacher Model:</div>
                    <div>Tree Model:</div>
                    <div>Boat Model:</div>
                    <div>Grass Texture:</div>
                    <div>Water Texture:</div>

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