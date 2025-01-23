
import { _decorator, Asset, Component, Node, resources } from 'cc';
import BaseSigleton from './BaseSingleton';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = AssetPreLoader
 * DateTime = Fri May 03 2024 20:25:36 GMT+0800 (GMT+08:00)
 * Author = yinhuan
 * FileBasename = AssetPreLoader.ts
 * FileBasenameNoExtension = AssetPreLoader
 * URL = db://assets/scripts/tools/AssetPreLoader.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('AssetPreLoader')
export class AssetPreLoader extends BaseSigleton<AssetPreLoader> {
    assetMap = {}
    assetTaskMap = []

    loadAssetAsync(url : string,type : any,callback : any)
    {
        
        return new Promise((resolve,reject) =>
        {
            let arg = this.assetMap[url];

            if(arg && arg.asset) resolve(arg.asset);
            else
            {
                resources.load(url,type,(error,asset) =>
                {
                    // console.log(asset);
                    if(error)
                    {
                        reject(error)
                    }
                    else
                    {
                        this.assetMap[url] = {url : url,asset : asset};
                        resolve(asset);
                    }
                })
            }
            
        })
    }

    beginPreLoad()
    {
        this.checkPreLoad();
    }

    checkPreLoad()
    {
        if(this.assetTaskMap.length == 0) return;

        let arg = this.assetTaskMap[0];

        let delayCall = (asset : Asset) =>
        {
            arg && arg.callback && arg.callback(asset);
            
            this.assetTaskMap.splice(0,1);

            setTimeout(() => {
                this.checkPreLoad();
            }, arg.interval * 1000);
        }

        this.loadAssetAsync(arg.url,arg.type,null)
            .then((asset : Asset) =>
            {   
                delayCall(asset);
            })
            .catch((error) =>
            {
                delayCall(null);
            })
            
    }

    /**
     * @description 添加预加载任务
     * @param {路径} url 
     * @param {类型} type 
     * @param {该资源加载完后，过多久可以加载下一个} interval 
     * @param {*} callback 
     * @returns 
     */
    addAsset(url : string,type : any,interval : number,callback : any)
    {
        let find = this.assetTaskMap.find(element => element.url == url);
        if(find)
        {
            console.log("sir!! 你已经将 " + url + " 加入到预加载列表里了!!!");
            return;
        }

        let arg = {
            url : url,
            type : type,
            interval : interval,
            callback : callback,
        }

        this.assetTaskMap.push(arg);
    }

    isPreloaded(url : string)
    {
        return this.assetMap[url] != null;
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
