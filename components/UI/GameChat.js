"use client";

import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import ForumIcon from '@mui/icons-material/Forum';
import SendIcon from '@mui/icons-material/Send';
import useChatStore from '@/hooks/useChatStore';
import useGameStore from '@/hooks/useGameStore';
import ArticlesButton from './Button';

export default function GameChat() {
    const isHost = useGameStore((state) => state.isHost);
    const enabled = useChatStore((state) => state.enabled);
    const toggleEnabled = useChatStore((state) => state.toggleEnabled);
    const messages = useChatStore((state) => state.messages);
    const sendMessage = useChatStore((state) => state.sendMessage);
    const [inputValue, setInputValue] = useState('');
    const betterMessages = useMemo(() => messages.map((msg) => ({ ...msg })), [messages]);

    function handleSendMessage() {
        sendMessage(inputValue, isHost);
        setInputValue('');
    }

    return (
        <Box sx={{ p: 1, border: '1px solid #212529' }}>
            <ArticlesButton
                sx={{ width: '100%', mb: 1 }}
                onClick={toggleEnabled}
                startIcon={<ForumIcon />}
            >
                {enabled ? 'Disable' : 'Enable'} Chat!
                {messages?.length > 0 && <Chip size="small" label={messages.length} sx={{ ml: 1 }} />}
            </ArticlesButton>
            {enabled && (
                <>
                    <Box sx={{ border: '1px solid #000', height: 200, overflow: 'auto' }}>
                        {betterMessages.map((msg, index) => (
                            <Box key={index} sx={{ mb: 0.5 }}>
                                <strong>{msg?.nickname || msg?.sender}:</strong> {msg.text}
                            </Box>
                        ))}
                        {betterMessages.length === 0 && <Box sx={{ p: 0.5 }}><strong>No messages yet.</strong></Box>}
                    </Box>
                    <Box>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="Type a message..."
                            value={inputValue}
                            slotProps={{ htmlInput: { 'aria-label': 'Chat message' } }}
                            onChange={(event) => setInputValue(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' && inputValue.length > 1) handleSendMessage();
                            }}
                        />
                        <ArticlesButton
                            sx={{ width: '100%' }}
                            onClick={handleSendMessage}
                            disabled={inputValue.length <= 1}
                            endIcon={<SendIcon />}
                        >
                            Send
                        </ArticlesButton>
                    </Box>
                </>
            )}
        </Box>
    );
}
