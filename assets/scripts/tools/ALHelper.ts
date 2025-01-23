
import { _decorator, assetManager, Component, Label, Node, Sprite, SpriteFrame, sys, Texture2D, view } from 'cc';
import BaseSigleton from './BaseSingleton';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

 
@ccclass('ALHelper')
export class ALHelper extends BaseSigleton<ALHelper> {
    userInfo = null;
    iconList = null;
    localPlatform = "ANDROID";
    supportedAPIs = null;
    authorization = false;//授权
    screenWidth = 0;
    screenHeight = 0;
    windowWidth = 0;
    windowHeight = 0;
    pixelRatio = 1;
    isIOS = false;
    isH5 = false;
    aliSdk = null;

    clientVersion = "";

    descLabel : Label = null
    setDesc(descText: Label)
    {
        this.descLabel = descText;
    }
    
    addDesc(str: string)
    {
        console.log("in desc : ", str);

        if (!this.descLabel) return;

        this.descLabel.string += str + '\n'; 
    }

    isNative() {
        return sys.isNative;
        // cc.sys.isBrowser
    }

    
    init() {

        console.log("is AL : " + sys.platform);
        this.addDesc("is AL :" + sys.platform)
        console.log("is AL : " + sys.platform == sys.Platform.ALIPAY_MINI_GAME);

        this.aliSdk = window['my'];
        this.isH5 = this.aliSdk != null;

        if (this.aliSdk)
        {
            this.clientVersion = this.aliSdk.env.clientVersion;
            this.addDesc("clientVersion : " + this.clientVersion);

            let systemInfo = this.aliSdk.getSystemInfoSync();
            if (systemInfo)
            {
                
                if (!systemInfo['error'] || systemInfo['error'] != 999)
                {
                    
                    this.screenHeight = systemInfo.screenHeight;
                    this.screenWidth = systemInfo.screenWidth;    
                    this.pixelRatio = systemInfo.pixelRatio;
                    this.windowHeight = systemInfo.windowHeight;
                    this.windowWidth = systemInfo.windowWidth; 
                    this.localPlatform = systemInfo.platform; //"iOS";
                    this.isIOS = this.localPlatform == "iOS";

                    this.addDesc("systemInfo.screenHeight : " + systemInfo.screenHeight)
                    this.addDesc("systemInfo.screenWidth : " + systemInfo.screenWidth)
                    this.addDesc("systemInfo.windowHeight : " + systemInfo.windowHeight)
                    this.addDesc("systemInfo.windowWidth : " + systemInfo.windowWidth)
                    this.addDesc("systemInfo.pixelRatio : " + systemInfo.pixelRatio)

                }
                else this.addDesc("is AL : systemInfo error  " + systemInfo['error'])
                
            }
            else this.addDesc("is AL 22b : systemInfo is null");

        }
    }

    getTopOffsetInPlatform() {
    }

    login(callback : any) {
        console.log("login ...");

        this.authorization = true;
        callback && callback(true);
    }

    getAuthorization(callback : any) { }

    initPlayer() {

    }

    getSDKVersion() {
    }


    trackEvent(eventStr) { }

    loadRemoteTexture (container : Sprite, url : string, userID : string, _loading : Node, _callback : any) {

        let _find = this.iconList.find(element => element.id == userID);

        if (_find && _find.spriteFrame) {
            if (container) container.spriteFrame = _find.spriteFrame;
            if (_loading) _loading.active = false;
            if (_callback) _callback();
            return;
        }

        if (_find) {
            let _idx = this.iconList.indexOf(_find)
            if (_idx != -1) this.iconList.splice(_idx, 1);
        }

        if (_loading) _loading.active = true;

        assetManager.loadRemote(url, (err, texture : Texture2D) =>
        {
            if (err) console.log(err);

            if (texture)
            {
                let _save = texture instanceof Texture2D;

                if (_save)
                {
                    let spriteFrame = new SpriteFrame();
                    // let spriteFrame = new SpriteFrame(texture);
                    this.iconList.push({ id: userID, spriteFrame: spriteFrame });

                    if (container) container.spriteFrame = spriteFrame;
                }
            }
            if (_loading) _loading.active = false;
            if (_callback) _callback();
        });
    }

    vibrateState = 0;
    checkVibrate()
    {
        if (this.vibrateState != 0) return;

        let _could = "vibrate" in navigator;
        if (_could) this.vibrateState = 2;
        else this.vibrateState = 3;
    }

    vibrateAction(vibrateTime) {
        this.checkVibrate();

        if (this.isH5)
        {
            this.aliSdk.vibrateShort({
                success: function(res) {
                    // console.log(res);
                    // this.aliSdk.alert({
                    //     title: "震动起来了"
                    // });
                },
                fail: function(err) {
                    // console.log(err);
                    // this.aliSdk.alert({
                    //     title: "震动失败了"
                    // });
                }
                });
        }
        else if (this.vibrateState == 2) navigator.vibrate(10);
    }

    worldID = "";
    suggestGame(id : string,type : string)
    { }


    createShortcut(_check: boolean, _auto: boolean, _callback: any)
    { }


    updateType =
        {
            update : 1,
            share : 5
        }

    updateToPlatform(texPath : string, data : any, _callback : any) {
        if (!this.isH5) return;

        this.aliSdk.onShareAppMessage = function(){
            return {
                title: '2048弹一弹',
                desc: '快来玩吧!看看你能合成多少',
                success: function (res) {
                    console.log("onShareAppMessage success: ", res);
                },
                fail: function (e) {
                    console.log("onShareAppMessage fail : ", e);
                },
                complete: function (e) {
                    console.log("onShareAppMessage complete : ", e);
                    _callback && _callback();
                }
            }
        }

        this.aliSdk.showSharePanel({
            success: function(res) {
                console.log("showSharePanel success: ",res);
            },
            fail: function(e) {
                console.log("showSharePanel fail : ",e);
            },
            complete: function(res) {
                console.log("showSharePanel complete : ",res);
            } 
        });

        //参数获取
        // const options = this.aliSdk.getLaunchOptionsSync();
        // console.log(JSON.stringify(options));
        //获取结果
        // {"query":{"key1":"value1","key2":"value2"},"referrerInfo":{}}
    }

    realUpdateToPlatform (canvasTex, updateAT, data, _callback) {
        
    }

    setProtoRank(title : string, score : number) {
        
    }


    ADState =
    {
        NotLoad: 0, LoadSuccess: 1, LoadFail: 2, Loading: 3, ReadyDisplay: 4, SuccessDisplay: 5, FailDisplay: 5,
    }

    isFullMaxDelta() {
        
        let _time = this.currentTime();
        return _time - this.lastFullTime > 27;
    }

    initFullADBefore(_initFull : boolean) {
        this.initFullAD();
    }

    interstitialFinishedCallBack = null;

    fullAttemptNumber = 0;
    fullFailInitCnt = 0;
    fullLoadTime = 0;
    fullState = 0;
    interstitialAd = null;
    initFullAD () {
        if (this.isH5)
        {
            if (this.aliSdk.canIUse('createInterstitialAd'))
            {
                if (this.fullState == this.ADState.LoadFail || this.fullState == this.ADState.NotLoad)
                {
                    this.fullState = this.ADState.Loading;
            
                    this.addDesc("is AL : interstitialAd : " + this.fullState);
                    
                    if (this.interstitialAd != null)
                    {
                        try {
                            
                            this.interstitialAd.destroy();   
                        }
                        catch (e)
                        {

                        } 

                        this.interstitialAd = null;
                    }
                    
                    this.interstitialAd = this.aliSdk.createInterstitialAd({ 
                        adUnitId: 'ad_tiny_2021004139631275_202404302200095483' // 广告单元 ID
                    });

                    this.interstitialAd.onClose(res => {
                        // 广告关闭事件触发
                        console.log(res);
                        this.addDesc("is AL 2: interstitialAd : close");
                        this.watchedInterstitialAd();
                        
                        this.tryInitFullAd(2000);
                    })
                    
                    this.interstitialAd.onLoad(() => {
                            this.fullState = this.ADState.LoadSuccess;
                            this.addDesc("is AL 2: interstitialAd : " + this.ADState.LoadSuccess);
                    })

                    this.interstitialAd.onError(err => {
                        this.fullState = this.ADState.LoadFail;
                        this.addDesc("is AL 2: interstitialAd : " + this.ADState.LoadFail);
                        this.addDesc("is AL 2: interstitialAd : " + err.errCode);
                        this.tryInitFullAd(30000);
                    })
                }
                
                
            }
            else
            {
                return;    
            }
        }
        else {
            this.fullState = this.ADState.LoadSuccess;
        }
    }

    tryInitFullAd(_time : number)
    {

        setTimeout(() => {
            this.initFullAD();
        }, _time);
    }

    lastFullTime = -10;
    displayFullAD(_callback : any) {
        let seconds = this.currentTime();

        if (this.isH5) {

            this.addDesc("is AL 2: displayFullAD 111: ");
            if (this.fullState != this.ADState.LoadSuccess)
            {
                _callback && _callback();
                return;       
            }
            
            this.addDesc("is AL 2: displayFullAD 000: ");

            if (this.interstitialAd == null) 
            {
                _callback && _callback();
                return;    
            }
            
            this.addDesc("is AL 2: displayFullAD : ");
            
            this.interstitialFinishedCallBack = _callback;
            this.interstitialAd.show()
                .catch((err) => {
                    

                    console.log('插屏/全屏广告显示失败', err);
                    this.addDesc("is AL : interstitialAd.show fail : " + err);

                    this.watchedInterstitialAd();
                    
                    this.tryInitFullAd(6000);
                });
            
            this.fullState = this.ADState.NotLoad;
        }
        else {
            this.fullState = this.ADState.NotLoad;
            
            _callback && _callback();
        }
    }

    watchedInterstitialAd()
    {
        this.interstitialFinishedCallBack && this.interstitialFinishedCallBack();
        this.interstitialFinishedCallBack = null;
    }

    initVideoADBefore(_initVideo : boolean) {
        
        this.initVideoAD();
    }
    
    videoFinishCallBack = null;
    watchedVideoAd(_state : boolean) { 
        this.videoFinishCallBack && this.videoFinishCallBack(_state);
        this.videoFinishCallBack = null;
    }

    selfCloseVideo = false;
    videoLoadTime = 0;
    videoFailInitCnt = 0;
    rewardedState = 0;
    rewardedAd = null;
    initVideoAD () {
        console.log("init video ad")
        if (this.isH5) {

            if (this.rewardedAd == null)
            {
                if (this.aliSdk.canIUse('createRewardedAd'))
                {
                    this.addDesc("is AL : initRewardedAd")
                    
                    this.rewardedAd = this.aliSdk.createRewardedAd({
                        adUnitId : "ad_tiny_2021004139631275_202404302200095431"
                    })

                    this.rewardedAd.onClose(res => {
                        // 广告关闭事件触发
                        console.log(res);
                        this.addDesc("is AL 2: initRewardedAd : close");
                        
                        this.watchedVideoAd(res && res.isEnded);

                        this.tryInitVideoAd(3000);

                        AudioMgr.Instance().resumeMusic();
                        
                    })
                        
                    this.rewardedAd.onLoad(() => {
                        this.rewardedState = this.ADState.LoadSuccess;
                        this.addDesc("is AL 2: initRewardedAd : " + this.ADState.LoadSuccess);
                    })
                    this.rewardedAd.onError(err => {
                        this.rewardedState = this.ADState.LoadFail;
                        this.addDesc("is AL 2: initRewardedAd : " + this.ADState.LoadFail);
                        this.addDesc("is AL 2: initRewardedAd : " + err.errCode);

                        this.tryInitVideoAd(30000);
                    })
                }
                else
                {
                    return;    
                }
                
            }

            if (this.rewardedAd == null) return;
            
            if (this.rewardedState == this.ADState.LoadFail || this.rewardedState == this.ADState.NotLoad)
            {
                this.rewardedState = this.ADState.Loading;
                this.addDesc("is AL : initRewardedAd : " + this.rewardedState);

                // 插屏/全屏广告加载和显示
                // load 加载广告
                this.rewardedAd.load()
                    .then(() => {
                        // 加载广告完成之后，通过 show 显示广告
                    })
                    .catch((err) => {
                        console.log('视频广告加载失败', err);
                        
                        this.addDesc('视频广告加载失败  ' + err.errCode);
                        
                        this.tryInitVideoAd(30000);
                    });
            }
        }
        else {
            
            this.rewardedState = this.ADState.Loading;
            
            // this.rewardedState = this.ADState.LoadSuccess;

            setTimeout(() => { 
                console.log(123);
                this.rewardedState = this.ADState.LoadSuccess;
            },3000)
        }
    }

    tryInitVideoAd(_time : number)
    {
        setTimeout(() => {
            this.initVideoAD();
        }, _time);

    }

    displayVideoAD(_callback : any) {
        if (this.isH5) {

            this.addDesc("is AL 2: displayVideoAD 111: ");
            if (this.rewardedState != this.ADState.LoadSuccess)
            {
                _callback && _callback(false);
                return;       
            }
            
            this.addDesc("is AL 2: displayVideoAD 000: ");

            if (this.rewardedAd == null) 
            {
                _callback && _callback(false);
                return;    
            }
            
            this.addDesc("is AL 2: displayVideoAD : ");
            
            AudioMgr.Instance().pauseMusic();

            this.videoFinishCallBack = _callback;
            this.rewardedAd.show()
                .catch((err) => {
                    
                    console.log('视频广告显示失败', err);
                    this.addDesc("is AL : rewardedAd.show fail : " + err.errCode);
                    this.watchedVideoAd(false);

                    this.tryInitVideoAd(8000);

                    AudioMgr.Instance().resumeMusic();
                    
                });
            
            this.rewardedState = this.ADState.NotLoad;
        }
        else { 
            
            this.rewardedState = this.ADState.NotLoad;
            
            console.log("video videoState after display in not ali: ", this.rewardedState);
            
            this.watchedVideoAd(true);
        } 
    }

    isVideoADLoad() {
        if (this.isH5) {
            let ret = this.rewardedState == this.ADState.LoadSuccess;
            return ret;
        }
        else return this.rewardedState == this.ADState.LoadSuccess;
    }

    isVideoADLoading() {
        if (this.isH5) return this.rewardedState == this.ADState.Loading;
        else return this.rewardedState == this.ADState.Loading;
     }

    isFullADLoad() {
        if (this.isH5) return this.fullState == this.ADState.LoadSuccess;
        else return true;
    }

    isFullADLoading() {
        if (this.isH5) return this.fullState == this.ADState.Loading;
        else return false;
     }

    isVideoCouldInitAgain() {
        if (this.rewardedState == this.ADState.LoadFail ||
            this.rewardedState == this.ADState.NotLoad) {
            
            let _time = this.currentTime();
            let _isTimeReady = (_time - this.videoLoadTime) > 60;
            return _isTimeReady;
        }
        else { 
            console.log("is Video could init again exteral : ",false);
            return false;
            
        } 
    }

    isFullAdCouldInitAgain() {
        if (this.fullState == this.ADState.LoadFail ||
            this.fullState == this.ADState.NotLoad) {

            let _time = this.currentTime();
            let _isTimeReady = (_time - this.fullLoadTime) > 60;
            return _isTimeReady;
        }
        else return false;
    }

    bannerAd = null;
    bannerState = 0;
    lastBannerTime = -10;
    bannerFailInitCnt = 0;
    displayBanner(_callback : any) {

        //1500*362
        let _bh = 362 * (this.screenWidth / 1500)
        let _top = (this.screenHeight / this.pixelRatio) - (_bh / this.pixelRatio);
        if(this.isIOS) _top = (this.screenHeight) - (_bh);
        
        let my = window['my'];
        if (!my) return;

        let bannerAd = my.createBannerAd({
            adUnitId: 'ad_tiny_2021004139631275_202404302200095497',
            style: {
                left: 0,
                top: _top,
                width: 1500
            }
        })
        bannerAd.show()
        
    }


    hideBanner() {
       
    }

    isBannerAdLoodByInterval() {
        let seconds = this.currentTime();
        return seconds - this.lastBannerTime > this.bannerFailInitCnt * 20;
    }

    isBannerADLoad() {
        if (this.isH5) return this.bannerState == this.ADState.LoadSuccess;
        else return true;
    }

    /**
     * @param {string} v1
     * @param {string} v2
     * @returns {-1 | 0 | 1}
     */
    compareVersion(v1 : string, v2 : string) {
        var s1 = v1.split(".");
        var s2 = v2.split(".");
        var len = Math.max(s1.length, s2.length);

        for (let i = 0; i < len; i++) {
            var num1 = parseInt(s1[i] || "0");
            var num2 = parseInt(s2[i] || "0");

            if (num1 > num2) {
                return 1;
            } else if (num1 < num2) {
                return -1;
            }
        }

        return 0;
    }

    // v1 > v2 则返回值为 1
    // 1 === compareVersion("2.6.8", "1.24.10");

    // v1 = v2 则返回值为 0
    // 0 === compareVersion("2.6", "2.6.0");

    isEmpty (obj) {
        if (obj === '' || obj === null || obj === undefined) {
            return true;
        }
        else {
            return false;
        }
    }

    currentTime() {
        let now = new Date();
        let seconds = now.getTime() / 1000;
        return seconds;
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
