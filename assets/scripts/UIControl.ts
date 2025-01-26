/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-11 08:00:59
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2024-05-13 10:30:55
 * @FilePath: \Unity2048\assets\scripts\UIControl.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { _decorator, Component, Node, Label, v3, instantiate } from 'cc';
import { GameControl } from './GameControl';
import { DataManager } from './tools/DataManager';
import { GameStatus } from './tools/GameStatus';
const { ccclass, property } = _decorator;

import Observer from "./tools/Observer.js";
import { AUDIO_NAME, AudioMgr } from './tools/AudioMgr';
import GameUtility from './tools/GameUtility';
import { WebBridge } from './WebBridge';
/**
 * Predefined variables
 * Name = UIControl
 * DateTime = Sun May 15 2022 12:31:09 GMT+0800 (中国标准时间)
 * Author = yinhuan
 * FileBasename = UIControl.ts
 * FileBasenameNoExtension = UIControl
 * URL = db://assets/scripts/UIControl.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('UIControl')
export class UIControl extends Component {
    public static Instance: UIControl = null;

    @property(Label)
    public scoreText: Label;
    @property(Label)
    public bestText: Label;
    public score: number = 0;
    public bestScore = 0;
    @property(Node)
    public guideObj: Node = null;
    @property(Node)
    public startUI: Node = null;

    @property(Node)
    public anyNode: Node = null;

    @property(Node)
    public levelNodes: Node[] = [];

    suggestDelta = 0;

    onLoad() {
        console.log(".............. in game...................");
        UIControl.Instance = this;

        this.bestScore = DataManager.Instance().userData.bestScore;
        this.bestText.string = this.bestScore.toString();

    }
    // Start is called before the first frame update
    start() {
        this.refreshAnyCount();
        this.setStartState(true);
        this.guideObj.active = true;

        // GameUtility.flyItemAni(v3(), v3(300, 300, 0), this.node,1, this.anyNode, true);
        
    }

    // Update is called once per frame
    update(deltaTime: number) {
    }

    beginAction() {
    this.guideObj.active = false;

    }

    refreshScore(val, clear) {
        if (clear) this.score = 0;

        
        this.score += val;

        this.scoreText.string = this.score.toString();

        if (this.score > this.bestScore) {

            this.bestScore = this.score;
            this.bestText.string = this.bestScore.toString();
        }
    }

    refreshLevel(max: number, immediate: boolean) {

    }

    displayAddAnyEffect(_anyN : Node,_number : number)
    {
        let tPos = this.anyNode.position;
        let pos = GameUtility.convertPos(_anyN, this.anyNode.parent, v3());
        let cPos = GameUtility.addVec3(pos, tPos);
        cPos = v3(cPos.x * 0.5, cPos.y * 0.5 + 160, cPos.z);

        for (let i = 0; i < _number; i++)
        {
            let obj = instantiate(_anyN);
            obj.parent = this.anyNode.parent;
            obj.position = pos;
            obj.scale = v3(1.28, 1.28,1.28);
            this.scheduleOnce(() => {
                GameUtility.bezierTo(obj, 0.6, () => {

                    obj.destroy();

                    if (i == _number - 1) UIControl.Instance.refreshAnyCount();
                
                }, pos, cPos, tPos);
            },0.1 * i);
            
        }
        
    }

    refreshAnyCount() { 
        let count = DataManager.Instance().userData.classicAnyCnt;

        let tip = this.anyNode.getChildByName("tip");
        
        tip.active = count >= 1;
        tip.children[0].getComponent(Label).string = count + '';
        
        let mask = this.anyNode.getChildByName("mask");
        let ad = this.anyNode.getChildByName("AD");
        mask.active = count < 1;
        ad.active = count < 1;
    }

    anyAction()
    {
        
        AudioMgr.Instance().playAudio(AUDIO_NAME.click);
        if (!Observer.fireBtn("ad", 500)) return;

        let count = DataManager.Instance().userData.classicAnyCnt;
        if (count < 1) {
            AudioMgr.Instance().playAudio(AUDIO_NAME.mute);
            
            WebBridge.Instance().displayVideo("",true, (state) => {

                if (state) {
                    GameControl.Instance.createUnit(GameStatus.CubeType.Any);
                }
                
            })
        }
        else {
            GameControl.Instance.createUnit(GameStatus.CubeType.Any);

            DataManager.Instance().saveUserData("classicAnyCnt", -1, false);
            
            this.refreshAnyCount();
        }
    }

    bombAction()
    {
         AudioMgr.Instance().playAudio(AUDIO_NAME.click);
        if (!Observer.fireBtn("ad", 500)) return;

        AudioMgr.Instance().playAudio(AUDIO_NAME.mute);
        WebBridge.Instance().displayVideo("",true,(state : boolean) => { 

            if(state)  GameControl.Instance.createUnit(GameStatus.CubeType.Bomb);
        })
    }

    setStartState(state : boolean) {
        this.startUI.active = state;

     }
    startAction() { 

        AudioMgr.Instance().playAudio(AUDIO_NAME.click);
        
        if (!Observer.fireBtn("start", 500)) return;

        this.setStartState(false);
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
