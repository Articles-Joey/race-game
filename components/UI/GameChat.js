import { useState } from "react";

import useChatStore from "../hooks/useChatStore";
import ArticlesButton from "./Button";

export default function GameChat() {

    const enabled = useChatStore((state) => state.enabled);
    const toggleEnabled = useChatStore((state) => state.toggleEnabled);
    const setEnabled = useChatStore((state) => state.setEnabled);

    const messages = useChatStore((state) => state.messages);
    const addFakeMessage = useChatStore((state) => state.addFakeMessage);
    const sendMessage = useChatStore((state) => state.sendMessage);

    const [inputValue, setInputValue] = useState("");

    // if (!enabled) {
    //     return (
    //         <ArticlesButton
    //             onClick={() => {
    //                 toggleEnabled(true);
    //             }}
    //         >
    //             Toggle Chat!
    //         </ArticlesButton>
    //     );
    // }

    return (
        <div className="game-chat p-2 border border-dark">

            <ArticlesButton
                className="w-100 mb-2"
                onClick={() => {
                    toggleEnabled(true);
                }}
            >
                <i className="fad fa-comments-alt"></i>
                {enabled ? "Disable" : "Enable"} Chat!
                {messages.length > 0 &&
                    <span className="ml-2 badge badge-secondary">
                        {messages.length}
                    </span>
                }
            </ArticlesButton>

            {enabled && <>
                <div className="chat-messages">
                    {/* Chat messages will appear here */}
                    {messages.map((msg, index) => (
                        <div key={index} className="chat-message mb-1">
                            <strong>{msg.sender}:</strong> {msg.text}
                        </div>
                    ))}
                </div>

                <div className="chat-input">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <ArticlesButton
                        className="w-100"
                        onClick={() => {
                            sendMessage(inputValue);
                            addFakeMessage(inputValue);
                            setInputValue("");
                        }}
                        disabled={inputValue.length <= 1}
                    >
                        Send
                        <i className="fad fa-paper-plane ms-2"></i>
                    </ArticlesButton>
                </div>
            </>}

        </div>
    )
}