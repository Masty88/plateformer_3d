import GameObject from "./GameObject";
import {Color3, GlowLayer, StandardMaterial, Animation} from "@babylonjs/core";

class MaterialController extends GameObject{
    constructor() {
        super();
        this.setGlow();
    }

    setGlow(){
        this.glowLayer = new GlowLayer("plateformGlow",this.scene)
        this.glowLayer.intensity = 0.4;

        this.scene.meshes.forEach((mesh)=>{
            if(mesh.name ==="player"){
                const material = new StandardMaterial("playerMat", this.scene);
                material.diffuseColor = new Color3(1, 1, 1); // set to purple
                material.emissiveColor = new Color3(1, 1, 1); // set to purple
                material.specularColor = new Color3(1, 1, 1); // no specular highlights
                mesh.material = material;
                this.glowLayer.addIncludedOnlyMesh(mesh);
            }
            if(mesh.name.includes("platform")){
                const material = new StandardMaterial("platformMat", this.scene);
                let randomColor;
                let colorAssigned = true;
                while (colorAssigned) {
                    randomColor = new Color3(Math.random(), Math.random(), Math.random());
                    // Check if another platform has already been assigned the same color or if the color is white
                    if (!this.scene.meshes.some((otherMesh) => otherMesh.name.includes("platform") && otherMesh.material?.diffuseColor.equals(randomColor)) && !randomColor.equals(Color3.White())) {
                        colorAssigned = false;
                    }
                }
                material.diffuseColor = randomColor;
                material.emissiveColor = randomColor;
                material.specularColor = new Color3(0, 0, 0);
                mesh.material = material;
                this.glowLayer.addIncludedOnlyMesh(mesh);
            }
            if(mesh.name.includes("point")){
                // Create a new material with emissive color set to green
                const material = new StandardMaterial("pointMat", this.scene);
                material.diffuseColor = new Color3(0, 0, 0);
                material.emissiveColor = new Color3(0, 1, 0); // set to green
                material.specularColor = new Color3(0, 0, 0);
                mesh.material = material;
                // Create a new animation to make the mesh's emissive color flash
                const animation = new Animation("flash", "material.emissiveColor", 30, Animation.ANIMATIONTYPE_COLOR3, Animation.ANIMATIONLOOPMODE_CYCLE);
                // Define the animation keyframes
                const keys = [{ frame: 0, value: new Color3(0, 1, 0) }, { frame: 30, value: new Color3(0.5, 1, 0.5) }, { frame: 60, value: new Color3(0, 1, 0) }];
                // Set the animation keys
                animation.setKeys(keys);
                // Attach the animation to the mesh
                mesh.animations.push(animation);
                // Start the animation
                this.scene.beginAnimation(mesh, 0, 60, true);
                // Add the mesh to the glow layer
                this.glowLayer.addIncludedOnlyMesh(mesh);
            }
        })
    }
}

export default MaterialController;
