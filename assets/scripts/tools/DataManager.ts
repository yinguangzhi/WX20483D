
import { _decorator, Component, Node } from 'cc';
import BaseSigleton from './BaseSingleton';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = DataManager
 * DateTime = Sun May 15 2022 13:44:16 GMT+0800 (中国标准时间)
 * Author = yinhuan
 * FileBasename = DataManager.ts
 * FileBasenameNoExtension = DataManager
 * URL = db://assets/scripts/tools/DataManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('DataManager')
export class DataManager extends BaseSigleton<DataManager> {

    public userData =
        {
            bestScore: 0,
            score: 0,
            bestSQScore: 0,
            classicBombCnt: 0,
            classicAnyCnt: 0,
            vibrate: 1,
            music: 1,
            audio: 1,
            shortcutTime: "",
            first : 0,
        };

    saveUserData(type: string, val: any, delaySave: boolean) {

        switch (type) {

            case "bestScore":
                if (this.userData.bestScore >= val) return;
                this.userData.bestScore = val;
                break;
            case "score":
                this.userData.score = val;
                break;
            case "bestSQScore":
                if (val <= this.userData.bestSQScore) return;

                this.userData.bestSQScore = val;
                break;

            case "classicBombCnt":
                if (this.userData.classicBombCnt < 0) this.userData.classicBombCnt = 0;
                this.userData.classicBombCnt += val;
                break;

            case "classicAnyCnt":
                if (this.userData.classicAnyCnt < 0) this.userData.classicAnyCnt = 0;
                this.userData.classicAnyCnt += val;
                break;
            case "shortcutTime":
                this.userData.shortcutTime = val;
                break;


            case "vibrate":
                this.userData.vibrate = val;
                break;
            case "music":
                this.userData.music = val;
                break;
            case "audio":
                this.userData.audio = val;
                break;
            case "first":
                console.log("first : ",val);
                
                this.userData.first = val;
                break;
        }

        if (delaySave) return;

        let _dataStr = JSON.stringify(this.userData);

        localStorage.setItem("userData", _dataStr);
        
        this.setDataToPlatform({ userData: _dataStr }, "userData")
    }

    checkUserData() {

        //經典模式
        //球的最高分（2的平方）
        this.checkDataProperty(this.userData, "bestScore", 4, 'number');
        this.checkDataProperty(this.userData, "score", 0, 'number');
        this.checkDataProperty(this.userData, "bestSQScore", 4, 'number');
        this.checkDataProperty(this.userData, "classicBombCnt", 0, 'number');
        this.checkDataProperty(this.userData, "classicAnyCnt", 0, 'number');



        this.checkDataProperty(this.userData, "shortcutTime", "", 'string');
        this.checkDataProperty(this.userData, "vibrate", 1, 'number');
        this.checkDataProperty(this.userData, "music", 1, 'number');
        this.checkDataProperty(this.userData, "audio", 1, 'number');
        this.checkDataProperty(this.userData, "first", 0, 'number');
    }

    checkDataProperty(tempData, key, defaultVal, valType) {
        if (this.isNullorEmpty(tempData)) return;
        if (this.isNullorEmpty(tempData[key])) tempData[key] = defaultVal;
        else if (!this.isNullorEmpty(valType) && typeof tempData[key] !== valType) tempData[key] = defaultVal;
    }

    readUserData() {

        // let dataStr = localStorage.getItem("userData");
        // if (!this.isNullorEmpty(dataStr)) this.userData = JSON.parse(dataStr);


        let dataStr = localStorage.getItem("userData");
        if (!this.isNullorEmpty(dataStr)) this.userData = JSON.parse(dataStr);

        console.log(dataStr);
        this.checkUserData();

        console.log(this.userData);

        let _dataStr = JSON.stringify(this.userData);

        localStorage.setItem("userData", _dataStr);
    }

    readUserDataFromPlatform(_callback) {
        let that = this;

        //@ts-ignore
        if (window.isFB) {

            
        }
        else {
            this.readUserData();
            if (_callback) _callback();
        }
    }

    saveBoard(type, data) {
        if (!data) return;

        let keystr = "";

        if (type == "classic") keystr = "classicBoard";

        let _dataStr = JSON.stringify(data);
        localStorage.setItem(keystr, _dataStr);
    }

    readBoard(type) {
        let data = null;

        let keystr = "";

        if (type == "classic") keystr = "classicBoard";

        let _dataStr = localStorage.getItem(keystr);
        if (_dataStr) data = JSON.parse(_dataStr);

        if (!data) data = {};
        console.log(data);
        return data;
    }

    isNullorEmpty(obj) {
        if (obj === '' || obj === null || obj === undefined) {
            return true;
        }
        else {
            return false;
        }
    }

    setDataToPlatform(dataObj, title) {

        if (this.isNullorEmpty(dataObj)) return;
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
