import GameObject from "./GameObject";
import {ActionManager, Color3, FollowCamera, Quaternion, Ray, RayHelper, Vector3} from "@babylonjs/core";

class PlayerController extends GameObject{
    static PLAYER_SPEED= 0.1;
    static JUMP_FORCE = 0.7;

    //Gravity
    static GRAVITY = -1.8
    gravity = new Vector3();
    lastGroundPos = Vector3.Zero(); // keep track of the last grounded position

    constructor(player,input, lastPlatform) {
        super();
        this.player = player;
        this.input = input;
        this.lastPlatform = lastPlatform;
        this.lastPlatform.metadata = {
            lastPosition : this.lastPlatform.position.clone()
        }
        this.setupPlayerCamera();
        this.managePoint();
    }

    updateFromControl(){
        //Get the delta time
        this.deltaTime = this.engine.getDeltaTime() / 1000;
        this.player.body.frontVector = new Vector3(0,0,1)
        this.horizontal = this.input.horizontalAxis;
        this.vertical = this.input.verticalAxis;
        this.moveDirection = Vector3.Zero(); //initialise moveDirection to zero


        //right
        if(this.horizontal > 0){
            this.player.body.rotation.y += .1;
            this.player.body.frontVector = new Vector3(Math.sin(this.player.body.rotation.y),0,Math.cos(this.player.body.rotation.y));
            // this.camera.rotationOffset = 180;
        }
        // //left
        if(this.horizontal < 0){
            this.player.body.rotation.y -= .1;
            this.player.body.frontVector = new Vector3(Math.sin(this.player.body.rotation.y),0,Math.cos(this.player.body.rotation.y));
            // this.camera.rotationOffset = 180;
        }
        //up
        if(this.vertical > 0){
            this.player.body.frontVector = new Vector3(Math.sin(this.player.body.rotation.y),0,Math.cos(this.player.body.rotation.y));
            this.moveDirection= this.player.body.frontVector.multiplyByFloats(PlayerController.PLAYER_SPEED,PlayerController.PLAYER_SPEED,PlayerController.PLAYER_SPEED);
            this.player.body.moveWithCollisions(this.moveDirection)
        }
        // //down
        if(this.vertical < 0){
            this.player.body.frontVector = new Vector3(Math.sin(this.player.body.rotation.y),0,Math.cos(this.player.body.rotation.y));
            this.moveDirection= this.player.body.frontVector.multiplyByFloats(-PlayerController.PLAYER_SPEED,-PlayerController.PLAYER_SPEED,-PlayerController.PLAYER_SPEED);
            this.player.body.moveWithCollisions(this.moveDirection)
        }
    }

    floorRayCast(offsetx, offsetz, raycastlen){
        let raycastFloorPos = new Vector3(this.player.body.position.x + offsetx, this.player.body.position.y  , this.player.body.position.z + offsetz);
        this.ray = new Ray(raycastFloorPos, Vector3.Up().scale(-1), raycastlen);
        // this.helper = RayHelper.CreateAndShow(this.ray, this.scene, new Color3(1, 1, 0.1));
        let predicate = function (mesh) {
            return mesh.isPickable && mesh.isEnabled();
        }
        let pick = this.scene.pickWithRay(this.ray, predicate);
        if (pick.hit) {
            return pick.pickedPoint;
        } else {
            return Vector3.Zero();
        }

    }

    isGrounded(){
        if(this.floorRayCast(0,0,.2).equals(Vector3.Zero())){
            return false
        }else{
            return true;
        }
    }

    updateGroundDetection(){
        if(!this.isGrounded()){
            this.gravity= this.gravity.addInPlace(Vector3.Up().scale(this.deltaTime * PlayerController.GRAVITY));
            console.log("not ground")
            this.grounded = false;
            // this.player.body.position = this.player.body.position.add(this.gravity);
        }

        if (this.gravity.y < -PlayerController.JUMP_FORCE) {
            this.gravity.y = -PlayerController.JUMP_FORCE;
        }

        if (this.gravity.y < 0 && this.isJumping) { //todo: play a falling anim if not grounded BUT not on a slope
            this.isFalling = true;
        }
        this.player.body.moveWithCollisions(this.moveDirection.addInPlace(this.gravity));
        // this.player.body.moveWithCollisions(this.player.body.position.addInPlace(this.gravity).subtractInPlace(Vector3.Up().scale(PlayerController.PLAYER_SPEED * this.deltaTime)));
        //  this.player.body.moveWithCollisions(this.player.body.frontVector.addInPlace(this.gravity));

        /* if (this.isGrounded()) {
            this.gravity.y = 0;
            console.log("ground")
            // this.lastGroundPos.copyFrom(this.player.body.position);
            this.grounded = true;
            this.jumpCount = 1;
            this.isJumping=false
            this.isFalling= false;

            if (this.player.body.intersectsMesh(this.lastPlatform, true)) {
                const vel = this.lastPlatform.position.subtract(this.lastPlatform.metadata.lastPosition)
                this.player.body.position.addInPlace(vel)
                this.win = true
            }
            this.lastPlatform.metadata.lastPosition = this.lastPlatform.position.clone()
        } */

        if (this.isGrounded()) {
            this.gravity.y = 0;
            console.log("ground")
            this.grounded = true;
            this.jumpCount = 1;
            this.isJumping = false;
            this.isFalling = false;

            // Controlla se il player interseca la piattaforma
            if (this.player.body.intersectsMesh(this.lastPlatform, true)) {
                // Sposta il player leggermente verso l'alto
                this.player.body.position.y += 0.1; // Regola il valore in base alle tue esigenze
            }

            this.lastPlatform.metadata.lastPosition = this.lastPlatform.position.clone()
        }


        //Jump detection
        if(this.input.jumpKeyDown && this.jumpCount > 0 ) {
            console.log(this.jumpCount)
            this.gravity.y = PlayerController.JUMP_FORCE;
            this.jumpCount--;
            this.isJumping= true;
            this.isFalling= false;
            this.player.body.position.y += PlayerController.JUMP_FORCE;
        }
    }

    managePoint(){
        this.player.body.actionManager = new ActionManager(this.scene);
    }

    beforeRenderUpdate(){
        this.updateFromControl();
        this.updateGroundDetection()
    }

    activatePlayerCamera(){
        this.beforeLoop= ()=>{
            this.beforeRenderUpdate();
        }
        return this.camera;
    }

    reset(initialPlatform){
        this.player.body.position = initialPlatform.position.clone().add(new Vector3(0, 2, 0));
        this.player.body.rotationQuaternion = new Quaternion();
        // Reset any other properties you need to, like pointFind and win
        this.pointFind = 0;
        this.win = false;
    }

    setupPlayerCamera(){

        this.camera = new FollowCamera("third_person",new Vector3(10,0,10), this.scene);
        this.camera.heightOffset= 1;
        this.camera.rotationOffset = 180;
        this.camera.cameraAcceleration = .1;
        this.camera.maxCameraSpeed = 1;
        this.camera.lockedTarget = (this.player.character);
        this.scene.activeCamera = this.camera;
        // this.camera.detachControl()
        this.camera.attachControl()

        return this.camera;
    }
}

export default PlayerController;
