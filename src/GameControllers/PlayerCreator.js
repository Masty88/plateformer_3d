import GameObject from "./GameObject";
import {MeshBuilder, Vector3} from "@babylonjs/core";

class PlayerCreator extends GameObject{
    constructor() {
        super();
        this.createPlayer();
    }

    createPlayer(){
        this.player = MeshBuilder.CreateSphere("player",{diameter:2}, this.scene);
        this.player.position = new Vector3(0,2,0);
        this.player.checkCollisions = true;
    }
}

export default PlayerCreator;
