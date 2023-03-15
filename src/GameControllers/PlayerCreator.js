import GameObject from "./GameObject";
import {Color3, Matrix, MeshBuilder, StandardMaterial, TransformNode, Vector3} from "@babylonjs/core";

class PlayerCreator extends GameObject{
    constructor() {
        super();
        this.createPlayer();
    }

    createPlayer(){
        // this.body = MeshBuilder.CreateBox("player",{size: 2}, this.scene);
        this.body = MeshBuilder.CreateSphere("player",{diameter: 2}, this.scene);
        this.body.position = new Vector3(0,10,0);
        this.body.checkCollisions = true;
        this.body.isPickable = false;
        this.body.bakeTransformIntoVertices(Matrix.Translation(0, 1, 0))
        //for collisions
        this.body.ellipsoid = new Vector3(1, 0.8, 1);
        this.body.ellipsoidOffset = new Vector3(0, 1, 0);
        // this.body.rotation.y = Math.PI / 2;

        // Create player debug ellipsoid shape
        var ellipsoid = MeshBuilder.CreateCylinder("debug", {diameter: (this.body.ellipsoid.x *2), height: (this.body.ellipsoid.y * 2), subdivisions: 24}, this.scene);
        ellipsoid.position.copyFrom(this.body.position);
        ellipsoid.position.addInPlace(this.body.ellipsoidOffset);

        // Set ellipsoid debug shape material
        var debugmat = new StandardMaterial("debugmat", this.scene);
        debugmat.diffuseColor = new Color3(0, 1, 0);
        debugmat.wireframe = true;
        ellipsoid.material = debugmat;
        ellipsoid.isPickable = false


        //Character Parent
        this.character = new TransformNode("character_parent");
        this.character.parent = this.body;
        this.character.isPickable = false;

    }
}

export default PlayerCreator;
