
import { _decorator, Component, Node, game, Label, UIOpacity, tween } from 'cc';
import { ScenePage } from './ScenePage';
import { UR } from './UR';

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PermanentManager
 * DateTime = Tue Aug 30 2022 11:46:08 GMT+0800 (GMT+08:00)
 * Author = yinhuan
 * FileBasename = PermanentManager.ts
 * FileBasenameNoExtension = PermanentManager
 * URL = db://assets/scripts/PermanentManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('PermanentManager')
export class PermanentManager extends Component {
    public static instance: PermanentManager = null!;

    @property(Label)
    public desc: Label;
    
    @property(ScenePage)
    public scenePage: ScenePage;

    @property(Node)
    public uiLoading: Node;



    @property(Label)
    public tipLabel: Label;
    @property(UIOpacity)
    public tipOpacity: UIOpacity;

    onLoad() {
        if (!PermanentManager.instance) {
            PermanentManager.instance = this;
        }
        game.addPersistRootNode(this.node);

        this.setLoadingState(false,"start");
        this.tipOpacity.opacity = 0;

        UR.ins.setFR(this.node);

    }
    start() {
        // [3]
    }

    update (deltaTime: number) {
        // console.log("in per : ", deltaTime);
    }

    protected onDestroy(): void {
        console.log("................permanent root is destroy.........................")
    }

    setSceneLoadState(state : boolean,_scene : string, _autoTranslate : boolean) {
        console.log(_scene);
        this.scenePage.setSceneLoadState(state,_scene,_autoTranslate);
    }
    
    setLoadingState(state : boolean,eventStr : string) {
        this.uiLoading.active = state;
        
        let cnt = this.node.children.length;
        this.uiLoading.setSiblingIndex(cnt);

        console.log(eventStr," : ",state);
        
    }

    isLoading() { 
        return this.uiLoading.active;
    }

    setADTip(value : string) { 
        this.tipLabel.string = value;

        this.tipOpacity.opacity = 0;
        tween(this.tipOpacity).to(0.3, { opacity: 255 }).delay(1).to(0.5, {opacity : 0}).start();
    }
    
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
