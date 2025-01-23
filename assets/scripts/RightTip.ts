
import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = RightTip
 * DateTime = Mon Sep 19 2022 20:42:02 GMT+0800 (GMT+08:00)
 * Author = yinhuan
 * FileBasename = RightTip.ts
 * FileBasenameNoExtension = RightTip
 * URL = db://assets/scripts/RightTip.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('RightTip')
export class RightTip extends Component {
    
    attachNode : Node = null;
    start () {
        // [3]
    }

    update() {
        if (!this.attachNode) return;
        this.node.position = this.attachNode.position.add(new Vec3(0, 44, 0));
        this.node.scale = this.attachNode.scale;
    }
    
    setData(attach : Node) {
        this.attachNode = attach;
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
