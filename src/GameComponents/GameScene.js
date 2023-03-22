import React, {useState} from 'react';
import SceneComponent from "./SceneComponent";
import GameController from "../GameControllers/GameController";

const GameScene = (props) => {
    const [count, setCount] = useState(1)
    const onSceneReady = async (scene, engine) => {
        let game = new GameController(scene, engine,count,setCount)
    }

    return (
        <div>
            <SceneComponent antialias onSceneReady={onSceneReady} id="canvas-game"/>
        </div>
    )
};

export default GameScene;
