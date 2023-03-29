import GameObject from "./GameObject";
import {FreeCamera, HemisphericLight, Scene, Vector3} from "@babylonjs/core";
import EnvironmentController from "./EnvironementController";
import "@babylonjs/core/Debug/debugLayer"; // Augments the scene with the debug methods
import "@babylonjs/inspector";
import PlayerCreator from "./PlayerCreator";
import PlayerController from "./PlayerController";
import InputController from "./InputController";
import EnvironementController from "./EnvironementController";
import GuiController from "./GuiController";
import MaterialController from "./MaterialController"; // Injects a local ES6 version of the inspector to prevent automatically relying on the none compatible version


class GameController{
    constructor(scene,engine,resetGame, changeLevel, level) {
        GameObject.GameController = this;
        GameObject.Scene = scene;
        GameObject.Engine= engine;
        GameObject.Level = level
        this.resetGame= resetGame;
        this.changeLevel = changeLevel
        this.setUpGame(scene,engine);
    }

    async setUpGame(scene,engine){

        GameObject.Engine.displayLoadingUI()

        scene.collisionsEnabled = true;

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
        const playerController = new PlayerController(player,input,environementController.lastPlatform)
        playerController.activatePlayerCamera();
        environementController.checkPoint(playerController)

        //Gui Controller
        const guiController = new GuiController(environementController.platforms.length - 1);

        //Material Controller
        const materialController = new MaterialController();

        scene.onBeforeRenderObservable.add(() => {
            guiController.updatePointCount(playerController.pointFind)
            if(playerController.pointFind === environementController.platforms.length - 1  && playerController.win){
                guiController.showWin();
                setTimeout(()=>{
                    this.changeLevel()
                },1000)

            }
            if(playerController.player.body.position.y <= -1){
                this.resetGame()
            }
        })

        // await scene.debugLayer.show();

        GameObject.Engine.hideLoadingUI()

    }


}

export default GameController
