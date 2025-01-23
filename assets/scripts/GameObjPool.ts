
import { _decorator, NodePool, instantiate, isValid } from 'cc';
import Singleton from './tools/Singleton';
import BaseSingleton from './tools/BaseSingleton';

export class NodePoolAbout {
    public model = null;
    public name: string = "";
    public pool: NodePool = null;
    public list = [];
    constructor(_name: string, _pool: NodePool, _model) {
        this.name = _name;
        this.pool = _pool;
        this.model = _model;
        this.list = [];
    }
}

export class GameObjPool extends BaseSingleton<GameObjPool>{

    pools: Array<NodePoolAbout> = [];
    public registerPool(_poolName: string, _model) {
        let pool = new NodePool();
        let poolAbout = new NodePoolAbout(_poolName, pool, _model);
        this.pools.push(poolAbout);
    }

    public unRegisterPool(_poolName: string) {
        let _poolAbout = this.getPoolAbout(_poolName);
        if (_poolAbout) {
            _poolAbout.pool.clear();

            let _idx = this.pools.indexOf(_poolAbout);
            this.pools.splice(_idx, 1);
        }
    }

    public get(_poolName: string) {
        let _poolAbout = this.getPoolAbout(_poolName);
        let _ret = null;
        if (_poolAbout) {
            if (_poolAbout.pool.size() == 0) {
                _ret = instantiate(_poolAbout.model);
            }
            else
            {
                _ret = _poolAbout.pool.get();
                if (!isValid(_ret))
                {
                    _ret = instantiate(_poolAbout.model);
                }
                
            }    
            _poolAbout.list.push(_ret);
        }
        return _ret;
    }

    public put(_poolName: string, obj) {
        let _poolAbout = this.getPoolAbout(_poolName);
        if (_poolAbout) {
            let _idx = _poolAbout.list.indexOf(obj);
            if (_idx != -1) _poolAbout.list.splice(_idx, 1);

            _poolAbout.pool.put(obj);

        }
    }

    getPoolAbout(_poolName: string) {
        if (_poolName == "" || _poolName == null) return null;
        let _poolAbout = this.pools.find(element => element.name == _poolName);
        return _poolAbout;
    }

    getUsingList(_poolName: string) {
        let _poolAbout = this.getPoolAbout(_poolName);
        if (_poolAbout) {
            return _poolAbout.list;
        }
        else return [];
    }
}