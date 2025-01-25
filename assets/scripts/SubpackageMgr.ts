
import { _decorator, assetManager, Component, Node, resources } from 'cc';
import BaseSigleton from './tools/BaseSingleton';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = SubpackageMgr
 * DateTime = Sat Jan 25 2025 20:10:44 GMT+0800 (GMT+08:00)
 * Author = yinhuan
 * FileBasename = SubpackageMgr.ts
 * FileBasenameNoExtension = SubpackageMgr
 * URL = db://assets/scripts/SubpackageMgr.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('SubpackageMgr')
export class SubpackageMgr extends BaseSigleton<SubpackageMgr> {

    bundleMap = {};

    loadBundle(_bundleName : string,_callback : any)
    {
        if(this.isEmpty(_bundleName))
        {
            _callback && _callback(resources);
            return;
        }

        let _bd = this.bundleMap[_bundleName];
        if(_bd)
        {
            _callback && _callback(_bd);
            return _bd;
        } 

        assetManager.loadBundle(_bundleName,(err, bundle) => {
            console.log("load bundle error : ",err);
            this.bundleMap[_bundleName] = bundle;
            _callback && _callback(bundle)
        });
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
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
 */
