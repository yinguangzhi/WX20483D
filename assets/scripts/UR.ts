/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-01-23 11:39:40
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2025-03-02 12:16:23
 * @FilePath: \Triple3D\assets\script\helper\UIHelper.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, find, instantiate, isValid, Label, Node, Prefab, tween, v3 } from 'cc';

import { RL } from './RL';
import { FrequencyHelper } from './FrequencyHelper';
import { StencilHelper } from './StencilHelper';
import { InterfaceHelper } from './InterfaceHelper';
import { Root } from './Root';
const { ccclass, property } = _decorator;


/**
 * @description ui界面处理类
 */
@ccclass('UR')
export class UR {

    private static _instance : UR = null;
    public static get ins()
    {
        if(!this._instance)
        {
            this._instance = new UR();
        }
        return this._instance;
    }

    private constructor()
    { }

    viewMap = {};
    FR: Node = null;
    root: Root = null;

    /**
     * @description 展示界面
     * @param _name    名字、路径
     * @param _father  父物体，如果为空，则放置在不可删除节点下
     * @param _active   
     * @param _mute  界面展示前是否有黑色遮罩，放置误触
     * @param _callback 
     * @returns 
     */
    open(_bundle : string,_name: string, _father: Node, _active: boolean, _mute: boolean, _callback: any) {
 
        if(FrequencyHelper.isEmpty(_name)) return;
        
        let _url = "prefab/" + _name;
        
        let _v = this.viewMap[_name];

        if (isValid(_v) && _v != 1) {
            
            let num = _v.parent.children.length;
            _v.setSiblingIndex(num);
            _callback && _callback(_v);
            return _v;
        }

        this.viewMap[_name] = null;

        if (_mute) this.muteUI(true); 

        RL.ins.loadAssetAsync(_bundle,_url, Prefab)
            .then((prefab: Prefab) => 
            {
                if (_mute) this.muteUI(false);

                let _v = this.viewMap[_name];
                if (_v == 1) return;

                if (isValid(_v)) {
                    _callback && _callback(_v);
                    return;
                }
                _father = this.getFR(_father);
                

                let obj = null;
                if (isValid(_father) && prefab) {
                    
                    obj = StencilHelper.ins.clone2(prefab,_father,_active);

                    this.viewMap[_name] = obj;
                }

                _callback && _callback(obj);
            }) ;
    }

    muteUI(state: boolean) {
        // if (state) {
        //     let _parent = this.getFR(null);
        //     this.open("UIMask", _parent, true, false, (obj: Node) => {
              
        //     })
        // } else {
        //     this.cV("UIMask");
        // }
    }

    /**
     * @description 添加不可删除节点
     * @param _permanents 
     */
    setFR(_FR: Node) {
        this.FR = _FR;
    }

    /**
     * 获取、处理父物体
     * @param _parent 
     * @param _default 
     * @returns 
     */
    getFR(_parent: any, _default = true) {

        if (_parent && isValid(_parent)) return _parent;

        if (!_default) return _parent;

        if (this.FR && isValid(this.FR)) return this.FR;

        let _canvas = find("Canvas");
        return _canvas;
    }

    /**
     * 绑定根节点，一个场景最多只绑定一个常规根节点
     * @param _root 
     */
    setRoot(_root: Root) {
        this.root = _root;
    }

    /**
     * @description 根据界面所属层级，获取在根节点下的父物体
     * @param layer 
     * @returns 
     */
    getParent(layer: UI_LAYER) {
        if (!this.root || !this.root.isValid) {
            
            return this.getFR(null);
        }

        if (layer == UI_LAYER.UI) return this.root.uiContent;
        else if (layer == UI_LAYER.POP) return this.root.popContent;
        else if (layer == UI_LAYER.HINT) return this.root.hintContent;

        return this.root.node;
    }

    close(name: string, isDestroy: boolean = true) {
        let _page = this.viewMap[name];

        if (_page == 1 || !_page) return;

        if (isValid(_page)) {
            if (isDestroy) {
                _page.destroy();
            }
            else {
                _page.active = false;
            }
        }

        this.viewMap[name] = 1;
    }

    pushV(name: string, obj: Node) {
        this.viewMap[name] = obj;
    }

    getV(name: string) {

        let _page = this.viewMap[name];

        if (_page == 1) return null;

        if (isValid(_page)) return _page;
        else return null;
    }

    displayHint(context : string, _stayTime : number)
    {
        // RL.ins.loadAssetResAsync("prefab/UIHint", Prefab, true,this.getFR(null), null)
        //     .then((page : Node) =>
        //     {
        //         InterfaceHelper.findChild(page,"value").getComponent(Label).string = context;
             
        //         page.scale = v3();
        //         tween(page)
        //             .to(0.25, { scale : v3(1,1,1)})
        //             .delay(_stayTime)
        //             .to(0.16, { scale : v3() })
        //             .call(() => {
        //                 page.destroy();
        //             })
        //             .start();
        //     })
    }
}

export enum UI_LAYER {
    UI = 1,
    POP = 2,
    HINT = 3,
}

