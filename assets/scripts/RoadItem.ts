
import { _decorator, Component, Node, UIOpacity, tween, Vec3, Sprite, MeshRenderer, Color } from 'cc';
const { ccclass, property } = _decorator;

import GameConfig from "./GameConfig.js";
import { GameParamsHelper } from './GameParamsHelper';
/**
 * Predefined variables
 * Name = RoadItem
 * DateTime = Fri Sep 02 2022 08:59:26 GMT+0800 (GMT+08:00)
 * Author = yinhuan
 * FileBasename = RoadItem.ts
 * FileBasenameNoExtension = RoadItem
 * URL = db://assets/scripts/RoadItem.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('RoadItem')
export class RoadItem extends Component {
    
    @property(UIOpacity)
    public opacity: UIOpacity = null;

    @property(Node)
    public hightLight: Node = null;


    @property(Node)
    public geted: Node = null;

    @property(Node)
    cube: Node = null;

    @property(Sprite)
    public icon: Sprite = null;
    
    selected = false;
    realMax = 2;
    value = 2;
    index = 0;

    start () {
        // [3]
    }

    update() {
     }

    setData(value : number) { 
        this.value = value;

        // let ta = GameConfig.getFrameAbout(value, true);
        // this.icon.spriteFrame = ta.texture;

        let ta = GameConfig.getTextureAbout(value, true);
        this.cube.getComponent(MeshRenderer).materials[0].setProperty("albedoMap", ta.texture);
        
    }
    
    setSelect(value: number,realMax: number) { 
        // console.log(value," : ",this.value," : ",realMax," : ",GameParamsHelper.Instance().maxValue);
        
        if (this.value > GameParamsHelper.Instance().maxValue) return;

        let kkk = this.value <= realMax;
        this.geted.getComponent(UIOpacity).opacity = kkk ? 255 : 0;
        // let color = kkk ? new Color(255,255,255,255) : new Color(255,255,255,100);
        // this.cube.getComponent(MeshRenderer).materials[0].setProperty("albedo", color);
        
        this.selected = value == this.value;
        this.hightLight.active = this.selected;
    }

    // state : 0 要隐藏的      1 向左移动的        2  出现的
    setState(state: number, isTween: boolean,pos : Vec3) {

        if (this.value > GameParamsHelper.Instance().maxValue) return;
        
        let _time = 0.6;
        let _scale_number = this.selected ? 1.1 : 0.9;
        let scale2 = new Vec3(_scale_number, _scale_number, _scale_number);
        
        if (!isTween) {

            if (state == 0) {

                this.node.scale = new Vec3(0, 0, 0);
                
                this.opacity.opacity = 0;
                
            }
            else { 

                this.node.scale = scale2;
                this.opacity.opacity = 255;
            }
            
        }
        else { 
            if (state == 0) {

                scale2 = new Vec3(0, 0, 0);
                
                tween(this.opacity).to(_time, { opacity: 0 }).start();
                tween(this.node).to(_time, { scale: scale2 }).start();
            }
            else if (state == 1) { 

                tween(this.node).to(_time, { position: pos }).start();
                tween(this.node).to(_time, { scale: scale2 }).start();
                
            }
            else if (state == 2) { 

                tween(this.opacity).delay(0.2).to(_time, { opacity: 255 }).start();
                tween(this.node).delay(0.2).to(_time, { scale: scale2 }).start();
            }
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
