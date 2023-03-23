import GameObject from "./GameObject";
import {AdvancedDynamicTexture, Control, Rectangle, TextBlock} from "@babylonjs/gui";

class GuiController extends GameObject{
    constructor(nmb) {
        super();
        this.playerGUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.nmb = nmb

        //Point Count
        const pointCnt = new TextBlock();
        pointCnt.name = "lantern count";
        pointCnt.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;
        pointCnt.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        pointCnt.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        pointCnt.fontSize =  "32px";
        pointCnt.color = "white";
        // pointCnt.text = `Pieces: 0 / ${this.nmb}`;
        pointCnt.left = "-5%";
        pointCnt.top = "5%"
        pointCnt.width = "25%";
        pointCnt.resizeToFit = true;
        this.playerGUI.addControl(pointCnt);
        this.pointCnt = pointCnt;

        //Winning Banner
        this.containerFull= new Rectangle();
        this.containerFull.width= "100%"
        this.containerFull.height= "100%";
        this.containerFull.background= "rgba(0,0,0,0.9)"
        this.playerGUI.addControl(this.containerFull);
        this.containerFull.notRenderable=true;

        this.textBlock= new TextBlock("win", "LEVEL COMPLETED!")
        this.textBlock.resizeToFit= true;
        this.textBlock.fontSize="45px"
        this.textBlock.paddingLeft="20px";
        this.textBlock.paddingRight="20px";
        this.textBlock.color = "white"
        this.textBlock.textHorizontalAlignment= Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.containerFull.addControl(this.textBlock);
    }

    updatePointCount(point){
        const pointCntText = "Pieces: " + point + ` / ${this.nmb}`;
        this.pointCnt.text = pointCntText;
    }

    showWin(){
        this.containerFull.notRenderable = false
    }
}

export default GuiController;
