"use client";

import { useEffect, useState } from "react";

import { Modal } from "react-bootstrap"

import ArticlesButton from "./Button";
import { useStore } from "@/hooks/useStore";
import { useSearchParams } from "next/navigation";

export default function KickedModal({
    show,
    setShow,
}) {

    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    const { kicked } = searchParamsObject

    const kickedStore = useStore((state) => state?.kicked);
    const setKickedStore = useStore((state) => state?.setKicked);

    useEffect(() => {

        if (kicked) {

            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete("kicked");
            window.history.replaceState({}, '', `${window.location.pathname}?${newSearchParams}`);

            setKickedStore({
                message: "You have been removed from the game by the host."
            })

        }

    }, [kicked]);

    return (
        <>

            <Modal
                className="articles-modal games-info-modal"
                size='md'
                show={kickedStore}
                centered
                scrollable
                onExited={() => {
                    setKickedStore(false)
                }}
                onHide={() => {
                    setKickedStore(false)
                }}
            >

                <Modal.Header closeButton>
                    <Modal.Title>Removed from Game</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-3">

                    Kicked: {kickedStore?.message}

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    <div></div>

                    <ArticlesButton variant="outline-dark" onClick={() => {
                        setKickedStore(false)
                    }}>
                        Close
                    </ArticlesButton>

                </Modal.Footer>

            </Modal>
        </>
    )

}