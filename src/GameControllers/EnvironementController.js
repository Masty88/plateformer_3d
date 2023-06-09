import GameObject from "./GameObject";
import {
    ActionManager,
    Animation,
    AnimationGroup,
    Color3, CubeTexture,
    ExecuteCodeAction,
    MeshBuilder,
    StandardMaterial, Texture,
    Vector3
} from "@babylonjs/core";
import Point from "./Point";

class EnvironementController extends GameObject{
    static PLATFORM_SIZE_RANGE = { min: 3.5, max: 6 };
    static PLATFORM_Y_RANGE = { min: 3.5, max: 5 };
    static MAX_JUMP_DISTANCE = 10;

    constructor() {
        super();

        //Generate random plateforms
        this.platforms = [];

        //Create array for points
        this.points = [];

        this.setGround();
        this.setSkybox();

    }

    setSkybox(){
        this.skybox = MeshBuilder.CreateBox("skyBox", { size: 200}, this.scene);
        const skyboxMaterial = new StandardMaterial("skyBox", this.scene)
        skyboxMaterial.reflectionTexture = new CubeTexture("skybox/JPEG/d", this.scene)
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        this.skybox.material = skyboxMaterial;
        this.skybox.isPickable = false;
        this.skybox.checkCollisions = false;
        this.skybox.infiniteDistance = true
    }

    setGround(){
        this.ground = MeshBuilder.CreateBox("platform_ground", {width: 10, height: 0.6, depth: 10}, this.scene);
        this.ground.checkCollisions = true;
        this.ground.isPickable = true;
        this.setPlatforms();
    }

    setPlatforms(){
        // Generate the first platform at a fixed starting position
        const startPosition = new Vector3(0, 5, 6);
        const startSize = this.getRandomSize();
        const startPlatform = this.generatePlatform(startPosition, startSize);
        this.platforms.push(startPlatform);
        // Generate additional platforms
        let previousPlatform = startPlatform;
        console.log(previousPlatform)
        for (let i = 0; i < this.level; i++) {
            const reachableDistance = EnvironementController.MAX_JUMP_DISTANCE
            const yOffset = Math.floor(Math.random() * (EnvironementController.PLATFORM_Y_RANGE.max - EnvironementController.PLATFORM_Y_RANGE.min + 1)) + EnvironementController.PLATFORM_Y_RANGE.min;
            const position = this.getRandomPositionWithinRange(previousPlatform.position, reachableDistance, yOffset);
            const size = this.getRandomSize();
            const platform = this.generatePlatform(position, size);
            this.platforms.push(platform);
            previousPlatform = platform;
        }
        this.updateEnvironement();
        this.createPoints();
    }

    getRandomSize() {
        const width = Math.floor(Math.random() * (EnvironementController.PLATFORM_SIZE_RANGE.max - EnvironementController.PLATFORM_SIZE_RANGE.min + 1)) + EnvironementController.PLATFORM_SIZE_RANGE.min;
        const height = Math.floor(Math.random() * (EnvironementController.PLATFORM_SIZE_RANGE.max - EnvironementController.PLATFORM_SIZE_RANGE.min + 1)) + EnvironementController.PLATFORM_SIZE_RANGE.min;
        return { width, height};
    }

    getRandomPositionWithinRange(position, distance, yOffset) {
        const xOffset = Math.floor(Math.random() * (distance * 2 + 1)) - distance;
        const zOffset = Math.floor(Math.sqrt(distance * distance - xOffset * xOffset));
        return position.add(new Vector3(xOffset, yOffset, zOffset));
    }

    generatePlatform(position, size) {
        const platform = MeshBuilder.CreateBox("platform", { width: size.width, height: 0.6, depth: size.height }, this.scene);
        platform.position.copyFrom(position);
        platform.checkCollisions = true;

        return platform;
    }

    createPoints(){
        for(let i = 0; i < this.platforms.length - 1; i++ ){
            let platform = this.platforms[i]
            const dimensions = platform.getBoundingInfo().boundingBox.maximum.subtract(platform.getBoundingInfo().boundingBox.minimum);
            const xRange = dimensions.x / 2;
            const x = platform.position.x + Math.random() * xRange - xRange / 2;
            const yRange = dimensions.y;
            const y = platform.position.y + Math.random() * yRange + 1.5;
            const zRange = dimensions.z / 2;
            const z = platform.position.z + Math.random() * zRange - zRange / 2;
            const point = new Point(new Vector3(x, y, z), i);
            point.isTake = false
            this.points.push(point);
        }
    }

    updateEnvironement(){
        this.lastPlatform = this.platforms[this.platforms.length - 1];
        const yUp = this.lastPlatform.position.y + 3;
        const yDown = this.lastPlatform.position.y - 3;

        let isGoingUp = true;

        this.beforeLoop=()=>{
            this.skybox.rotation.y += 0.0004
            if (isGoingUp) {
                this.lastPlatform.position.y += 0.1;
                if (this.lastPlatform.position.y >= yUp) {
                    isGoingUp = false;
                }
            } else {
                this.lastPlatform.position.y -= 0.1;
                if (this.lastPlatform.position.y <= yDown) {
                    isGoingUp = true;
                }
            }
        }
    }

    checkPoint(player){
        player.pointFind = 0;
        console.log(player.player)
        this.points.forEach((point)=>{
                player.player.body.actionManager.registerAction(
                    new ExecuteCodeAction(
                        {
                            trigger: ActionManager.OnIntersectionEnterTrigger,
                            parameter: point.point
                        },
                        ()=>{
                            console.log(point)
                            if(point.isTake == false){
                                player.pointFind +=1;
                            }
                            point.isTake = true;
                            point.point.dispose();

                        }
                    )
                )
        })
    }


}

export default EnvironementController;
