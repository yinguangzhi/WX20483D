
import { _decorator, Component, Node, tween, Vec3, UITransform, UIOpacity } from 'cc';
import { DataManager } from './tools/DataManager';
const { ccclass, property } = _decorator;

import Observer from "./tools/Observer.js";
import { AUDIO_NAME, AudioMgr } from './tools/AudioMgr';
/**
 * Predefined variables
 * Name = UIPause
 * DateTime = Sun Sep 18 2022 08:39:25 GMT+0800 (GMT+08:00)
 * Author = yinhuan
 * FileBasename = UIPause.ts
 * FileBasenameNoExtension = UIPause
 * URL = db://assets/scripts/UIPause.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('UIPause')
export class UIPause extends Component {
    
    @property(Node)
    public audioNode: Node = null;
    @property(Node)
    public musicNode: Node = null;

    @property(Node)
    public vibrateNode: Node = null;

    @property(UITransform)
    public setting: UITransform = null;

    settingState = true;
    isTween = false;

    start () {
        // [3]

        this.setVibrateState(DataManager.Instance().userData.vibrate == 1);
        this.setAudioState(DataManager.Instance().userData.audio == 1);
        this.setMusicState(DataManager.Instance().userData.music == 1);

        this.display(0.01);
    }

    settingAction() { 
        
        AudioMgr.Instance().playAudio(AUDIO_NAME.click);

        if (!Observer.fireBtn("setting", 500)) return;

        this.display(0.25);
    }

    display(_time : number) {
        this.settingState = !this.settingState;
        this.isTween = true;

        let _height = this.settingState ? 360 : 69;
        tween(this.setting).to(_time, { height: _height }).call(() => { 
            this.isTween = false;
        }).start();

        //-130,-34
        let _y = this.settingState ? -130 : -34;
        tween(this.musicNode).to(_time, { position: new Vec3(0,_y,0) }).start();
        
        let uiopacity: UIOpacity = this.musicNode.getComponent(UIOpacity);
        let _arg = this.settingState ? 255 : 0;
        tween(uiopacity).to(_time, { opacity: _arg }).start();


        //-210,-34
        _y = this.settingState ? -210 : -34;
        tween(this.audioNode).to(_time, { position: new Vec3(0, _y, 0) }).start();
        
        uiopacity = this.audioNode.getComponent(UIOpacity);
        _arg = this.settingState ? 255 : 0;
        tween(uiopacity).to(_time, { opacity: _arg }).start();

        
        //-290,-34
        _y = this.settingState ? -290 : -34;
        tween(this.vibrateNode).to(_time, { position: new Vec3(0, _y, 0) }).start();
        
        uiopacity = this.vibrateNode.getComponent(UIOpacity);
        _arg = this.settingState ? 255 : 0;
        tween(uiopacity).to(_time, { opacity: _arg }).start();
    }
    
    audioAction() {

        if (!this.settingState) return;
        if (this.isTween) return;

        let state = DataManager.Instance().userData.audio;
        state = state == 1 ? 0 : 1;
        DataManager.Instance().saveUserData('audio', state,false);

        this.setAudioState(state == 1);

        AudioMgr.Instance().setAudioState(DataManager.Instance().userData.audio == 1);
        AudioMgr.Instance().playAudio(AUDIO_NAME.click);
    }

    setAudioState(bool) {
        this.audioNode.children[0].active = !bool;
        this.audioNode.children[1].active = bool;
    }

    musicAction() {

        if (!this.settingState) return;
        if (this.isTween) return;

        AudioMgr.Instance().playAudio(AUDIO_NAME.click);

        let state = DataManager.Instance().userData.music;
        state = state == 1 ? 0 : 1;
        DataManager.Instance().saveUserData('music', state,false);

        this.setMusicState(state == 1);

        AudioMgr.Instance().setMusicState(DataManager.Instance().userData.music == 1, true);
    }

    setMusicState(bool : boolean) {
        this.musicNode.children[0].active = !bool;
        this.musicNode.children[1].active = bool;
    }

    vibrateAction() {

        if (!this.settingState) return;
        if (this.isTween) return;

        AudioMgr.Instance().playAudio(AUDIO_NAME.click);

        let state = DataManager.Instance().userData.vibrate;
        state = state == 1 ? 0 : 1;
        DataManager.Instance().saveUserData('vibrate', state,false);

        this.setVibrateState(state == 1);
    }

    setVibrateState(bool) {
        if (!this.vibrateNode) return;

        this.vibrateNode.children[0].active = !bool;
        this.vibrateNode.children[1].active = bool;
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
