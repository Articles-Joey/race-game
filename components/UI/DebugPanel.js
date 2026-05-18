"use client"

import { Dropdown, Form } from 'react-bootstrap';

import ArticlesButton from '@/components/UI/Button';

import IsDev from '@/components/UI/IsDev';
import useCameraStore from '@/hooks/useCameraStore';
import useGameStore from '@/hooks/useGameStore';

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import { useSearchParams } from 'next/navigation';

export default function DebugPanel() {

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    // const cameraUpdate = useCameraStore((state) => state?.cameraUpdate);
    const setCameraUpdate = useCameraStore((state) => state?.setCameraUpdate);

    // const router = useRouter()
    // const pathname = usePathname()
    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    const {
        server,
        server_type
    } = searchParamsObject

    const startGame = useGameStore((state) => state.startGame);

    return (
        <div>
            <IsDev>
                <hr className='my-2' />

                <div className="small text-center">
                    Dev Debug
                </div>

                <div className='d-flex flex-column mb-2'>

                    <ArticlesButton
                        small
                        variant="warning"
                        className="mb-2"
                        // active={renderMode == "2D"}
                        onClick={() => {
                            // setRenderMode("2D")
                        }}
                    >
                        Reset Room
                    </ArticlesButton>

                    <ArticlesButton
                        small
                        variant="warning"
                        className="mb-2"
                        // active={renderMode == "2D"}
                        onClick={() => {
                            // setRenderMode("2D")
                            startGame()
                        }}
                    >
                        Force Start
                    </ArticlesButton>

                    <ArticlesButton
                        small
                        variant="warning"
                        className="mb-2"
                        // active={renderMode == "2D"}
                        onClick={() => {
                            // setRenderMode("2D")
                            generateMysterySpots()
                        }}
                    >
                        Generate Mystery Spots
                    </ArticlesButton>

                </div>
            </IsDev>

            <Dropdown className="d-flex w-100 text-center">

                <Dropdown.Toggle variant='articles w-100 d-flex justify-content-center align-items-center text-center'>
                    Camera Presets
                </Dropdown.Toggle>

                <Dropdown.Menu className="">

                    {
                        // userReduxState?.friends?
                        [
                            {
                                name: "Starting",
                                position: [19, 10, 15]
                            },
                            {
                                name: "Bleacher",
                                position: [28.32, 5.38, -6.30]
                            },
                            {
                                name: "First Person",
                                position: [0, 3.5, 0]
                            },
                            {
                                name: "Wind Turbine",
                                position: [42.50, 16.94, -125.86]
                            }
                        ]
                            .map((friend, i) => {
                                return (
                                    <Dropdown.Item
                                        key={`${i}-${friend.name}`}
                                        onClick={() => {
                                            setCameraUpdate({
                                                position: friend.position
                                            })
                                        }}
                                        className=""
                                        eventKey={i}
                                    >
                                        {/* <i className="fad fa-user" aria-hidden="true"></i> */}
                                        {friend.name}
                                    </Dropdown.Item>
                                )
                            })}

                </Dropdown.Menu>

            </Dropdown>

            <div className='d-none'>
                <div className="text-center">
                    Camera Positions
                </div>

                <div className="camera-controls">

                    {[
                        {
                            name: "Starting",
                            position: [19, 10, 15]
                        },
                        {
                            name: "Bleacher",
                            position: [28.32, 5.38, -6.30]
                        },
                        {
                            name: "First Person",
                            position: [0, 3.5, 0]
                        },
                        {
                            name: "Wind Turbine",
                            position: [42.50, 16.94, -125.86]
                        }
                    ].map(item => {
                        return (
                            <ArticlesButton
                                key={item.name}
                                small
                                variant=""
                                className=""
                                onClick={() => {
                                    setCameraUpdate({
                                        position: item.position
                                    })
                                }}
                            >
                                {item.name}
                            </ArticlesButton>
                        )
                    })}

                </div>
            </div>
        </div>
    )

}