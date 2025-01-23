
import { _decorator, Component, Node, Label, Vec3, tween, MeshRenderer } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = UISettlement
 * DateTime = Sun Jul 24 2022 20:01:41 GMT+0800 (中国标准时间)
 * Author = yinhuan
 * FileBasename = UISettlement.ts
 * FileBasenameNoExtension = UISettlement
 * URL = db://assets/scripts/UISettlement.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

import Observer from "./tools/Observer.js";
import UIHelper from "./tools/UIHelper.js";
import GameConfig from "./GameConfig.js";
import { PermanentManager } from './PermanentManager';
import { ALHelper } from './tools/ALHelper';
import { AUDIO_NAME, AudioMgr } from './tools/AudioMgr';

@ccclass('UISettlement')
export class UISettlement extends Component {

    @property(Node)
    parentNode: Node = null;

    @property(Node)
    shareNode: Node = null;

    @property(Label)
    scoreLabel: Label = null;

    @property(Node)
    cube: Node = null;

    @property(Node)
    light: Node = null;

    score: Number = 0;
    sqscore: Number = 0;


    start() {
        this.parentNode.scale = new Vec3(0, 0, 0);
       
        tween(this.parentNode)
            .to(0.22, { scale: new Vec3(1.2, 1.2, 1.2) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start()


        this.scheduleOnce(() => {

            ALHelper.Instance().initVideoADBefore(true);
            PermanentManager.instance.displayBannerInCommon();
        }, 0.4)
    }

    update (deltaTime: number) {
        // [4]
        this.light.angle -= 80 * deltaTime;
    }

    callback = null;
    setData(score, sqscore, callback) {
        this.score = score;
        this.sqscore = sqscore;
        this.callback = callback;

        this.scoreLabel.string = this.score.toString();

        let ta = GameConfig.getTextureAbout(sqscore, true);

        this.cube.getComponent(MeshRenderer).materials[0].setProperty("albedoMap", ta.texture);

        this.cube.scale = new Vec3(0, 0, 0);
        tween(this.cube).to(0.32, { scale: new Vec3(0.6, 0.6, 0.6) }).start();
    }

    againAction() {

        AudioMgr.Instance().playAudio(AUDIO_NAME.click);

        if (!Observer.fireBtn("settlement", 500)) return;

        PermanentManager.instance.displayFullInCommon(() => { 

            this.callback && this.callback(true);
            
            UIHelper.hideUI("UISettlement");
            
        });
    }

    shareAction() {

        AudioMgr.Instance().playAudio(AUDIO_NAME.click);
        if (!Observer.fireBtn("settlement", 500)) return;
        ALHelper.Instance().updateToPlatform("", null, null);
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
