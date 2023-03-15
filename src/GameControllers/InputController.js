import GameObject from "./GameObject";
import {ActionManager, ExecuteCodeAction, Scalar} from "@babylonjs/core";

class InputController extends GameObject{
    constructor() {
        super();
        this.scene.actionManager = new ActionManager(this.scene);
        this.inputMap = {};

        //Register the action
        this.scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyDownTrigger,(event)=>{
                this.inputMap[event.sourceEvent.key]= event.sourceEvent.type == "keydown";
            }));
        this.scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyUpTrigger,(event)=>{
                this.inputMap[event.sourceEvent.key]=event.sourceEvent.type == "keydown";
            }));
        this.scene.onAfterRenderObservable.add(()=>{
            this.updateFromKeyboard();
        })
    }

    updateFromKeyboard(){
        if (this.inputMap["a"]) {
            this.horizontal = Scalar.Lerp(this.horizontal, -1, 0.2);
            this.horizontalAxis = -1;
        } else if (this.inputMap["d"]) {
            this.horizontal = Scalar.Lerp(this.horizontal, 1, 0.2);
            this.horizontalAxis = 1;
        }
        else {
            this.horizontal = 0;
            this.horizontalAxis = 0;
        }

        if (this.inputMap["w"]) {
            this.vertical = Scalar.Lerp(this.vertical, 1, 0.2);
            this.verticalAxis = 1;
        } else if (this.inputMap["s"]) {
            this.vertical = Scalar.Lerp(this.vertical, -1, 0.2);
            this.verticalAxis = -1;
        } else {
            this.vertical = 0;
            this.verticalAxis = 0;
        }

        //Jump Checks (SPACE)
        if (this.inputMap[" "]) {
            this.jumpKeyDown = true;
        } else {
            this.jumpKeyDown = false;
        }
    }
}

export default InputController;
