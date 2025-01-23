// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

module.exports =
{
    /** 回调函数 */
    listeners: null,
    btnListerers: null,
    lastFireTime: 0,
    hasInit: false,
    testObj: null,

    register(funcStr, func, attach) {
        this.init();

        this.listeners[funcStr] = { func: func, attach: attach };
    },

    fire(funcStr, params, params1, ...paramsn) {
        this.init();
        let _data = this.listeners[funcStr];

        if (!_data || !_data.func || !cc.isValid(_data.attach))
            return;


        let _length = arguments.length;
        if (_length == 1) _data.func.call(_data.attach);
        else if (_length == 2) _data.func.call(_data.attach, arguments[1]);
        else if (_length == 3) _data.func.call(_data.attach, arguments[1], arguments[2]);
        else if (_length == 4) _data.func.call(_data.attach, arguments[1], arguments[2], arguments[3]);
        else if (_length == 5) _data.func.call(_data.attach, arguments[1], arguments[2], arguments[3], arguments[4]);
        else if (_length == 6) _data.func.call(_data.attach, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
    },

    fireBtn(btnName, deltaTime, toAll) {
        this.init();
        let ret = false;
        let now = new Date();
        let _find = this.btnListerers[btnName];
        if (this.isNullorEmpty(_find)) {
            this.btnListerers[btnName] = now.getTime();
            ret = true;
        }
        else {
            ret = (now.getTime() - _find) > deltaTime;//(now.getTime() - _find.time) > deltaTime;
            if (ret) this.btnListerers[btnName] = now.getTime();//_find.time = now.getTime();
        }


        return ret;
    },

    init() {
        if (this.hasInit)
            return;

        this.hasInit = true;
        this.listeners = new Array();
        this.btnListerers = new Array();
    },

    isNullorEmpty: function (obj) {
        if (obj == '' || obj == null || obj == undefined) {
            return true;
        }
        else {
            return false;
        }
    },
}
