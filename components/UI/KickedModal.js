"use client";

import { useState } from "react";

import { Modal } from "react-bootstrap"

import ArticlesButton from "./Button";
import { useStore } from "../hooks/useStore";

export default function KickedModal({
    show,
    setShow,
}) {

    const kicked = useStore((state) => state?.kicked);
    const setKicked = useStore((state) => state?.setKicked);

    return (
        <>

            <Modal
                className="articles-modal games-info-modal"
                size='md'
                show={kicked}
                centered
                scrollable
                onExited={() => {
                    setKicked(false)
                }}
                onHide={() => {
                    setKicked(false)
                }}
            >

                <Modal.Header closeButton>
                    <Modal.Title>Removed from Game</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-3">

                    Kicked: {kicked?.message}

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    <div></div>

                    <ArticlesButton variant="outline-dark" onClick={() => {
                        setKicked(false)
                    }}>
                        Close
                    </ArticlesButton>

                </Modal.Footer>

            </Modal>
        </>
    )

}