import { useState } from "react";

import { Modal } from "react-bootstrap"

import ArticlesButton from "./Button";
import { useStore } from "../hooks/useStore";

import { useUserDetails, useUserToken } from "@articles-media/articles-dev-box";

export default function LoginInfoModal({
    // show,
    // setShow,
}) {

    const loginInfoModal = useStore((state) => state.loginInfoModal)
    const toggleLoginInfoModal = useStore((state) => state.toggleLoginInfoModal)

    const [showModal, setShowModal] = useState(true)

    const {
        data: userToken,
        error: userTokenError,
        isLoading: userTokenLoading,
        mutate: userTokenMutate
    } = useUserToken(
        "3016"
    );

    const {
        data: userDetails,
        error: userDetailsError,
        isLoading: userDetailsLoading,
        mutate: userDetailsMutate
    } = useUserDetails({
        token: userToken
    });

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

                    {userDetailsLoading &&
                        <p>Loading...</p>
                    }

                    {userDetailsError &&
                        <p>Error loading user details.</p>
                    }

                    {userDetails &&
                        <div>
                            <p>You are logged in as: </p>
                            <p><strong>Display Name:</strong> {userDetails.display_name}</p>
                            <p><strong>ID:</strong> {userDetails.user_id}</p>
                        </div>
                    }

                    {!userDetailsLoading && !userDetailsError && !userDetails &&
                        <p>You are not logged in.</p>
                    }

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