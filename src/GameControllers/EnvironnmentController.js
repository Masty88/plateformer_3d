import GameObject from "./GameObject";
import {MeshBuilder} from "@babylonjs/core";

class EnvironmentController extends GameObject{
    constructor() {
        super();
        this.setGround();
    }

    setGround(){
        this.ground = MeshBuilder.CreateBox("ground", {width: 10, height: 0.2, depth: 10}, this.scene)
    }
}

export default EnvironmentController;
