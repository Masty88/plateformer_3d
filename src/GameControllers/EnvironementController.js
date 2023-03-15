import GameObject from "./GameObject";
import {Color3, MeshBuilder, StandardMaterial, Vector3} from "@babylonjs/core";

class EnvironementController extends GameObject{
    static PLATFORM_SIZE_RANGE = { min: 3.5, max: 6 };
    static MAX_JUMP_DISTANCE = 12;

    constructor() {
        super();

        //Generate random plateforms
        this.platforms = [];

        this.setGround();

    }

    setGround(){
        this.ground = MeshBuilder.CreateBox("ground", {width: 10, height: 0.2, depth: 10}, this.scene);
        this.ground.checkCollisions = true;
        this.ground.isPickable = true;
        this.setPlatforms();
    }

    setPlatforms(){
        // Generate the first platform at a fixed starting position
        const startPosition = new Vector3(0, 5, 3);
        const startSize = this.getRandomSize();
        const startPlatform = this.generatePlatform(startPosition, startSize);
        this.platforms.push(startPlatform);
        // Generate additional platforms
        let previousPlatform = startPlatform;
        console.log(previousPlatform)
        for (let i = 0; i < 5; i++) {
            const reachableDistance = EnvironementController.MAX_JUMP_DISTANCE
            const position = this.getRandomPositionWithinRange(previousPlatform.position, reachableDistance);
            const size = this.getRandomSize();
            const platform = this.generatePlatform(position, size);
            this.platforms.push(platform);
            previousPlatform = platform;
        }
    }

    getRandomSize() {
        const width = Math.floor(Math.random() * (EnvironementController.PLATFORM_SIZE_RANGE.max - EnvironementController.PLATFORM_SIZE_RANGE.min + 1)) + EnvironementController.PLATFORM_SIZE_RANGE.min;
        const height = Math.floor(Math.random() * (EnvironementController.PLATFORM_SIZE_RANGE.max - EnvironementController.PLATFORM_SIZE_RANGE.min + 1)) + EnvironementController.PLATFORM_SIZE_RANGE.min;
        return { width, height };
    }

    getRandomPositionWithinRange(position, distance) {
        const xOffset = Math.floor(Math.random() * (distance * 2 + 1)) - distance;
        const zOffset = Math.floor(Math.sqrt(distance * distance - xOffset * xOffset));
        return position.add(new Vector3(xOffset, 0, zOffset));
    }

    generatePlatform(position, size) {
        const platform = MeshBuilder.CreateBox("platform", { width: size.width, height: 0.1, depth: size.height }, this.scene);
        platform.position.copyFrom(position);
        platform.checkCollisions = true;
        return platform;
    }

}

export default EnvironementController;
