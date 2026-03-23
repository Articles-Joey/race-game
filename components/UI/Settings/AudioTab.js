import { Form } from "react-bootstrap"

import ArticlesButton from "../Button";
import { useAudioStore } from "@/components/hooks/useAudioStore";

export default function AudioTab() {

    const audioSettings = useAudioStore((state) => state?.audioSettings);
    const setAudioSettings = useAudioStore((state) => state?.setAudioSettings);

    return (
        <>

            <div>Sound</div>
            <div className="mb-3">
                <ArticlesButton
                    active={!audioSettings?.enabled}
                    onClick={() => {
                        setAudioSettings({
                            ...audioSettings,
                            enabled: false
                        });
                    }}
                >
                    Disabled
                </ArticlesButton>
                <ArticlesButton
                    active={audioSettings?.enabled}
                    onClick={() => {
                        setAudioSettings({
                            ...audioSettings,
                            enabled: true
                        });
                    }}
                >
                    Enabled
                </ArticlesButton>
            </div>

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
    )

}