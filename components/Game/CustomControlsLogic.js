"use client";
import { useEffect } from "react";
import { useStore } from "../hooks/useStore";

export default function CustomControlsLogic() {

    const controlSettings = useStore((state) => state.controlSettings);
    // const setControlSettings = useStore((state) => state.setControlSettings);

    const actionsCount = Object.values(controlSettings).filter((value) => value).length;

    useEffect(() => {
        console.log("Control Settings changed, need to set key listeners for ", actionsCount, `actions`);

        const handleKeyDown = (e) => {
            Object.entries(controlSettings).forEach(([action, key]) => {
                if (key && e.key.toLowerCase() === key.toLowerCase()) {
                    console.log(`Custom control clicked for ${action}`);
                }
            });
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [controlSettings, actionsCount]);

    return null;

}