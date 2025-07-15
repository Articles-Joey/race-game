import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from "@react-three/fiber"

import { OrbitControls, } from "@react-three/drei";

const CameraControls = (props) => {

    const { onCameraChange, cameraUpdate, setCameraUpdate } = props;

    const {
        camera,
        gl: { domElement },
    } = useThree();

    const controls = useRef();

    useFrame(() => {
        // controls.current.update()
        // console.log(camera)
        onCameraChange(camera)
    });

    useEffect(() => {
        console.log("New cameraUpdate", cameraUpdate)
        if (cameraUpdate.position) {
            camera.position.set(
                cameraUpdate.position[0],
                cameraUpdate.position[1],
                cameraUpdate.position[2]
            );
            // You might also want to update other camera properties like rotation, etc.
        }
    }, [cameraUpdate])

    return (
        <OrbitControls
            ref={controls}
            args={[camera, domElement]}
            target={[14.5, 0, 0]}
        />
    );

};

export default CameraControls