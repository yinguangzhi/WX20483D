/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-01-23 11:39:40
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2024-01-24 10:39:51
 * @FilePath: \Triple3D\assets\script\helper\UIHelper.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { __private, _decorator, Asset, AssetManager, assetManager, Component, error, instantiate, isValid, Node, Prefab, resources, SpriteFrame, Texture2D, v3 } from 'cc';
import { SubpackageMgr } from './SubpackageMgr';

const { ccclass, property } = _decorator;

export class PreloadInformation{
    father = "";
    path  = "";
    interval = 1;
    type : any = null;
    callback : any = null;
    
    constructor(_father : string,_path : string,_interval : number,_type : any = Prefab,_callback : any = null)
    {
        this.father = _father;
        this.path = _path;
        this.interval = _interval;
        this.callback = _callback;
    }
}
/**
 * @description 资源加载类
 */
@ccclass('RL')
export class RL{

    private static _instance : RL = null;
    public static get ins()
    {
        if(!this._instance)
        {
            this._instance = new RL();
        }
        return this._instance;
    }

    private constructor()
    { }

    assetMap = {}

    preloadMissionMap = {}

    BPL(_father : string)
    {
        this.CPL(_father);
    }

    SPL(_father : string)
    {
        let missions : PreloadInformation[] = this.preloadMissionMap[_father];
        
        if(!missions || missions.length == 0) return;
        
        this.preloadMissionMap[_father] = null;
    }

    CPL(_father : string)
    {
        let missions : PreloadInformation[] = this.preloadMissionMap[_father];
        if(!missions || missions.length == 0) return;

        let mi = missions[0];

        let delayCall = (asset : Asset) =>
        {
            // console.log(asset);
            mi && mi.callback && mi.callback(asset);
            
            if(!missions || missions.length == 0) return;
            missions.splice(0,1);

            setTimeout(() => {
                this.CPL(_father);
            }, mi.interval * 1000);
        }

        this.loadAssetAsync(null,mi.path,mi.type)
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
     * @param {任务标志} _father 
     * @param {路径} _path 
     * @param {类型} type 
     * @param {该资源加载完后，过多久可以加载下一个} interval 
     * @param {*} callback 
     * @returns 
     */
    APA(_father: string,_path: string,type: any,interval: number,callback: any)
    {
        let missions : PreloadInformation[] = this.preloadMissionMap[_father];
        if (!missions)
        {
            this.preloadMissionMap[_father] = [];
            missions = this.preloadMissionMap[_father];
        }
        
        let find = missions.find(element => element.path == _path);
        if(find)
        {
            return;
        }

        missions.push(new PreloadInformation(_father,_path,interval,type,callback));
    }

    APAS(_father : string,_arr : PreloadInformation[],_launch : boolean = true)
    {
        this.preloadMissionMap[_father] = _arr;
        if(_launch)
        {
            this.BPL(_father)
        }
    }

    iLD(url: string)
    {
        return this.assetMap[url] != null;
    }

    // loadAssetRes(url: string, type: typeof Prefab, parent: Node, active: boolean, callback: any) {
    //     this.loadAsset(url, type, (prefab: Asset) => {
    //         let obj = null;

    //         if (!isValid(parent)) return;

    //         if (isValid(prefab)) {
    //             obj = instantiate(prefab);
    //             obj.active = active;
    //             obj.parent = parent;

    //             obj.position = v3(0, 0, 0);
    //         }
    //         callback && callback(obj);

    //     });
    // }

    // loadAsset(url: string, type: any, callback: any) {

    //     let _find = this.assetMap[url];

    //     if (!_find || !isValid(_find.asset)) {
    //         if (_find) {
    //             this.assetMap[url] = null;
    //         }

    //         let ret = null;

    //         resources.load(url, type, (err, asset) => {

    //             console.log(err);
    //             if (!err) {
    //                 ret = asset;
    //                 _find = { url: url, asset: asset };
    //                 this.assetMap[url] = _find;
    //             }
    //             callback && callback(ret);
    //         });
    //     }
    //     else {
    //         callback && callback(_find.asset);
    //     }
    // }

    // setAsset(url: string, asset: any) {
    //     this.assetMap[url] = { url: url, asset: asset };
    // }

    // loadAssets(folder: string, type: any, callback: any) {
    //     resources.loadDir(folder, type, (error, assets) => {
    //         if (callback) {
    //             if (error) callback(null);
    //             else callback(assets);
    //         }
    //     })
    // }

    // loadArrayAssets(paths: string, type: any, callback: any, addRefCnt: number) {
    //     resources.load(paths, type, (error, assets) => {
    //         if (callback) {
    //             if (error) callback(null);
    //             else callback(assets);
    //         }
    //     })
    // }

    /**
     * 释放资源数组
     * @param assets 要释放的asset数组
     * @param _thorough 是否彻底释放
     */
    // releaseArray(assets: [], _thorough: boolean) {
    //     if (assets.length == 0) return;

    //     for (let i = 0; i < assets.length; ++i) {
    //         this.releaseAsset(assets[i], _thorough);
    //     }
    // }

    /**
     * 直接通过asset释放资源（如cc.Prefab、cc.SpriteFrame）
     * @param asset 要释放的asset
     */
    // releaseAssetImmediate(asset: Asset) {
    //     if (!asset) return;

    //     assetManager.releaseAsset(asset);
    // }

    /**
     * 释放冗余资源，使资源的引用数变为1
     */
    // releaseAssetRedundancy(assets: string[]) {

    //     if (assets.length == 0) return;

    //     for (let i = 0; i < assets.length; ++i) {
    //         let url = assets[i];
    //         let _find = this.assetMap[url];

    //         if (_find && isValid(_find.asset)) {

    //             let _cnt = _find.asset.refCount;

    //             if (_cnt > 1) {
    //                 for (let i = 1; i < _cnt; i++) {
    //                     _find.asset.decRef();
    //                 }
    //             }
    //             // console.log("  leave ref dec :  ", url, "  :   ", _find.asset.refCount);
    //         }
    //     }

    // }

    /**
     * 释放资源
     * @param assets 要释放的asset
     * @param _thorough 是否彻底释放
     */
    // releaseAsset(url: string, _thorough: boolean) {

    //     let _find = this.assetMap[url];

    //     console.log("释放资源 prepare : ", url, "  refCount : ", _find);
    //     if (!this.isEmpty(_find) && isValid(_find.asset)) {

    //         console.log("释放资源 : ", url, "  refCount : ", _find.asset.refCount);
    //         if (_thorough) {
    //             let _cnt = _find.asset.refCount;

    //             if (_cnt > 0) {
    //                 for (let i = 0; i < _cnt; i++) {
    //                     _find.asset.decRef();
    //                 }
    //             }
    //             else _find.asset.decRef();
    //         }
    //         else _find.asset.decRef();
    //         // console.log("  leave ref dec :  ", url, "  :   ", _find.asset.refCount);
    //     }
    // }

    

    loadAssetAsync(_bundleName : string,url: string, type: any) {
        return new Promise((resolve, reject) => {

            let _find = this.assetMap[url];

            if (!_find || !isValid(_find.asset)) {

                SubpackageMgr.ins.loadBundle(_bundleName,(_bd : AssetManager.Bundle) =>
                {
                    if(!_bd)
                    {
                        reject("_bundle : " + _bundleName + " is not exit");
                        return;
                    }

                    _bd.load(url, type, (err, asset) => {
                        if (!err) {
                            _find = { url: url, asset: asset };
                            this.assetMap[url] = _find;
    
                            resolve(asset);
                        }
                        else reject(err);
                    });
                })
            }
            else {
                resolve(_find.asset);
            }
        })
    }


    loadAssetResAsync(_bundleName : string,url: string, type: Prefab | any, active: boolean, parent: Node, callback: any) {
        return new Promise((resolve, reject) => {
            this.loadAssetAsync(_bundleName,url, type)
                .then((asset: Prefab) => {
                    if (!isValid(parent)) {
                        reject("err");
                    }
                    else {
                        let obj = instantiate(asset);
                        obj.active = active;
                        obj.parent = parent;

                        obj.position = v3(0, 0, 0);
                        resolve(obj);
                    }
                })
                .catch((err) => {
                    reject(err);
                })
        })
    }

    getAsset<T extends Asset>(url: string, type: __private._types_globals__Constructor<T>) {
        let asset = resources.get<T>(url, type);
        if (!asset) {
            console.warn("getAsset error", url, type);
        }
        return asset;
    }

    isEmpty(obj: any) {
        if (obj === '' || obj === null || obj === undefined) {
            return true;
        }
        else {
            return false;
        }
    }
}


