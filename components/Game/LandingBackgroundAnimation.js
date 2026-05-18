import dynamic from "next/dynamic";
import { useStore } from "@/hooks/useStore";

// import GameCanvas from "./GameCanvas";
const GameCanvas = dynamic(() => import('./GameCanvas'), { ssr: false });

export default function LandingBackgroundAnimation() {

    const landingAnimation = useStore(state => state.landingAnimation)

    return (
        <>
            {landingAnimation &&
                <GameCanvas/>
            }
        </>
    )
}