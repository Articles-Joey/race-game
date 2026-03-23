import { useStore } from "@/components/hooks/useStore";

import ArticlesButton from "../Button";

export default function GraphicsTab() {

    const graphicsQuality = useStore((state) => state?.graphicsQuality);
    const setGraphicsQuality = useStore((state) => state?.setGraphicsQuality);

    const landingModel = useStore((state) => state?.landingModel);
    const setLandingModel = useStore((state) => state?.setLandingModel);

    return (
        <>

            <div>Graphics Quality</div>
            <div className="mb-3">
                {['Low', 'Medium', 'High'].map(level => (
                    <ArticlesButton
                        active={graphicsQuality === level}
                        onClick={() => {
                            setGraphicsQuality(level);
                        }}
                    >
                        {level}
                    </ArticlesButton>
                ))}
            </div>

            <div>Landing Model</div>
            <div className="mb-3">
                <ArticlesButton
                    active={landingModel === false}
                    onClick={() => {
                        setLandingModel(false);
                    }}
                >
                    Disabled
                </ArticlesButton>
                <ArticlesButton
                    active={landingModel === true}
                    onClick={() => {
                        setLandingModel(true);
                    }}
                >
                    Enabled
                </ArticlesButton>
            </div>

        </>
    )

}