//Copyright (c) 2020-2030 Flamenco Qian. All rights reserved.

import { AssetManager, AudioClip, instantiate, Node, Prefab, resources, sp, Sprite, SpriteAtlas, SpriteFrame, tween, Tween, UITransform, v3, Vec3 } from "cc";
import { MathUtil } from "./MathUtil";
// import PlatformProxy, { Platforms } from "../platform/PlatformProxy";



/**实用方法 */
export default class GameUtility {

    private static bundles: any = {};
    private static sprites: any = {};


    /**
     * 设置Bundle
     * @param tag 
     * @param bundle 
     */
    static setBundle(tag: string, bundle: AssetManager.Bundle) {

        if (this.bundles[tag]) {
            console.log(tag, this.bundles[tag]);
            return;
        }
        this.bundles[tag] = bundle;
    }

    /**
     * 获取Bundle
     * @param tag 
     * @returns 
     */
    static getBundle(tag: string): AssetManager.Bundle {
        if (!tag || tag == "") {
            return resources;
        }
        return this.bundles[tag];
    }


    /**
     * 资源预加载
     * @param bundle 
     * @param path 
     */
    static PreloadRescourse(tag: string, path: string) {
        const bundle = GameUtility.getBundle(tag);
        bundle.preload(path, Prefab);
    }


    /**克隆数据 */
    static clone(data: any): any {
        const json = JSON.stringify(data);
        return JSON.parse(json);
    }


    /**
     * 保存数据
     * @param name
     * @param data 
     */
    static save(name: string, data: any): void {
        let json = JSON.stringify(data);
        localStorage.setItem(name, json);
        // if (PlatformProxy.type == Platforms.facebook) {
        //     const element: any = {};
        //     element[name] = json;
        //     //@ts-ignore
        //     FBInstant.player.setDataAsync(element).then(() => {
        //         console.log(`save complete ${name} -> `, element);
        //     });
        // }
    }


    /**
     * 读取数据
     * @param name
     * @returns
     */
    static read(name: string, callback: (data: any) => void): void {
        // console.log("read -> ", PlatformProxy.type)
        // if (PlatformProxy.type == Platforms.facebook) {
        //     //@ts-ignore
        //     FBInstant.player.getDataAsync([name]).then((data) => {
        //         console.log(`get data async success : ${name} -> `, JSON.parse(data[name]));
        //         callback && callback(JSON.parse(data[name]));
        //     }).catch((e: any) => {
        //         console.log("get data async error -> ", e);
        //         this.onReadLocal(name, callback);
        //     });
        // } else {
        //     this.onReadLocal(name, callback);
        // }
    }


    private static onReadLocal(name: string, callback: (data: any) => void) {
        let json = localStorage.getItem(name);
        if (json) {
            let data = JSON.parse(json);
            callback && callback(data);
        } else {
            callback && callback(null!);
        }
    }



    /**
     * 加载配置数据
     * @param bundle 
     * @param path 
     * @param callback 
     */
    static loadJson(tag: string, path: string, callback: (result: any) => void) {
        const bundle = GameUtility.getBundle(tag);
        bundle.load(path, (e, asset: any) => {
            if (e) {
                console.log("load json error -> ", e);
                return;
            }
            if (asset["json"]) {
                let data = asset["json"];
                callback(data);
            }
        });
    }


    /**
     * 预加载预制体
     * @param tag 
     * @param path 
     */
    static onPreloadPrefab(tag: string, path: string, callback: Function = null!) {
        const bundle = GameUtility.getBundle(tag);
        bundle.preload(path, Prefab, (err, data) => {
            console.log(`preload prefab complete -> ${path}`, data);
            callback && callback();
        });
    }



    /**
     * 加载预制体资源
     * @param tag 
     * @param path 
     * @param callback 
     */
    static LoadPrefab(tag: string, path: string, callback: (node: Node) => void) {
        const bundle = GameUtility.getBundle(tag);
        bundle.load(path, Prefab, (e, prefab) => {
            if (e) {
                console.error("load prefab error -> ", e, path);
                return;
            }
            const obj = instantiate(prefab);
            callback && callback(obj);
        });
    }


    /**
     * 预加载音效文件
     * @param tag 
     * @param path 
     * @param callback 
     */
    static PreloadAudioClip(tag: string, path: string) {
        const bundle = GameUtility.getBundle(tag);
        bundle.preload(path, AudioClip);
    }


    /**
     * 加载音效文件
     * @param tag 
     * @param path 
     * @param callback 
     */
    static LoadAudioClip(tag: string, path: string, callback: (clip: AudioClip) => void) {
        const bundle = GameUtility.getBundle(tag);
        bundle.load(path, AudioClip, (e, clip) => {
            if (e) {
                console.log(e, path);
                return;
            }
            callback && callback(clip);
        });
    }


    /**
     * 设置图片
     * @param name 
     * @param target 
     */
    static SetSpriteFrame(tag: string, target: Sprite, name: string) {
        const path = name.replace(/[//]/g, "_");
        if (this.sprites[path]) {
            target.spriteFrame = this.sprites[path];
        } else {
            target.node.active = false;
            const bundle = this.getBundle(tag);
            bundle.load(`images/${name}/spriteFrame`, SpriteFrame, (e, asset) => {
                if (e) {
                    console.log(e);
                    return;
                }
                this.sprites[path] = target.spriteFrame = asset;
                target.node.active = true;
            });
        }
    }


    /**
     * 从图集中设置图片
     * @param name 
     * @param target 
     */
    static SetSpriteAtlas(tag: string, target: Sprite, atlas: string, name: string) {

        const path = `${atlas}_${name}`;
        if (this.sprites[path]) {
            target.spriteFrame = this.sprites[path];
        } else {
            target.node.active = false;
            const bundle = this.getBundle(tag);
            bundle.load(`images/atlas/${atlas}`, SpriteAtlas, (e, asset) => {
                if (e) {
                    console.log(e, atlas, name);
                    return;
                }
                this.sprites[path] = target.spriteFrame = asset.getSpriteFrame(name);
                target.node.active = true;
            });
        }
    }


    static setSkeletonData(path: string, spine: sp.Skeleton, action: (spine: sp.Skeleton) => void): void {
        const bundle = this.getBundle("");
        console.log(path);
        bundle.load(`spine/${path}`, sp.SkeletonData, (e, asset) => {
            if (e) {
                console.log(e, path);
                return;
            }
            spine.skeletonData = asset;
            action(spine);
        });
    }


    /**
     * 比较日期
     * @param local 
     * @returns 
     */
    static CompareDate(local: number): boolean {

        let date = new Date();
        let year_now = date.getFullYear();
        let month_now = date.getMonth();
        let day_now = date.getDate();

        let record = new Date(local);
        let year_record = record.getFullYear();
        let month_record = record.getMonth();
        let day_record = record.getDate();

        if (year_now > year_record)
            return false;
        else if (month_now > month_record)
            return false;
        else if (day_now > day_record)
            return false;
        else
            return true;
    }


    static currentTimeStr () {
        let now = new Date();

        let year = now.getFullYear();       //年
        let month = now.getMonth() + 1;     //月
        let day = now.getDate();            //日

        let clock = year + "-";

        if (month < 10) clock += "0";

        clock += month + "-";

        if (day < 10) clock += "0";

        clock += day;
        return (clock);
    }
    
    /**
     * 格式化时间
     * @param _s 秒
     * @param formate 格式化为秒
     */
    static FormateTime(_s: number, formate: boolean = true): string {
        let time = _s;
        if (formate) time = _s * 0.001;

        let hour = Math.floor(time / 3600);
        let minute = Math.floor(time % 3600 / 60);
        let second = Math.floor(time % 3600 % 60);

        let h_str = "";
        if (hour > 0) {
            h_str = hour.toString();
            if (hour < 10) h_str = "0" + hour;
        }

        let m_str = minute.toString();
        if (minute < 10) m_str = "0" + minute;

        let s_str = second.toString();
        if (second < 10) s_str = "0" + second;

        return h_str ? `${h_str}:${m_str}:${s_str}` : `${m_str}:${s_str}`;
    }

    /**格式化数值 */
    static FormateNumber(value: number): string {
        let unit = "";
        let result = 0;
        let s = "";

        if (value >= 10000000000) {
            unit = "B"
            result = value / 1000000000;
        } else if (value >= 10000000) {
            unit = "M"
            result = value / 1000000;
        } else if (value >= 10000) {
            unit = "K"
            result = value / 1000;
        } else {
            result = value;
        }
        if (unit) {
            if (result >= 100) {
                s = parseInt(result.toString()) + unit;
            } else if (result >= 10) {
                s = parseInt((result * 10).toString()) / 10 + unit;
            } else {
                s = parseInt((result * 100).toString()) / 100 + unit;
            }
        } else {
            s = result.toString();
        }

        return s;
    }


    /**
     * 获取今天剩余的秒数
     */
    static GetSurplusSeconds(): number {
        let date = new Date();
        let total = 24 * 60 * 60;
        let hour = date.getHours();
        let minute = date.getMinutes();
        let sceond = date.getSeconds();
        let delay = total - (hour * 60 * 60 + minute * 60 + sceond);
        return delay;
    }


    /**
     * 转换下划线字符串
     */
    static ConvertString(value: string, symbol: string = '_'): number[] {
        const s: string[] = value.split(symbol);
        const n: number[] = [];
        for (let i of s) {
            n.push(parseInt(i));
        }
        return n;
    }

    static isNullorEmpty(obj) {
        if (obj === '' || obj === null || obj === undefined) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * 向量加法 pos1 + pos2
     * @param pos1 
     * @param pos2 
     * @returns 
     */
    static addVec3(pos1 : Vec3,pos2 : Vec3)
    {
        let pos = v3(pos1.x + pos2.x, pos1.y + pos2.y, pos1.z + pos2.z);
        return pos;
    }

    /**
     * 向量减法 pos1 - pos2
     * @param pos1 
     * @param pos2 
     * @returns 
     */
    static minusVec3(pos1 : Vec3,pos2 : Vec3)
    {
        let pos = v3(pos1.x - pos2.x, pos1.y - pos2.y, pos1.z - pos2.z);
        return pos;
    }

    /**
     * @description ui坐标转换
     * @param _from 原参考点
     * @param _to   新的参考点
     * @param _pos  相对于原参考点的坐标
     * @returns 
     */
    static convertPos(_from: Node | UITransform,_to: Node | UITransform,_pos: Vec3)
    {
        if (!_from || !_to) return v3();

        let _f_tran = _from instanceof UITransform ? _from : _from.getComponent(UITransform);
        let _t_tran = _to instanceof UITransform ? _to : _to.getComponent(UITransform);

        let _w_pos = _f_tran.convertToWorldSpaceAR(_pos);
        return _t_tran.convertToNodeSpaceAR(_w_pos);
    }

    static bezierTo(node : Node,time : number,callback : any,startPos : Vec3,controlPos : Vec3,endPos : Vec3) {
        const quadraticCurve = (t: number, p1: Vec3, cp: Vec3, p2: Vec3, out: Vec3) => {
    
            out.x = (1 - t) * (1 - t) * p1.x + 2 * t * (1 - t) * cp.x + t * t * p2.x;
    
            out.y = (1 - t) * (1 - t) * p1.y + 2 * t * (1 - t) * cp.y + t * t * p2.y;
    
            out.z = (1 - t) * (1 - t) * p1.z + 2 * t * (1 - t) * cp.z + t * t * p2.z;
    
        }
    
        let tempVec3: Vec3 = v3();

        tween(node)
        .to(time, { position: endPos }, {easing : "sineIn", onUpdate: (target, ratio) => {

            quadraticCurve(ratio, startPos, controlPos, endPos, tempVec3);

            node.setPosition(tempVec3);

        }})
        .call(() =>
        {
            callback && callback();
        })
        .start();
    }
}
