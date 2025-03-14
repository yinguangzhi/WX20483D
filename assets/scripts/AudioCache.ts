
import { _decorator, Component, Node, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = AudioCache
 * DateTime = Mon Jul 04 2022 23:00:04 GMT+0800 (中国标准时间)
 * Author = yinhuan
 * FileBasename = AudioCache.ts
 * FileBasenameNoExtension = AudioCache
 * URL = db://assets/scripts/AudioCache.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('AudioCache')
export class AudioCache extends Component {


    @property(AudioClip)
    public clips: Array<AudioClip> = [];

    start() {
        // [3]
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
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
