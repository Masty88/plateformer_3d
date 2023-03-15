import GameObject from "./GameObject";
import {FreeCamera, HemisphericLight, Vector3} from "@babylonjs/core";
import EnvironmentController from "./EnvironementController";
import "@babylonjs/core/Debug/debugLayer"; // Augments the scene with the debug methods
import "@babylonjs/inspector";
import PlayerCreator from "./PlayerCreator";
import PlayerController from "./PlayerController";
import InputController from "./InputController";
import EnvironementController from "./EnvironementController"; // Injects a local ES6 version of the inspector to prevent automatically relying on the none compatible version

class GameController{
    constructor(scene,engine) {
        GameObject.GameController = this;
        GameObject.Scene = scene;
        GameObject.Engine= engine;
        this.setUpGame(scene);
    }

    async setUpGame(scene,engine){

        GameObject.Engine.displayLoadingUI()

        this.mainLight = new HemisphericLight("light", Vector3.Up(), scene);
        this.mainLight.intensity = 0.2

        const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(true)

        //Create environnment
        const environementController = new EnvironementController();

        //Create Player
        const player = new PlayerCreator();

        //Input Controller
        const input= new InputController();

        // Create Player controller
        const playerController = new PlayerController(player,input)
        playerController.activatePlayerCamera();

        await scene.debugLayer.show();

        GameObject.Engine.hideLoadingUI()

    }
}

export default GameController
