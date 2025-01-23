/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-22 22:35:11
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-17 20:25:38
 * @FilePath: \Unity2048\assets\scripts\UILoading.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = UILoading
 * DateTime = Mon Aug 22 2022 22:35:11 GMT+0800 (GMT+08:00)
 * Author = yinhuan
 * FileBasename = UILoading.ts
 * FileBasenameNoExtension = UILoading
 * URL = db://assets/scripts/UILoading.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('UILoading')
export class UILoading extends Component {
    
    @property(Node)
    public loading: Node = null;

    start () {
        // [3]
    }

    update (deltaTime: number) {
        this.loading.angle -= 180 * deltaTime;
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
