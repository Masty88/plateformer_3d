import GameObject from "./GameObject";
import {Color3, MeshBuilder, StandardMaterial, Vector3} from "@babylonjs/core";

class EnvironmentController extends GameObject{
    constructor() {
        super();
        this.setGround();

        //Generate random plateforms
        this.platforms = [];
        this.minDistance = 5;
        this.maxDistance = 10;
        this.platformCount = 5;
        this.platformSize = new Vector3(2, 0.5, 2);
        this.platformMaterial = new StandardMaterial("platformMaterial", this.scene);
        this.platformMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5);
    }

    setGround(){
        this.ground = MeshBuilder.CreateBox("ground", {width: 10, height: 0.2, depth: 10}, this.scene);
        this.ground.checkCollisions = true;
        this.ground.isPickable = true;
        this.setPlateforms();
    }

    setPlateforms(){
        let currentPos = Vector3.Zero();
        for (let i = 0; i < this.platformCount; i++) {
            // choose random distance between minDistance and maxDistance
            let distance = Math.random() * (this.maxDistance - this.minDistance) + this.minDistance;
            // choose random position based on previous platform and distance
            let pos = new Vector3(currentPos.x + distance, currentPos.y + (Math.random() - 0.5) * 2, currentPos.z + (Math.random() - 0.5) * 2);
            // create platform
            let platform = MeshBuilder.CreateBox(`platform${i}`, {
                width: this.platformSize.x,
                height: this.platformSize.y,
                depth: this.platformSize.z
            }, this.scene);
            platform.material = this.platformMaterial;
            platform.position = pos;
            platform.checkCollisions = true;
            platform.isPickable = true;
            this.platforms.push(platform);
            currentPos = pos;
        }

    }
}

export default EnvironmentController;
