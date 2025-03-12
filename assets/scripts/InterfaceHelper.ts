import { _decorator, Component, isValid, Label, Node, Tween, UITransform, v3, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('InterfaceHelper')
export class InterfaceHelper {
    
    /** 获取基类 */
    // static ds(_n : any) : DDS
    // {
    //     if (!_n) return null;

    //     return  _n.getComponent(DDS);
    // }

    /** 获取UITransform */
    static uiTransform(_n: any)
    {
        if (!_n) return null;

        return _n.getComponent(UITransform);
    }
    


    static emptyNode(parent : Node,name : string = "")
    { 
        let note = new Node();
        note.name = name;

        parent.addChild(note);
        note.position = v3();
        
        return note;
    }

    static findChild(parent: Node, name: string)
    {
        if (!parent) return null;
        if (!isValid(parent)) return null;
        let child = parent.getChildByName(name);
        return child;
        
    }
    
    static findChildLabel(parent: Node, name: string)
    {
        let child = this.findChild(parent,name)
        if (!child) return null;

        return child.getComponent(Label);
    }
    
    static stopTween(_tween : Tween<any>,_empty : boolean = true)
        {
            if(_tween && isValid(_tween))
            {
                _tween.stop();
            }
            if(_empty) _tween = null;
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
     * 向量乘法 pos1.x * scaler, pos1.y * scaler, pos1.z * scaler
     * @param pos1 
     * @param pos2 
     * @returns 
     */
    static multiplyScalarVec3(pos1 : Vec3,scaler : number)
    {
        let pos = v3(pos1.x * scaler, pos1.y * scaler, pos1.z * scaler);
        return pos;
    }

    /**
     * 获取配置文本
     * @param key key值
     * @param params 传入参数
     * @returns 返回字符串
     */
    static getLabel(key: string, params: string[] = null) {

        let str = key;
        for (let i = 0; i < params.length; i++) {
            let reg = new RegExp("#" + (i + 1), "g");
            str = str.replace(reg, params[i]);
        }
        return str;
    }

    /** 整数随机 */
    static randomInt(min : number, max : number)
    {
        let _val = Math.floor(Math.random() * (max - min) + min);
        return _val;
    }

    /** 浮点数随机 */
    static randomFloat(min : number, max : number)
    {
        return Math.random() * (max - min + 1) + min;
    }

    static computeProbability(_probabilityArray)
    {
        let tp = 0;
        for(let i = 0;i < _probabilityArray.length;i++)
        {
            tp += _probabilityArray[i].probability;
        }
        return tp;
    }

    static randInProbabilityArray(_val : number,_arr : any[])
    {
        let _addV = 0;
        let _index = 0;
        let _config = _arr[_index];
        for(let i = 0;i < _arr.length;i++)
        {
            if (_arr[i].probability <= 0) continue;
            
            _addV += _arr[i].probability;
            if(_addV >= _val)
            {
                _index = i;
                _config = _arr[i];
                break;
            }
        }
        return {
            index : _index,
            config :_config
        };
    }
}


