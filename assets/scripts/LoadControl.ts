/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-05-01 14:18:42
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2024-05-05 23:01:28
 * @FilePath: \ALUnity2048\assets\scripts\LoadControl.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { _decorator, Component, Node, Prefab, instantiate, screen,view, ResolutionPolicy, AssetManager, assetManager, resources, error, Texture2D } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = LoadControl
 * DateTime = Wed Jul 27 2022 15:10:03 GMT+0800 (中国标准时间)
 * Author = yinhuan
 * FileBasename = LoadControl.ts
 * FileBasenameNoExtension = LoadControl
 * URL = db://assets/scripts/LoadControl.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

import UIHelper from "./tools/UIHelper.js";

import { DataManager } from './tools/DataManager';
import { PermanentManager } from './PermanentManager';
import { AudioMgr } from './tools/AudioMgr';
import { WeChatTool } from './WeChatTool';
import { WebBridge } from './WebBridge';

//注意注意 
//阿里小游戏不能同时动态加载太多资源，否则会无响应，不知为何
@ccclass('LoadControl')
export class LoadControl extends Component {
    @property(Prefab)
    public scenePrefab: Prefab = null;
    sceneControl = null;
    loadCnt = 0;

    onLoad() {

        
        let size = screen.windowSize;
        console.log(size);
        
        let rate = size.height / size.width;

        let designSize = {width : 720,height : 1280};
        let staticRate = designSize.height / designSize.width;
        if (rate < staticRate) view.setDesignResolutionSize(designSize.width,designSize.height,ResolutionPolicy.SHOW_ALL)
        else view.setDesignResolutionSize(designSize.width,designSize.height,ResolutionPolicy.FIXED_WIDTH)

    }

    start() {
        WeChatTool.Instance().init();

        UIHelper.init();
        
        this.loadCnt = 0;

        
        WeChatTool.Instance().checkVibrate();

        WeChatTool.Instance().login((state : boolean) => {

            if(!WeChatTool.Instance().isAgreedPrivacy())
            {
                WeChatTool.Instance().requirePrivacyAuthorizeAfterLogin((_agree : boolean) =>
                {
                    this.readData();
                })
            }
            else this.readData();
            
        })
    }

    readData()
    {
        console.log("readWXUserData : ");
        DataManager.Instance().readUserDataFromPlatform(() => {

            AudioMgr.Instance().setAudioState(DataManager.Instance().userData.audio == 1);
            AudioMgr.Instance().setMusicState(DataManager.Instance().userData.music == 1, false);

            WebBridge.Instance().loadVideo();
            WebBridge.Instance().loadFull();
            
            setTimeout(() => {
                WebBridge.Instance().showBanner();

            }, 5000);

            this.enterGame();
        
        })
    }

    enterGame() {

        this.loadCnt++;
        

        if (this.loadCnt >= 1) {
            // this.sceneControl.setData("game", true);
            PermanentManager.instance.setSceneLoadState(true,"game",true);
        }
    }
}
