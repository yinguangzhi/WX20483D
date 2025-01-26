
import { _decorator, Component, Node, Texture2D, Vec3, resources, tween, randomRangeInt, CCInteger, MeshRenderer, AudioClip, AudioSource, Game, Enum, Prefab, ParticleSystem, v3 } from 'cc';
import { GameObjPool } from './GameObjPool';
import { DataManager } from './tools/DataManager';
import { UIControl } from './UIControl';
import { Unit } from './Unit';
// const GameConfig = require("./GameConfig");
import GameConfig from "./GameConfig.js";
import UIHelper from "./tools/UIHelper.js";
import { GameStatus } from './tools/GameStatus';
import { PermanentManager } from './PermanentManager';
import { RoadControl } from './RoadControl';
import { GameParamsHelper } from './GameParamsHelper';
import { AUDIO_NAME, AudioMgr } from './tools/AudioMgr';
import { WebBridge } from './WebBridge';
import { WeChatTool } from './WeChatTool';

const { ccclass, property } = _decorator;

// Enum
class TextureAbout {

    public value: number;
    public name: string;
    public texture: Texture2D;
    constructor(_value: number, _name: string, _texture: Texture2D) {
        this.value = _value;
        this.name = _name;
        this.texture = _texture;
    }
}

@ccclass('GameControl')
export class GameControl extends Component {

    public static Instance: GameControl = null;

    public static id: number = 1;
    public isBegin = false;
    public isGameOver = false;
    public isRealGameOver = false;
    // public Camera renderCamera;
    // public RenderTexture rendertex;
    // public Texture2D shortcutTexture;
    power = 1560;
    coolDown = false;
    curUnit: Node;
    unitName: string = "unit";
    virtualLinePos: Vec3 = new Vec3(0, 0, 0);

    @property(Node)
    public virtualLine: Node;
    @property(Node)
    public basePoint: Node;
    @property(Node)
    public unitParent: Node;
    @property(Node)
    public unitPrefab: Node;
    @property(Prefab)
    public effectPrefab: Prefab;
    // @property(Prefab)
    // public boomEffectPrefab: Prefab;
    @property(Node)
    public touch: Node;

    @property(Node)
    public directorNode: Node;

    @property(Texture2D)
    anyTexture: Texture2D = null;
    
    @property(Texture2D)
    bombTexture: Texture2D = null;

    @property(Texture2D)
    textures: Array<Texture2D> = [];

    private bombList: Array<Unit> = [];

    textureAbouts: Array<TextureAbout> = [];
    maxValue: number = 2;
    topValue: number = 2;

    unitList: Array<Unit> = [];
    boardData = null;

    recordTime = 0;

    onLoad() {
        GameControl.Instance = this;


        this.loadMusic();
        

        this.boardData = DataManager.Instance().readBoard("classic");

        console.log(DataManager.Instance().userData);
        
        if (DataManager.Instance().userData.first == 0) { 
            
            console.log("set default");
            
            DataManager.Instance().saveUserData("first",1,false);
            this.boardData = { score: 0, max: 2, list: GameConfig.defaultCubeConfig[0] };
            console.log(this.boardData);
            
        }
        
    }

    start() {
        GameObjPool.Instance().registerPool("unit", this.unitPrefab);
        GameObjPool.Instance().registerPool("effect", this.effectPrefab);
        // GameObjPool.Instance().registerPool("boomEffect", this.boomEffectPrefab);

        this.topValue = GameParamsHelper.Instance().maxValue;
        this.virtualLinePos = this.virtualLine.position;
        this.virtualLine.position = new Vec3(-10000, 0, 0);

        
        GameConfig.generateTextureAbouts(GameParamsHelper.Instance().textures);


        this.touch.on(Node.EventType.TOUCH_CANCEL, this.touchEnd, this);
        this.touch.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.touch.on(Node.EventType.TOUCH_END, this.touchEnd, this);

        this.restart();

        // let scene = UIHelper.getUI("SceneControl");
        // if (scene) scene.getComponent("SceneControl").setFast(false);
        PermanentManager.instance.setSceneLoadState(false, "", false);
    }

    update(deltaTime: number) {
        
        if (this.bombList.length > 0) { 
            this.displayBombEffect();
        }

        if (!this.coolDown && this.curUnit != null && !this.isRealGameOver) {
            this.virtualLine.position = new Vec3(this.curUnit.position.x, this.virtualLinePos.y, this.virtualLinePos.z);
        }
        if (!this.isRealGameOver) {
            this.recordTime -= deltaTime;
            if (this.recordTime < 0) {
                this.recordTime = 5;
                this.saveBoard();
            }
        }
    }

    restart() {

        this.isBegin = false;
        this.isGameOver = false;
        this.isRealGameOver = false;
        GameParamsHelper.Instance().bindCount = 0;
        
        GameParamsHelper.Instance().isBinding = false;

        this.maxValue = 2;
        GameConfig.refreshProbability(this.maxValue);

        this.refreshScore(0, true);

        this.generateLayout();

        this.recordTime = 10;

        UIControl.Instance.setStartState(true);
    }

    generateLayout() {
        if (this.boardData &&
            this.boardData.list &&
            this.boardData.list instanceof Array &&
            this.boardData.list.length != 0) {

            this.maxValue = this.boardData.max || 2;
            GameConfig.refreshProbability(this.maxValue);
            console.log(this.maxValue);


            this.refreshScore(this.boardData.score, true);

            for (let i = 0; i < this.boardData.list.length; i++) {

                let _data = this.boardData.list[i];
                let _note: Node = this.getNote();


                _note.position = new Vec3(_data.x, _data.y, _data.z);
                _note.eulerAngles = new Vec3(_data.angleX, _data.angleY, _data.angleZ);

                _note.getComponent(Unit).UnitID = GameControl.id;
                _note.getComponent(Unit).setCompleteData(_data.value);
            }
        }

        
        RoadControl.Instance.generateLayout(this.maxValue);
       
        this.createUnit(GameStatus.CubeType.Normal);
    }

    reCreatUnit(type)
    {

        if(type == 1)
        {
            //任意块
        }
        else if(type == 2)
        {
            //爆炸块
        }
    }

    createUnit(type : GameStatus.CubeType) {
        //coolDown = false;
        if(type == GameStatus.CubeType.Normal)
        {
            if(this.curUnit) return;
        }
        else
        {
            if(this.curUnit)
            {
                this.restoreNote(this.curUnit.getComponent(Unit));
                this.curUnit = null;
            }
        }

        this.curUnit = this.getNote();

        this.curUnit.scale = Vec3.ZERO;
        tween(this.curUnit).to(0.16, { scale: Vec3.ONE }).start();
        
        this.virtualLine.scale = new Vec3(0, 1, 1);
        this.virtualLine.position = new Vec3(this.curUnit.position.x, this.virtualLinePos.y, this.virtualLinePos.z);
        let endpos = new Vec3(this.curUnit.position.x, this.virtualLinePos.y, this.virtualLinePos.z);
        
        tween(this.virtualLine).delay(0.16).to(0.12, { scale: new Vec3(1, 1, 1) }).start();
        tween(this.virtualLine).delay(0.16).to(0.12, { position: endpos }).call(() => {
            this.coolDown = false;
        }).start();

        this.curUnit.getComponent(Unit).UnitID = GameControl.id;
        this.curUnit.getComponent(Unit).setData(this.getRandomValue(),false,type);
    }

    getConnectUnit(unit: Unit) {
        let find: Unit = null;
        let distance = 1000000;
        for (let i = 0; i < this.unitList.length; i++) {
            // console.log(this.unitList[i].id,"  ", this.unitList[i].isFree,"  ",this.unitList[i].isCouldDead(),"   ",this.unitList[i] != unit,"  ",this.unitList[i].value ,"  ", unit.value);
          
            if (this.unitList[i] &&
                this.unitList[i].isLife() &&
                this.unitList[i] != unit &&
                this.unitList[i].value == unit.value) {
                let _dis = Vec3.distance(this.unitList[i].node.position, unit.node.position);
                if (_dis < distance) {
                    distance = _dis;
                    find = this.unitList[i];
                }
            }
            
        }
        return find;
    }

    getNote() {

        let note = GameObjPool.Instance().get(this.unitName);
        note.setParent(this.unitParent);
        note.active = true;
        note.eulerAngles = new Vec3(0, 180, 0);
        note.position = this.basePoint.position;

        GameControl.id++;

        this.unitList.push(note.getComponent(Unit));

        return note;
    }

    restoreNote(unit) {

        let _idx = this.unitList.indexOf(unit);
        if (_idx != -1) this.unitList.splice(_idx, 1);

        GameObjPool.Instance().put("unit", unit.node);
    }

    constIndex = 0;
    getRandomValue() {
        let index = randomRangeInt(0, GameConfig.probabilityList.length);
        this.constIndex++;

        return GameConfig.probabilityList[index];
    }

    setSkin(go: Node, value: number,type : GameStatus.CubeType) {
        if (value > this.maxValue) this.maxValue = value;
        if (value > this.topValue) value = this.topValue;

        let ta = GameConfig.getTextureAbout(value, true);
        let tex = ta.texture;

        if (type == GameStatus.CubeType.Any) { 
            tex = this.anyTexture;
        }
        if (type == GameStatus.CubeType.Bomb) { 
            tex = this.bombTexture;
        }

        go.getComponent(MeshRenderer).materials[0].setProperty("albedoMap", tex);
    }

    addToBomb(unit_bomb: Unit, unit_normal: Unit) {

        if (this.bombList.length != 0) return;

        this.bombList.push(unit_bomb);
        this.bombList.push(unit_normal);
    }
    
    displayBombEffect() { 
        
        if (this.bombList.length == 0) return;

        let obj = this.bombList[0].node;

        let list = this.bombList.slice();
        for (let i = 0; i < list.length; i++) { 
            list[i].Hide();
        }
        this.bombList.length = 0;

        // let effect = GameObjPool.Instance().get("boomEffect");
        // effect.parent = this.unitParent;
        // effect.position = obj.position;

        // let temps = effect.getComponentsInChildren(ParticleSystem);
        // for (let i = 0; i < temps.length; i++) { 
        //     temps[i].clear();
            
        //     temps[i].stop();
        //     temps[i].play();
        // }

        // temps = effect.getComponentsInChildren(Animation);
        // for (let i = 0; i < temps.length; i++) { 
        //     temps[i].play();
        // }

        // this.scheduleOnce(() => { 
        //     GameObjPool.Instance().put("boomEffect",effect);
        // },0.8)
    }

    score: 0;
    public refreshScore(value : number, clear : boolean) {
        
        if (isNaN(value)) value = 0;

        if (clear) this.score = 0;
        else this.checkMaxValue(value);

        this.score += value;


        UIControl.Instance.refreshScore(value, clear);
    }

    public checkMaxValue(value) {

        if (value > this.maxValue) {

            this.maxValue = value;
            GameConfig.refreshProbability(this.maxValue);

            RoadControl.Instance.refresh(value);
            
            console.log(value, "  ", GameParamsHelper.Instance().baseMaxValue);
            
            if (!this.isGameOver && value >= GameParamsHelper.Instance().baseMaxValue) { 

                DataManager.Instance().saveUserData("bestSQScore", value, false);

                this.popBind(value);
            }
            
        }
        else if (!this.isGameOver) {
            let half = false;
            if (value >= 8192) { 

                half = (value == this.maxValue) || (value == this.maxValue / 2) || (value == this.maxValue / 4) || value == Math.pow(2, 16) 
            }
            
            let _reward = (value == 512 || value == 1024);

            if (half || _reward) { 
                
                if(WeChatTool.Instance().isFullMaxDelta()) this.popBind(value);
            }
        }
        
    }

    popBind(value) {

        if (GameParamsHelper.Instance().isBinding) return;
        
        GameParamsHelper.Instance().isBinding = true;

        if (value >= 64) { 
    
            WebBridge.Instance().loadFull();
            WebBridge.Instance().loadVideo();
        }
        

        this.scheduleOnce(() => { 

            if (this.isGameOver) return;

            PermanentManager.instance.setLoadingState(true,"bind");

            UIHelper.displayUI(UIHelper.uiType.panel1, "UIBind", UIControl.Instance.node, true, (obj) => {

                PermanentManager.instance.setLoadingState(false,"bind");

                obj.getComponent("UIBind").setData(value, (state) => {

                    if (value >= 512 && !GameParamsHelper.Instance().shortcutChecked) { 

                        GameParamsHelper.Instance().shortcutChecked = true;
                    }

                });
            });
        },1);
    }
    
    public GameOverAction() {

        if (this.isGameOver) return;
        this.isGameOver = true;

        UIHelper.hideUI("UIBind");
        
        console.log("game is over");

        WebBridge.Instance().loadVideo();
        
        PermanentManager.instance.setLoadingState(true,"gameOver");
        this.scheduleOnce(() => {

            UIHelper.hideUI("UIBind");

            UIHelper.displayUI(UIHelper.uiType.panel1, "UIRelive", UIControl.Instance.node, true, (obj) => {

                PermanentManager.instance.setLoadingState(false,"gameOver");

                obj.getComponent("UIRelive").setData((state) => {

                    this.ReliveResult(state);
                });
            });

        }, 0)
    }
    public ReliveResult(state) {

        GameParamsHelper.Instance().isBinding = false;
        
        let list = [];
        list = list.concat(GameObjPool.Instance().getUsingList("unit"));

        for (let i = 0; i < list.length; i++) {
            let un = list[i].getComponent(Unit);

            if (state) {

                if (un.couldRevive() && this.curUnit != list[i]) un.Hide();
            }
            else {
                un.Hide();
            }
        }

        if (state) {
            this.isGameOver = false;
        }
        else {
            DataManager.Instance().saveUserData("bestScore", this.score, false);

            this.clearBoard();
            this.curUnit = null;
            

            this.isRealGameOver = true;

            WebBridge.Instance().loadVideo();
            
            PermanentManager.instance.setLoadingState(true,"settlement");
            UIHelper.displayUI(UIHelper.uiType.panel1, "UISettlement", UIControl.Instance.node, true, (obj) => {

                PermanentManager.instance.setLoadingState(false,"settlement");

                obj.getComponent("UISettlement").setData(this.score, this.maxValue, (state) => {

                    this.restart();
                });
            });
        }
    }

    @property(AudioSource)
    public audioSource: AudioSource;

    @property(AudioSource)
    public bgmSource: AudioSource;

    /**
     * name
     */
    public loadMusic() {
        
        AudioMgr.Instance().loadAudio(AUDIO_NAME.shootAudio.string);
        
        for (let i = 0; i < 5; i++)
        {
            let _index = i + 1;
            this.scheduleOnce(() => { 

                AudioMgr.Instance().loadAudio(AUDIO_NAME.bindAudio.string + _index);
                
            }, _index * 0.6);
            
        }
        
        this.scheduleOnce(() => { 

            AudioMgr.Instance().playMusic(AUDIO_NAME.music);
        },9);
    }

    public touchEnd(event) {
        if (this.curUnit == null || this.coolDown || this.isGameOver) return;

        if (!this.isBegin) UIControl.Instance.beginAction();
        AudioMgr.Instance().playAudio(AUDIO_NAME.shootAudio);

        this.isBegin = true;

        this.coolDown = true;
        this.virtualLine.position = new Vec3(-10000, 0, 0);
        this.curUnit.getComponent(Unit).MoveForward(this.power);
        this.curUnit = null;
        this.scheduleOnce(() => {
            this.createUnit(GameStatus.CubeType.Normal);
        }, 0.2)
    }

    public touchMove(event) {
        if (this.curUnit == null || this.coolDown || this.isGameOver) return;

        // console.log(event);

        let delta = event.touch.getDelta().x * 0.012;
        if (this.curUnit.position.x + delta > 2.25 || this.curUnit.position.x + delta < -2.25) return;

        this.curUnit.position = this.curUnit.position.add(new Vec3(delta, 0, 0));
    }

    clearBoard() {
        let _boardData = { score: 0, list: [] };

        DataManager.Instance().saveBoard("classic", _boardData);
        this.boardData = _boardData;
    }

    saveBoard() {

        let couldRecord = true;

        let saves = [];

        for (let i = 0; i < this.unitList.length; i++) {

            if (!this.unitList[i]) continue;

            let _unit = this.unitList[i];
            if (_unit.isLife()) {

                if (!_unit.isCouldRecord()) {
                    couldRecord = false;
                    break;
                }

                let pos = _unit.node.position;
                saves.push({
                    value: _unit.value,
                    x: pos.x,
                    y: pos.y,
                    z: pos.z,
                    angleX: _unit.node.eulerAngles.x,
                    angleY: _unit.node.eulerAngles.y,
                    angleZ: _unit.node.eulerAngles.z,
                });
            }
        }

        if (!couldRecord) return;

        console.log(saves.length);
        
        if (saves.length != 0) {
            let _boardData = { score: this.score, max: this.maxValue, list: saves };
            DataManager.Instance().saveBoard("classic", _boardData);
        }
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
