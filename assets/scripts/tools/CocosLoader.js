
module.exports =
{
    assetAbouts: [],

    loadAssetRes(url, type, parent, active, callback, addRefCnt) {
        this.loadAsset(url, type, (prefab) => {
            let obj = null;

            if (cc.isValid(parent) && cc.isValid(prefab)) {
                obj = cc.instantiate(prefab);
                obj.active = active;
                obj.parent = parent;

                obj.position = cc.v2(0, 0)
            }
            if (callback) callback(obj);
        }, addRefCnt);
    },

    loadAsset(url, type, callback, addRefCnt) {

        let _find = this.assetAbouts.find(element => element.url == url);

        console.log("begin load asset before : " + url);
        
        if (!_find || !cc.isValid(_find.asset)) {
            if (_find) {
                let _idx = this.assetAbouts.indexOf(_find);
                this.assetAbouts.splice(_idx, 1);
            }

            let ret = null;

            console.log("begin load asset : " + url);
            cc.resources.load(url, type, (err, asset) => {
                console.log(err);
                if (!err) {
                    ret = asset;
                    _find = { url: url, asset: asset };
                    this.assetAbouts.push(_find);
                    if (addRefCnt && addRefCnt > 0) {
                        for (let i = 0; i < addRefCnt; i++) _find.asset.addRef();
                    }
                }
                if (callback) callback(ret);
            });
        }
        else {
            if (addRefCnt && addRefCnt > 0) {
                // console.log("addRefCnt : ", addRefCnt);
                for (let i = 0; i < addRefCnt; i++) _find.asset.addRef();
            }
            if (callback) callback(_find.asset);
        }
    },

    loadAssets(folder, type, callback, addRefCnt) {
        cc.resources.loadDir(folder, type, (error, assets) => {

            if (callback) {
                if (error) callback(null);
                else callback(assets);
            }
        })
    },

    loadArrayAssets(paths, type, callback, addRefCnt) {
        cc.resources.load(paths, type, (error, assets) => {

            if (callback) {
                if (error) callback(null);
                else callback(assets);
            }
        })
    },

    /**
     * 释放资源数组
     * @param assets 要释放的asset数组
     * @param _thorough 是否彻底释放
     */
    releaseArray(assets, _thorough) {
        if (assets.length == 0) return;

        for (let i = 0; i < assets.length; ++i) {
            this.releaseAsset(assets[i], _thorough);
        }
    },

    /**
     * 直接通过asset释放资源（如cc.Prefab、cc.SpriteFrame）
     * @param asset 要释放的asset
     */
    releaseAssetImmediate(asset) {
        if (!asset) return;

        cc.assetManager.releaseAsset(asset);
    },

    /**
     * 释放冗余资源，使资源的引用数变为1
     */
    releaseAssetRedundancy(assets) {

        if (assets.length == 0) return;

        for (let i = 0; i < assets.length; ++i) {

            let url = assets[i];
            let _find = this.assetAbouts.find(element => element.url == url);

            if (!this.isNullorEmpty(_find) && cc.isValid(_find.asset)) {

                let _cnt = _find.asset.refCount;

                if (_cnt > 1) {
                    for (let i = 1; i < _cnt; i++) {
                        _find.asset.decRef();
                    }
                }
                // console.log("  leave ref dec :  ", url, "  :   ", _find.asset.refCount);
            }
        }

    },

    /**
     * 释放资源
     * @param assets 要释放的asset
     * @param _thorough 是否彻底释放
     */
    releaseAsset(url, _thorough) {

        let _find = this.assetAbouts.find(element => element.url == url);

        if (!this.isNullorEmpty(_find) && cc.isValid(_find.asset)) {

            if (_thorough) {
                let _cnt = _find.asset.refCount;

                if (_cnt > 0) {
                    for (let i = 0; i < _cnt; i++) {
                        _find.asset.decRef();
                    }
                }

            }
            else _find.asset.decRef();
            // console.log("  leave ref dec :  ", url, "  :   ", _find.asset.refCount);
        }
    },

    AssetLevel: { Level_Curr_Scene: 1, Level_Next_Scene: 2 },
    tempAssetAbouts: [],
    cacheTempAssets(url, _level) {
        if (url) {
            let temp = this.tempAssetAbouts.find(element => element.level == _level);
            if (!temp) {
                temp = { level: _level, assetUrls: [] }
                this.tempAssetAbouts.push(temp)
            }
            if (temp.assetUrls.indexOf(url) == -1) temp.assetUrls.push(url)
        }
    },

    releaseTempAsset(_clear, _level) {
        if (_clear && this.tempAssetAbouts.length > 0) {

            let temp = this.tempAssetAbouts.find(element => element.level == _level);
            if (temp) {
                for (let i = 0; i < temp.assetUrls.length; i++) {
                    this.releaseAsset(temp.assetUrls[i]);
                }
                temp.assetUrls.length = 0;
            }
        }
    },

    replaceTempAsset(_fromLevel, _toLevel) {

        let fromTemp = this.tempAssetAbouts.find(element => element.level == _fromLevel);
        let toTemp = this.tempAssetAbouts.find(element => element.level == _toLevel);

        if (fromTemp) {
            if (!toTemp) {
                toTemp = { level: _toLevel, assetUrls: [] }
                this.tempAssetAbouts.push(toTemp)
            }
            for (let i = 0; i < fromTemp.assetUrls.length; i++) {
                toTemp.assetUrls.push(fromTemp.assetUrls[i]);
            }
            fromTemp.assetUrls.length = 0;
            return toTemp.assetUrls;
        }
        return null;
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
