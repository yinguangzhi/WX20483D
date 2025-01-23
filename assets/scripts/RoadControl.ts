
import { _decorator, Component, Node, instantiate, Vec3, tween, UIOpacity, SpriteFrame } from 'cc';
import { GameParamsHelper } from './GameParamsHelper';
import { RoadItem } from './RoadItem';
import { DataManager } from './tools/DataManager';
import GameConfig from "./GameConfig.js";
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = RoadControl
 * DateTime = Fri Sep 02 2022 08:52:14 GMT+0800 (GMT+08:00)
 * Author = yinhuan
 * FileBasename = RoadControl.ts
 * FileBasenameNoExtension = RoadControl
 * URL = db://assets/scripts/RoadControl.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('RoadControl')
export class RoadControl extends Component {
    public static Instance: RoadControl = null;

     @property(Node)
    public pointParent: Node = null;
     @property(Node)
     public pointPrefab: Node = null;
     @property(SpriteFrame)
     public frames: Array<SpriteFrame> = [];
    
    private pointList: Array<RoadItem> = [];
    private posXs = [-228, -73, 82, 237,237];
    max = 8;
    //  : 
    pointCount = 5;

    onLoad() { 
        RoadControl.Instance = this;

        // GameConfig.generateFrameAbouts(this.frames);
    }

    start () {
        // [3]
        // this.generateLayout(DataManager.Instance().userData.bestSQScore);
    }

    generateLayout(value: number) {
        this.pointParent.destroyAllChildren();
        this.pointList.length = 0;

        let posXs = this.posXs;

        this.max = value;
        let realMax = this.max;
        if (this.max < 8) this.max = 8;
        

        let secondValue: number = this.max;

        if (this.max >= GameParamsHelper.Instance().maxValue / 2) { 
            secondValue = GameParamsHelper.Instance().maxValue / 4;
        }

        let values =
            [
                secondValue / 2,
                secondValue,
                secondValue * 2,
                secondValue * 4,
                secondValue * 8
            ];
        
        for (let i = 0; i < this.pointCount; i++) { 
            
            if (values[i] > GameParamsHelper.Instance().maxValue) { 
                break;
            }

            let point = instantiate(this.pointPrefab);
            point.parent = this.pointParent;
            point.position = new Vec3(posXs[i],0,0);
            point.active = true;

            let item = point.getComponent(RoadItem);
            item.setData(values[i]);
            item.setSelect(this.max, realMax);
            
            let _state = i != this.pointCount - 1 ? 2 : 0;
            item.setState(_state, false,new Vec3(0,0,0));

            
            this.pointList.push(item);
        }
    }
    
    refresh(value: number) {
        
        if (value <= this.max) { 

            for (let i = 0; i < this.pointCount; i++) {
            
                if (i >= this.pointList.length) continue;

                let item = this.pointList[i];
                item.setSelect(this.max, value);
                
            }
           
            return;
        }

        this.max = value;

        let couldMove = this.max < GameParamsHelper.Instance().maxValue / 2
    
        let virtualItem : RoadItem = null;

        let posXs = this.posXs;
        
        for (let i = 0; i < this.pointCount; i++) {
            
            if (i >= this.pointList.length) continue;

            let item = this.pointList[i];
            item.setSelect(this.max,this.max);
            
            if (!couldMove)
            { 
                item.setState(2,true,new Vec3(0, 0, 0));
                continue;
            }
            
            if (i == 0)
            {
                item.setState(0,true,new Vec3(0, 0, 0));
                virtualItem = item;
            }
            else if (i == this.pointCount - 1)
            { 
                item.setState(2,true,new Vec3(0, 0, 0));
            }
            else { 
                
                let pos1 = new Vec3(posXs[i - 1], 0, 0);
                    
                item.setState(1,true, pos1);
            }
        }

        this.scheduleOnce(() => { 

            if (virtualItem && value * 8 <= GameParamsHelper.Instance().maxValue) { 

                virtualItem.setData(value * 8);

                virtualItem.setSelect(this.max, this.max);
                
                virtualItem.setState(0, false, new Vec3(0, 0, 0));
                
                virtualItem.node.position = new Vec3(posXs[this.pointCount - 1],0,0);
            } 

            this.pointList.sort((a, b) => { 
                return a.value - b.value;
            })
        },0.8)
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
