import React, {useEffect, useState} from 'react';
import SceneComponent from "./SceneComponent";
import GameController from "../GameControllers/GameController";

const GameScene = (props) => {


    const onSceneReady = async (scene, engine, resetGame,changeLevel,level) => {
    const game = new GameController(scene, engine, resetGame, changeLevel,level);
    }

    return (
        <div>
            <SceneComponent antialias onSceneReady={onSceneReady} id="canvas-game"/>
        </div>
    )
};

export default GameScene;
