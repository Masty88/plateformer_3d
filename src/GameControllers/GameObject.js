class GameObject{
    static GameController;
    static Scene;
    static Engine;
    static Level;

    constructor() {
        this.gameController = GameObject.GameController;
        this.scene = GameObject.Scene;
        this.engine= GameObject.Engine;
        this.level = GameObject.Level

        const beforeLoop = () => this.beforeLoop();
        this.scene.registerBeforeRender(beforeLoop);
        this.unregisterBeforeLoop = () => this.scene.unregisterBeforeRender(beforeLoop);

        const afterLoop = () => this.afterLoop();
        this.scene.registerAfterRender(afterLoop);
        this.unregisterAfterLoop = () => this.scene.unregisterBeforeRender(afterLoop);
    }

    beforeLoop() {}

    afterLoop() {}

    remove() {
        if (this.unregisterBeforeLoop)
            this.unregisterBeforeLoop();

        if (this.unregisterAfterLoop)
            this.unregisterAfterLoop();
    }
}

export default GameObject;
