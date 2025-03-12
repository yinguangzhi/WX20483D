import { _decorator, Component, instantiate, isValid, Node, NodePool, Prefab, v3, Vec3 } from 'cc';

import { ArrayHelper } from './ArrayHelper';
const { ccclass, property } = _decorator;

export class StencilInformation 
{
    public stencil: Node | Prefab = null;

    public name: string = "";

    public pool: NodePool = null;

    public array = [];

    constructor(_name: string, _stencil: any) {
        this.pool = new NodePool();
        this.name = _name;
        this.stencil = _stencil;
        this.array = [];
    }

    get()
    {
        let _temp = null;
        if (this.pool.size() == 0)
        {
            _temp = instantiate(this.stencil);
        }
        else
        {
            _temp = this.pool.get();
            if (!isValid(_temp)) _temp = instantiate(this.stencil); 
        }

        this.array.push(_temp);
        return _temp;
    }

    put(obj : Node)
    {
        ArrayHelper.discardFromArray(this.array,obj);
        this.pool.put(obj);
    }

    clean()
    {
        this.pool.clear();
        if(this.array.length > 0)
        {
            let _num = this.array.length;
            for (let i = 0; i < _num; ++i) 
            {
                if(isValid(this.array[i])) this.array[i].destroy();
            }
            this.array.length = 0;
        }
        this.stencil = null;
    }
}

@ccclass('StencilHelper')
export class StencilHelper {

    private static _instance : StencilHelper = null;
    public static get ins()
    {
        if(!this._instance)
        {
            this._instance = new StencilHelper();
        }
        return this._instance;
    }

    private constructor()
    { }

    stencils: Array<StencilInformation> = [];

    public register(_name: string, _model: Node | Prefab) {

        this.unregister(_name);

        this.stencils.push(new StencilInformation(_name, _model));
    }

    public unregister(_name: string) {

        let _stencil = this.findStencil(_name);
        if(!_stencil) return;

        _stencil.clean();

        ArrayHelper.discardFromArray(this.stencils,_stencil);
    }

    public get(_name: string, _parent: Node, _active: boolean) {

        let _stencil = this.findStencil(_name);
        if (!_stencil) return null;

        let _temp = _stencil.get();
        if (!_temp) return null;

        if (_parent) _parent.addChild(_temp);
        _temp.active = _active;
        return _temp;
    }

    public put(_name: string, obj: Node) {

        if (!obj) return;
        if (!isValid(obj)) return;

        let _stencil = this.findStencil(_name);
        if (!_stencil) return;

        _stencil.put(obj);
    }

    // clean(_name: string) {
    //     let _stencil = this.findStencil(_name);
    //     if (!_stencil) return;

    //     _stencil.pool.clear();
    //     _stencil.array.length = 0;
    // }

    findStencil(_name: string) {
        if (_name == "" || _name == null) return null;
        let _stencil = this.stencils.find(element => element.name == _name);
        return _stencil;
    }

    getOccupiedArray(_name: string) 
    {
        let _stencil = this.findStencil(_name);
        if (_stencil) return _stencil.array; 
        else return [];
    }

    clone(_stencil : Node,_parent : Node,_active : boolean,_position : Vec3 = v3())
    {
        let obj = instantiate(_stencil);
        obj.parent = _parent;
        obj.active = _active;
        obj.position = _position;
        return obj;
    }
    clone2(_stencil : Prefab,_parent : Node,_active : boolean,_position : Vec3 = v3())
    {
        let obj = instantiate(_stencil);
        obj.parent = _parent;
        obj.active = _active;
        obj.position = _position;
        return obj;
    }
}

export enum STENCIL_NAME {
    COIN = "COIN",
    HEAP = "HEAP",
    HEXAGON = "HEXAGON",
    SLOT = "SLOT",
    HEXAGON_QUANTITY = "HEXAGON_QUANTITY",
    LOCK_SLOT_GRADE = "LOCK_SLOT_GRADE",
    LOCK_SLOT_AD = "LOCK_SLOT_AD",
    TRAIL = "TRAIL",
    HAMMER = "HAMMER",
    ITEM = 'ITEM',
}

