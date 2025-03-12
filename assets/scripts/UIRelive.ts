
import { _decorator, Component, Node, Vec3, tween, TiledUserNodeData, Sprite, Label, isValid, Tween } from 'cc';
import { GameControl } from './GameControl';
const { ccclass, property } = _decorator;

import Observer from "./tools/Observer.js";
import UIHelper from "./tools/UIHelper.js";
import { PermanentManager } from './PermanentManager';
import { AUDIO_NAME, AudioMgr } from './tools/AudioMgr';
import { WebBridge } from './WebBridge';
import { UR } from './UR';
/**
 * Predefined variables
 * Name = UIRelive
 * DateTime = Mon Jul 04 2022 08:45:43 GMT+0800 (中国标准时间)
 * Author = yinhuan
 * FileBasename = UIRelive.ts
 * FileBasenameNoExtension = UIRelive
 * URL = db://assets/scripts/UIRelive.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('UIRelive')
export class UIRelive extends Component {

    @property(Node)
    parentNode: Node = null;

    @property(Sprite)
    progressForce: Sprite = null;

    @property(Node)
    skipNode: Node = null;

    @property(Label)
    coolDownLabel: Label = null;

    totalTime = 5;
    progressTween = null;

    onLoad() {
        this.skipNode.active = true;
    }

    start() {

        this.parentNode.scale = new Vec3(0, 0, 0);
        // this.parent.opacity = 255;
        tween(this.parentNode)
            .to(0.22, { scale: new Vec3(1.2, 1.2, 1.2) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start()


        this.scheduleOnce(() => {

            WebBridge.Instance().showBanner();
            
        }, 0.4)

        if (this.progressForce) {

            this.progressForce.fillRange = 1;
            this.progressTween = tween(this.progressForce)
                .to(5, { fillRange: 0 })
                .start();
        }

        this.totalTime = 5;
        if (this.coolDownLabel) this.coolDownLabel.string = this.totalTime.toString();

        this.schedule(this.coolDownAction, 1, 4, 1);
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    coolDownAction() {
        if (!isValid(this)) return;

        this.totalTime--;
        if (this.coolDownLabel) this.coolDownLabel.string = this.totalTime.toString();

        // if (this.totalTime == 3) {
        //     if (this.skipNode) this.skipNode.active = true;
        // }
    }

    callback = null;
    setData(callback) {
        this.callback = callback;
    }
    adAction() {

        AudioMgr.Instance().playAudio(AUDIO_NAME.click);

        if (!Observer.fireBtn("relive", 500)) return;

        this.unschedule(this.coolDownAction);
        if (this.progressTween) this.progressTween.stop();

        console.log("复活,广告")
        WebBridge.Instance().displayVideo("",true,(state) => {
            if (state) {

                if (this.callback) this.callback(true);
                // UIHelper.hideUI("UIRelive");
                UR.ins.close("UIRelive");
            }

        })

    }

    cancel() {

        AudioMgr.Instance().playAudio(AUDIO_NAME.click);
        if (!Observer.fireBtn("relive", 500)) return;

        this.unschedule(this.coolDownAction);
        if (this.progressTween) this.progressTween.stop();

        if (this.callback) this.callback(false);
        // UIHelper.hideUI("UIRelive");
        UR.ins.close("UIRelive");

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
