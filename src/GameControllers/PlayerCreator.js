import GameObject from "./GameObject";
import {MeshBuilder, TransformNode, Vector3} from "@babylonjs/core";

class PlayerCreator extends GameObject{
    constructor() {
        super();
        this.createPlayer();
    }

    createPlayer(){
        this.body = MeshBuilder.CreateBox("player",{size: 2}, this.scene);
        this.body.position = new Vector3(0,20,0);
        this.body.checkCollisions = true;
        this.body.isPickable = false;

        //Character Parent
        this.character = new TransformNode("character_parent");
        this.character.parent = this.body;
        this.character.isPickable = false;

    }
}

export default PlayerCreator;
