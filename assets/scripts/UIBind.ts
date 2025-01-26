
import { _decorator, Component, Node, Vec3, tween, TiledUserNodeData, Sprite, Label, isValid, Tween, MeshRenderer, Animation, Layers, UIOpacity, v3 } from 'cc';
import { GameControl } from './GameControl';
const { ccclass, property } = _decorator;

import Observer from "./tools/Observer.js";
import UIHelper from "./tools/UIHelper.js";
import GameConfig from "./GameConfig.js";
import { PermanentManager } from './PermanentManager';
import { DataManager } from './tools/DataManager';
import { UIControl } from './UIControl';
import { GameParamsHelper } from './GameParamsHelper';
import { AUDIO_NAME, AudioMgr } from './tools/AudioMgr';
import GameUtility from './tools/GameUtility';
import { WebBridge } from './WebBridge';

/**
 * Predefined variables
 * Name = UIBind
 * DateTime = Sun Jul 24 2022 22:55:49 GMT+0800 (中国标准时间)
 * Author = yinhuan
 * FileBasename = UIBind.ts
 * FileBasenameNoExtension = UIBind
 * URL = db://assets/scripts/UIBind.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('UIBind')
export class UIBind extends Component {

    @property(Node)
    parentNode: Node = null;

    @property(Node)
    cube: Node = null;

    @property(Node)
    skipNode: Node = null;

    @property(Node)
    light: Node = null;

    @property(Node)
    confirmNode: Node = null;

    @property(Node)
    propUI: Node = null;

    @property(Node)
    descUI: Node = null;

    @property(Label)
    descLabel: Label = null;

    @property(UIOpacity)
    lightOpacity: UIOpacity = null;

    @property(Node)
    anyNode: Node = null;

    couldClick = false;

    //0: 默认    1：奖励万能块       2 ：奖励鸡汤话
    bindType = 0;
    couldGetAny = false;

    start() {
        
        this.scheduleOnce(() => {
            WebBridge.Instance().showBanner();
        }, 0.4)
    }

    update (deltaTime: number) {
        // [4]
        this.light.angle -= 80 * deltaTime;
    }

    callback = null;
    setData(score, callback) {

        this.callback = callback;
        this.couldClick = false;
        this.bindType = 0;

        if (score <= 1024) {
            this.bindType = 1;
            // if (GameParamsHelper.Instance().bindCount % 2 == 0) this.bindType = 1;
            // GameParamsHelper.Instance().bindCount++;
            
        }
        else { 
            this.bindType = 2;
        }
        

        if (this.propUI) this.propUI.active = this.bindType == 1;
        if (this.descUI) this.descUI.active = this.bindType == 2;
        this.confirmNode.active = this.bindType == 0;;

        if (this.bindType == 2) { 
            if (this.descLabel) this.descLabel.string = GameConfig.getDescFromValue(score);
        }

        let ta = GameConfig.getTextureAbout(score, true);

        this.cube.getComponent(MeshRenderer).materials[0].setProperty("albedoMap", ta.texture);

        this.lightOpacity.opacity = 0;
        this.cube.scale = new Vec3(0, 0, 0);
        tween(this.cube).to(0.4, { scale: new Vec3(0.66, 0.66, 0.66) }).start();

        this.scheduleOnce(() => {
            this.cube.getComponent(Animation).play();
    
            tween(this.lightOpacity).to(0.3, { opacity: 255}).start();
            
        }, 0.4);

        this.scheduleOnce(() => {
            this.couldClick = true;
        }, 1);

        
        this.skipNode.active = false;
        this.scheduleOnce(() => { 
            if (!isValid(this)) return;
            
            this.skipNode.active = true;
        },2)


    }
    confirmAction() {

        if (!this.couldClick) return;

        AudioMgr.Instance().playAudio(AUDIO_NAME.click);

        if (!Observer.fireBtn("ad", 500)) return;

        WebBridge.Instance().displayFull("",false,() => { 

            if (this.bindType == 1) { 

                DataManager.Instance().saveUserData("classicAnyCnt", 1, false);
                UIControl.Instance.displayAddAnyEffect(this.anyNode, 1);
            }
            
            this.callback && this.callback(true);
            UIHelper.hideUI("UIBind");
        });
    }

    adAction() {
        AudioMgr.Instance().playAudio(AUDIO_NAME.click);

        if (!Observer.fireBtn("ad", 500)) return;

        WebBridge.Instance().displayVideo("",true, (state) => {

            if (state) { 
                let count = 2;
                
                DataManager.Instance().saveUserData("classicAnyCnt", count, false);
                
                UIControl.Instance.displayAddAnyEffect(this.anyNode, 2);
                

                this.callback && this.callback(true);
                
                UIHelper.hideUI("UIBind");
            }
            
        })
     }

    onDisable() {
        GameParamsHelper.Instance().isBinding = false;
     }
    
    cancel() {

        // AudioMgr.Instance().playAudio(AUDIO_NAME.click);
        // if (!Observer.fireBtn("relive", 500)) return;

        // if (this.callback) this.callback(false);
        // UIHelper.hideUI("UIBind");

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
