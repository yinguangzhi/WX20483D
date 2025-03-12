/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-22 21:53:35
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2024-05-05 23:16:31
 * @FilePath: \Unity2048\assets\scripts\ScenePage.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { _decorator, Component, Node, UITransform, Label, director, SceneAsset, Texture2D, SpriteFrame, assetManager, resources, AssetManager } from 'cc';
const { ccclass, property } = _decorator;

import { GameParamsHelper } from './GameParamsHelper';
import { AssetPreLoader } from './tools/AssetPreLoader';
import { SubpackageMgr } from './SubpackageMgr';

 
//注意注意 
//阿里小游戏不能同时动态加载太多资源，否则会无响应，不知为何

@ccclass('ScenePage')
export class ScenePage extends Component {
    
   
    @property(Node)
    public backNode: Node = null;

    @property(UITransform)
    public progressSprite: UITransform = null;

    protected progress: number = 0;
    protected completed: number = 0;
    protected target: number = 0;

    protected pages: string[] = [];
    protected panels: string[] = [];

    private speed: number = 30;

    
    @property(Label)
    progressLabel: Label = null;

    durTime = 0;
    lastPercent = 0;

    couldDestroy = false;

    scene = "";
    sceneAsset = null;
    autoTranslate = false;

    totalPreLoadCnt = 0;
    preLoadCnt = 0;

    onLoad () {
        
        this.setProgress(0);
    }

     update(dt: number) {

        if (this.totalPreLoadCnt == 0) return;


        // console.log(this.totalPreLoadCnt + "  " + this.preLoadCnt);
        
         if (this.progress < 98) {

            if (this.preLoadCnt < this.totalPreLoadCnt) {

                if (this.progress < 96) {

                    this.progress += dt * this.speed;
                }
                if (this.progress >= 98) this.progress = 96;
                this.setProgress(this.progress);
                
            } 
            else {
                
                this.speed = 60;

                this.progress += dt * this.speed;
                this.setProgress(this.progress);
            }

             
            //  console.log("this.progress : " + "  " + this.progress);
             
            if (this.progress >= 98) {
                console.log(this.scene);
                
                this.onLoadComplete();
            }
        }
     }
    
    setSceneLoadState(state : boolean,_scene : string, _autoTranslate : boolean) { 
        
        this.node.active = state;
        
        if (state) { 
            this.setData(_scene,_autoTranslate);
        }
    }

    public setData(_scene : string, _autoTranslate : boolean): void {

        this.speed = 15;
        this.progress = 0;
        this.setProgress(this.progress);

        this.scene = _scene;

        this.autoTranslate = _autoTranslate;

        if (this.backNode) this.backNode.active = false;

        this.preLoadCnt = 0;
        this.totalPreLoadCnt = 0;

        if (this.scene == "game") {

            console.log("enter game ..")
            this.totalPreLoadCnt = 41;
            
            this.scheduleOnce(() =>
            {
                SubpackageMgr.ins.loadBundle("subGame",(_bundle : AssetManager.Bundle) =>
                {
                    for (let i = 0; i < 40; i++) {
                        let val = Math.pow(2, i + 1);
    
                        let arg = val.toString();
                        
                        if (val > (1024 * 1024 * 1024 * 8)) { 
                            arg = val / (1024 * 1024 * 1024) + 'G';
                            
                        } 
                        else if (val > (1024 * 1024 * 8)) { 
                            arg = val / (1024 * 1024) + 'M';
                            
                        } 
                        else if (val > 8192) {
                            arg = val / 1024 + 'K';
                        }
                
                        // AssetPreLoader.Instance().addAsset(`images/${arg}/texture`, Texture2D, 0.01, (asset : Texture2D) => { 
                        _bundle.load(`images/${arg}/texture`, Texture2D, (err,asset : Texture2D) => { 
                                
                            GameParamsHelper.Instance().textures[arg] = asset;
                            // console.log(arg,"  ",asset);
                            this.preLoadCnt++;
                    
                            if (i == 39) this.plScene(_bundle);
                        })
                
                        // setTimeout(() => {
                        
                        //     console.log("enter game load texture begin .. " + `images/${arg}/texture`);
                        
                        //     LoaderMgr.Instance().loadAsset(`images/${arg}/texture`, Texture2D, (asset) => { 
                                
                        //         GameParamsHelper.Instance().textures[arg] = asset;
                                
                        //         this.preLoadCnt++;
                        
                        //     },0)
                        // }, i * 600);
                        
                    }
    
                    // AssetPreLoader.Instance().beginPreLoad();
                })

            },0.4)
        }

        console.log("......................begin load scene")
    }

    plScene(_bundle : AssetManager.Bundle)
    {
        _bundle.loadScene(this.scene, (error, sceneAsset: SceneAsset) => {
            this.sceneAsset = sceneAsset;
     
            console.log("..............load scene game complete");

            this.preLoadCnt++;
            
        });

    }

    onLoadComplete(): void {
     
        this.progress = 98;
        this.setProgress(this.progress);

         director.loadScene(this.scene, function () {});
    }

    setProgress(percent : number) {

        // console.log("set progress : " + percent);
        this.progressLabel.string = "loading... " + `${Math.floor(percent)}%`;
        this.progressSprite.width = percent * 0.01 * 534;

        if (percent > 50 &&
            this.preLoadCnt < this.totalPreLoadCnt &&
            this.scene.indexOf("game") != -1 &&
            this.backNode) {

            this.backNode.active = true;
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
