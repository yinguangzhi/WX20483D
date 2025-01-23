/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-05-05 17:20:29
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2024-05-05 17:21:36
 * @FilePath: \ALUnity2048\assets\scripts\tools\AspectCamera.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { _decorator, CameraComponent, Component, Node, view } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = AspectCamera
 * DateTime = Sun May 05 2024 17:20:29 GMT+0800 (GMT+08:00)
 * Author = yinhuan
 * FileBasename = AspectCamera.ts
 * FileBasenameNoExtension = AspectCamera
 * URL = db://assets/scripts/tools/AspectCamera.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('AspectCamera')
export class AspectCamera extends Component {
    
    _camera : CameraComponent = null;
    _defaultTanFov = 1;

    start () {
        this._camera = this.getComponent(CameraComponent)!;
        this._defaultTanFov = Math.tan(this._camera.fov / 180 * Math.PI);
        this.updateFov();
    }

    updateFov = () => {
        let tan2 = view.getVisibleSize().height / view.getDesignResolutionSize().height * this._defaultTanFov;
        this._camera.fov = Math.atan(tan2) / Math.PI * 180;
        console.log(this._camera.fov);
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
