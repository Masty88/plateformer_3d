import GameObject from "./GameObject";
import {MeshBuilder} from "@babylonjs/core";

class Point extends GameObject{
    constructor(position, nmb) {
        super();
        this.setPoint(position,nmb)
    }

    setPoint(position,nmb){
        this.point = MeshBuilder.CreateSphere(`point ${nmb}`, {diameter: 1}, this.scene);
        this.point.isPickable = false;
        this.point.position = position
    }
}

export default Point
