import React from 'react';
import SceneComponent from "./SceneComponent";
import GameController from "../GameControllers/GameController";

const GameScene = (props) => {
    const onSceneReady = async (scene, engine) => {
        let game = new GameController(scene, engine)
    }

    return (
        <div>
            <SceneComponent antialias onSceneReady={onSceneReady} id="canvas-game"/>
        </div>
    )
};

export default GameScene;
