
import { __private, _decorator, Asset, AssetManager, Component, instantiate, isValid, Node, Prefab, resources, v3 } from 'cc';
import BaseSigleton from './BaseSingleton';
import { SubpackageMgr } from '../SubpackageMgr';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = LoaderMgr
 * DateTime = Fri May 03 2024 20:13:44 GMT+0800 (GMT+08:00)
 * Author = yinhuan
 * FileBasename = LoaderMgr.ts
 * FileBasenameNoExtension = LoaderMgr
 * URL = db://assets/scripts/tools/LoaderMgr.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('LoaderMgr')
export class LoaderMgr extends BaseSigleton<LoaderMgr> {
    assetMap = {}

    loadAssetRes(url: string, type: typeof Prefab, parent: Node, active: boolean, callback: any, addRefCnt: number) {
        this.loadAsset(url, type, (prefab: Asset) => {
            let obj = null;

            if (!isValid(parent)) return;

            if (isValid(prefab)) {
                obj = instantiate(prefab);
                obj.active = active;
                obj.parent = parent;

                obj.position = v3(0, 0, 0);
            }
            callback && callback(obj);

        }, addRefCnt);
    }

    loadAsset(url: string, type: any, callback: any, addRefCnt: number) {

        let _find = this.assetMap[url];

        if (!_find || !isValid(_find.asset)) {
            if (_find) {
                this.assetMap[url] = null;
            }

            let ret = null;

            resources.load(url, type, (err, asset) => {

                console.log(err);
                if (!err) {
                    ret = asset;
                    _find = { url: url, asset: asset };
                    this.assetMap[url] = _find;

                    if (addRefCnt && addRefCnt > 0) {
                        for (let i = 0; i < addRefCnt; i++) _find.asset.addRef();
                    }
                }
                callback && callback(ret);
            });
        }
        else {
            if (addRefCnt && addRefCnt > 0) {
                // console.log("addRefCnt : ", addRefCnt);
                for (let i = 0; i < addRefCnt; i++) _find.asset.addRef();
            }

            callback && callback(_find.asset);
        }
    }

    setAsset(url: string, asset: any) {
        this.assetMap[url] = { url: url, asset: asset };
    }

    loadAssets(folder: string, type: any, callback: any, addRefCnt: number) {
        resources.loadDir(folder, type, (error, assets) => {
            if (callback) {
                if (error) callback(null);
                else callback(assets);
            }
        })
    }

    loadArrayAssets(paths: string, type: any, callback: any, addRefCnt: number) {
        resources.load(paths, type, (error, assets) => {
            if (callback) {
                if (error) callback(null);
                else callback(assets);
            }
        })
    }

    loadAssetAsync(_bundleName : string,url: string, type: any, callback: any, addRefCnt: number) {

        return new Promise((resolve, reject) => {

            let _find = this.assetMap[url];

            if (!_find || !isValid(_find.asset)) 
            {
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
    
                            // console.log(_find);
                            if (addRefCnt && addRefCnt > 0) {
                                for (let i = 0; i < addRefCnt; i++) asset.addRef();
                            }
    
                            resolve(asset);
                        }
                        else reject(err);
                    }); 
                })
            }
            else 
            {
                if (addRefCnt && addRefCnt > 0) {
                    for (let i = 0; i < addRefCnt; i++) _find.asset.addRef();
                }
                resolve(_find.asset);
            }
        })
    }


    loadAssetResAsync(_bundleName : string,url: string, type: Prefab | any, active: boolean, parent: Node, callback: any, addRefCnt: number) {
        return new Promise((resolve, reject) => {
            this.loadAssetAsync(_bundleName,url, type, callback, addRefCnt)
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
