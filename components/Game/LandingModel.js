import dynamic from "next/dynamic";
import { useStore } from "../hooks/useStore";

// import GameCanvas from "./GameCanvas";
const GameCanvas = dynamic(() => import('./GameCanvas'), { ssr: false });

export default function LandingModel() {

    const landingModel = useStore((state) => state?.landingModel);

    return (
        <>
            {landingModel &&
                <GameCanvas/>
            }
        </>
    )
}