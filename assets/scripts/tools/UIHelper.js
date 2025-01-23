// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var CocosLoader = require('./CocosLoader');
module.exports =
{
    uiType:
    {
        panel1: 1, panel2: 2,
    },

    uiList: null,
    inited: false,

    init() {
        if (this.inited) return;

        this.inited = true;
        this.uiList = new Array();
    },
     
    displayUI: function (uitype, uiname, uiparent, state, callback) {

        this.init();

        // console.log(this.uiList);
        let _find = this.uiList.find((element) => element.name == uiname);
        if (_find) {
            if (cc.isValid(_find.obj)) return _find.obj;
            else this.remove(this.uiList, _find);
        }

        _find = { name: uiname, obj: null };
        this.uiList.push(_find);
        CocosLoader.loadAsset("prefab/" + uiname, cc.Prefab, (prefab) => {
        // LoaderMgr.Instance().loadAsset("prefab/" + uiname, cc.Prefab, (prefab) => {
            let _temp = this.uiList.find((element) => element.name == uiname);
            if (!_temp) return;

            let obj = null;
            if (uiparent && prefab) {
                obj = cc.instantiate(prefab);
                obj.active = state;
                obj.parent = uiparent;
                obj.name = uiname;
                console.log(uiname);
                _find.obj = obj;
            }

            if (callback) callback(obj);
        }, 0);
    },

    hideUI: function (uiname) {
        this.init();

        let find = this.uiList.find((element) => element.name == uiname);
        if (find) {
            if (cc.isValid(find.obj)) find.obj.destroy();
            else console.log("this ui is not exist in hiding");

            this.remove(this.uiList, find);
        }
    },

    addUI(uiname, obj) {
        this.init();

        let data = { name: uiname, obj: obj };
        this.uiList.push(data);
    },

    getUI(uiname) {

        if (this.uiList == null) return null;

        let find = this.uiList.find((element) => element.name == uiname);

        if (find && cc.isValid(find.obj)) return find.obj;
        else return null;
    },

    hasUI(uiname) {
        if (this.uiList == null) return false;

        let find = this.uiList.find((element) => element.name == uiname);
        if (find && cc.isValid(find.obj)) return true;

        return false;
    },

    remove(list, unit) {
        let a = list.indexOf(unit);
        // console.log("remove", a);
        if (a == -1) return;
        list.splice(a, 1);
    },

    isNullorEmpty: function (obj) {
        if (obj === '' || obj === null || obj === undefined) {
            return true;
        }
        else {
            return false;
        }
    },
}
