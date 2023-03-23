import {useEffect, useRef, useState} from "react";
import { Engine, Scene } from "@babylonjs/core";

export default ({ antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, ...rest }) => {
    const [play, setPlay] = useState(false);
    const [level, setLevel] = useState(1)
    const reactCanvas = useRef(null);

    // set up basic engine and scene
    useEffect(() => {
        const { current: canvas } = reactCanvas;

        if (!canvas) return;
        const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
        const scene = new Scene(engine, sceneOptions);
        if (scene.isReady()) {
            onSceneReady(scene,engine, resetGame);
        } else {
            scene.onReadyObservable.addOnce((scene) => onSceneReady(scene,engine,resetGame));
        }

        engine.runRenderLoop(() => {
            if (typeof onRender === "function") onRender(scene);
            scene.render();
        });

        const resize = () => {
            scene.getEngine().resize();
        };

        if (window) {
            window.addEventListener("resize", resize);
        }

        return () => {
            scene.getEngine().dispose();

            if (window) {
                window.removeEventListener("resize", resize);
            }
        };
    }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady,play]);

    const resetGame = () => {
        setPlay((play) => !play);
    };

    const changeLevel = ()=>{
        setLevel(level+ 1)
    }

    return <canvas ref={reactCanvas} {...rest} />

};
