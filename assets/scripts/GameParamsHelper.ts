/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-09-02 20:14:10
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-09-26 22:27:36
 * @FilePath: \Unity2048\assets\scripts\GameParamsHelper.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { _decorator, Component, Node, Texture2D } from 'cc';
import BaseSigleton from './tools/BaseSingleton';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GameParamsHelper
 * DateTime = Fri Sep 02 2022 20:14:10 GMT+0800 (GMT+08:00)
 * Author = yinhuan
 * FileBasename = GameParamsHelper.ts
 * FileBasenameNoExtension = GameParamsHelper
 * URL = db://assets/scripts/GameParamsHelper.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('GameParamsHelper')
export class GameParamsHelper extends BaseSigleton<GameParamsHelper> {
    maxValue = 1099511627776; //65536;
    baseMaxValue = 128;
    bindCount = 0;
    textures = {};
    ad = "广告尚未加载!"

    shortcutChecked = false;
    isBinding = false;
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
