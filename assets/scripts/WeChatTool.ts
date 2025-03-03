import { _decorator, Component, Node, sys } from 'cc';
import BaseSingleton from './tools/BaseSingleton';
const { ccclass, property } = _decorator;

@ccclass('WeChatTool')
export class WeChatTool extends BaseSingleton<WeChatTool> {
    isWeChat : boolean = false;
    isVideoValid : boolean = false;
    isFullValid : boolean = false;
    isBannerValid : boolean = false;
    isBindShare : boolean = true;
    isCouldSubscribe : boolean = false;

    useUserScope : boolean = false;

    wxSdk : any = null;

    currSDKVersion = "";
    windowWidth = 720;
    windowHeight = 1280;

    init()
    {
        this.isWeChat = sys.platform == sys.Platform.WECHAT_GAME;

        if(!this.isWeChat) return;

        //@ts-ignore
        this.wxSdk = wx
        
        // //@ts-ignore
        // this.isWeChat = typeof wx !== 'undefined';
    }

    initPlatform()
    {
        this.isWeChat = sys.platform == sys.Platform.WECHAT_GAME;

        //@ts-ignore
        this.wxSdk = wx;
    }

    login(_callback : any)
    {
        if(!this.isWeChat)
        {
            _callback && _callback();
            return;
        }

        this.getSystemInWeChat();

        let self = this;
        //@ts-ignore
        wx.login(
            {
                success (res : any) 
                {
                    console.log("wx login success : ");
                    self.onGetSetting(res.code,_callback);
                },
                fail (res : any)
                {
                    console.log("wx login fail : ",JSON.stringify(res));
                }
            })



        if(this.isBindShare)
        {
            this.bindShareMessage();
        }

        
    }

    onGetSetting(code : any,_callback : any)
    {
        let self = this;
        //@ts-ignore
        wx.getSetting({
            success(res : any)
            {
                console.log("wx getSetting success : ",JSON.stringify(res));

                if(res.authSetting["scope.userInfo"])
                {
                    //@ts-ignore
                    wx.getUserInfo({
                        lang : "zh_CN",
                        withCredentials : true,
                        success : function(result : any)
                        {
                            console.log("get userinfo success : ",result);
                            _callback && _callback();
                        },
                        fail : function(result : any)
                        {
                            console.log("get userinfo  fail : ",JSON.stringify(result));
                            if(!self.useUserScope)
                            {
                                _callback && _callback(false);
                                return;
                            }
                        }
                    })
                }
                else
                {
                    console.log("cant get userInfo : ",self.useUserScope);

                    if(!self.useUserScope)
                    {
                        _callback && _callback(false);
                        return;
                    }

                    console.log("create button");

                    //@ts-ignore
                    let button = wx.createUserInfoButton({
                        lang : "zh_CN",
                        type : "text",
                        text : "微信登录",
                        style : {
                            left : self.windowWidth / 2 - 50,
                            top : self.windowHeight / 2 - 30,
                            width : 100,
                            height : 60,
                            backgroundColor : "#c7a976",
                            borderColor : "#5c5941",
                            textAlign : "center",
                            fontSize : 16,
                            borderWidth : 4,
                            borderRadius : 4,
                            lineHeight : 60,
                        }
                        
                    })

                    button.onTap((res : any) =>
                    {
                        console.log("createUserInfoButton onTap : ",JSON.stringify(res));

                        if(res.userInfo)
                        {
                            console.log("createUserInfoButton onTap res userInfo 1 : ",JSON.stringify(res.userInfo));

                            button.destroy();
                            _callback && _callback(true);
                        }
                        else
                        {
                            console.log("createUserInfoButton onTap res userInfo  2 : ");
                            //@ts-ignore
                            wx.showModal({
                                title : "温馨提示",
                                content : "需要您的用户信息登录游戏!",
                                showCancel : false,
                            })
                        }
                    })

                    button.show();
                }
            },
            fail(err : any)
            {
                console.log("wx getSetting fail : ",JSON.stringify(err));
                if(!self.useUserScope)
                {
                    _callback && _callback(false);
                    return;
                }
            }

        })
    
    }


    getSystemInWeChat()
    {
            
        console.log("sys info : ");
        
        let sysInfo = null;
        try
        {
            //@ts-ignore
            sysInfo = wx.getSystemInfoSync();
            this.currSDKVersion = sysInfo.SDKVersion;
            console.log(JSON.stringify(sysInfo));
        }
        catch(e)
        {
            console.log("sys appBaseInfo : ");
            //@ts-ignore
            let appBaseInfo = wx.getAppBaseInfo()
            this.currSDKVersion = appBaseInfo.SDKVersion;

            console.log(appBaseInfo.SDKVersion)
            console.log(appBaseInfo.enableDebug)
            console.log(appBaseInfo.host)
            console.log(appBaseInfo.language)
            console.log(appBaseInfo.version)
            console.log(appBaseInfo.theme)
            console.log(JSON.stringify(appBaseInfo));
        }

        console.log(JSON.stringify(this.currSDKVersion));
        this.isVideoValid = this.compareVersion(this.currSDKVersion,"2.0.4")  >= 0;
        this.isFullValid = this.compareVersion(this.currSDKVersion,"2.6.0")  >= 0;
        this.isBannerValid = this.compareVersion(this.currSDKVersion,"2.0.4")  >= 0;
        this.isCouldSubscribe = this.compareVersion(this.currSDKVersion,"2.10.4")  >= 0;
    }

    vibrateAction()
    {
        if(!this.isWeChat)
        {
            return;
        }

        try
        {
            if (this.isWeChat)
                {
                    this.wxSdk.vibrateShort({
                        success: function(res) {
                            // console.log(res);
                            // this.wxSdk.alert({
                            //     title: "震动起来了"
                            // });
                        },
                        fail: function(err) {
                            // console.log(err);
                            // this.wxSdk.alert({
                            //     title: "震动失败了"
                            // });
                        }
                        });
                }
                else if (this.vibrateState == 2) navigator.vibrate(10);
        }
        catch(e)
        {

        }
    }

    

    vibrateState = 0;
    checkVibrate()
    {
        if (this.vibrateState != 0) return;

        let _could = "vibrate" in navigator;
        if (_could) this.vibrateState = 2;
        else this.vibrateState = 3;
    }

    /** 内置弹框 */
    showToast(_title : string,_icon : any)
    {
        if(!this.isWeChat)
        {
            return;
        }

        this.wxSdk.showToast({
            title : _title,
        })
    }

    /** 订阅游戏 */
    subscribeGame()
    {
        if(!this.isWeChat)
        {
            return;
        }

        if(!this.isCouldSubscribe)
        {
            return;
        }

        this.wxSdk.requestSubscribeWhatsNew({
            msgType: 1,    // 消息类型，1=游戏更新提醒，目前只有这种类型
            success(res : any) {
              //订阅成功或取消订阅 都会走这里
              console.log(res)
               // res.confirm === true 或 false
            },
            fail(err : any) {
              console.error(err)
            }
          })
    }

    /** 分享 */
    shareAppMessage(_callback : any)
    {
        if(!this.isWeChat)
        {
            return;
        }

        this.wxSdk.shareAppMessage({
            title: '来吧,弹一弹'
        })

    }

    bindShareMessage()
    {
        if(!this.isWeChat)
        {
            return;
        }

        this.wxSdk.onShareAppMessage(function () {
            return {
              title: '来吧,弹一弹',
            //   imageUrl: canvas.toTempFilePathSync({
            //     destWidth: 500,
            //     destHeight: 400
            //   })
            }
          })
    }

    /**
     * 版本号大小判断
     * @param v1 
     * @param v2 
     * @returns 若为1  则 v1 > v2
     */
    compareVersion(v1 :any, v2 : any) 
    {
        v1 = v1.split('.')
        v2 = v2.split('.')
        let len = Math.max(v1.length, v2.length)
      
        while (v1.length < len) 
        {
            v1.push('0')
        }
        while (v2.length < len) 
        {

            v2.push('0')
        }
      
        for (let i = 0; i < len; i++) 
        {
            let num1 = parseInt(v1[i])
            let num2 = parseInt(v2[i])
        
            if (num1 > num2) 
            {
                return 1
            } 
            else if (num1 < num2) 
            {
                return -1
            }
        }
      
        return 0
    }


    bannerID = '';
    bannerAd : any = null;
    loadBanner(_show : boolean,_callback : any)
    {
        if(!this.isWeChat || this.isEmpty(this.bannerID))
        {
            _callback && _callback(false);
            return;
        }

        let self = this;
        //@ts-ignore
        this.bannerAd = wx.createBannerAd({
            adUnitId: self.bannerID,
            adIntervals: 60,//60s刷新一次
            style: {
              left: 10,
              top: 76,
              width: 320
            }
          });
          
        this.bannerAd.onError((err : any) => 
            {
                console.log("banner 广告加载失败 : ",err);
            });
        this.bannerAd.onLoad(() => 
            {
                console.log("banner 广告加载成功");
            });

        if(_show) 
        {
            this.showBanner(_callback);
        }
    }

    showBanner(_callback : any)
    {
        if(!this.isWeChat || this.isEmpty(this.bannerID))
        {
            _callback && _callback(false);
            return;
        }

        if(!this.bannerAd)
        {
            _callback && _callback(false);
            return;
        }
        this.bannerAd.show()
        .then(() => {
            console.log("banner 广告显示")
        })
        .catch((err : any) => 
        {
            console.log("banner 广告显示失败",err)
        });;
    }

    hideBanner(_callback : any)
    {
        if(!this.isWeChat || this.isEmpty(this.bannerID))
        {
            _callback && _callback(false);
            return;
        }

        if(!this.bannerAd)
        {
            _callback && _callback(false);
            return;
        }

        this.bannerAd.hide();
    }

    isVideoLoaded()
    {
        return this.videoAd && this.videoState == AD_STATE.SUCCESS;
    }

    isVideoLoading()
    {
        return this.videoAd && this.videoState == AD_STATE.LOADING;
    }

    videoID = '';
    videoAd : any = null;
    videoState = AD_STATE.NOT_LOAD;
    videoDisplayCallback : any = null;
    loadVideoFinishCallBack : any = null;
    loadVideo()
    {
        if(!this.isWeChat || this.isEmpty(this.videoID))
        {
            this.loadVideoFinishCallBack && this.loadVideoFinishCallBack(false);
            return;
        }

        let self = this;

        if(this.videoAd)
        {
            return;
        }

        if(self.videoState == AD_STATE.LOADING || self.videoState == AD_STATE.SUCCESS)
        {

            return;
        }

        self.videoState = AD_STATE.LOADING;
        //@ts-ignore
        this.videoAd = wx.createRewardedVideoAd({
            adUnitId: self.videoID
          });
          
        this.videoAd.onError((err : any) => 
            {
                self.videoState = AD_STATE.FAIL;
                console.log("videoAd 广告加载失败 : ",err);
                this.loadVideoFinishCallBack && this.loadVideoFinishCallBack(false);
            });
        this.videoAd.onLoad(() => 
            {
                self.videoState = AD_STATE.SUCCESS;
                console.log("videoAd 广告加载成功");
                this.loadVideoFinishCallBack && this.loadVideoFinishCallBack(true);
            });

        this.videoAd.onClose((res : any) => {
            // 用户点击了【关闭广告】按钮
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            if ((res && res.isEnded) || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                this.videoDisplayCallback && this.videoDisplayCallback(true);
            } else {
                // 播放中途退出，不下发游戏奖励
                this.videoDisplayCallback && this.videoDisplayCallback(false);
            }
            self.videoState = AD_STATE.NOT_LOAD;

        });
    }

    
    showVideo(_callback : any)
    {
        let self = this;
        this.videoDisplayCallback = _callback;

        if(!this.isWeChat || this.isEmpty(this.videoID))
        {
            _callback && _callback(false);
            return;
        }

        if(!this.videoAd)
        {
            _callback && _callback(false);
            return;
        }


        this.videoAd.show()
            .then(() => {

                console.log("videoAd 广告显示");

                self.videoState = AD_STATE.NOT_LOAD;
            })
            .catch((err : any) => 
            {
                self.videoState = AD_STATE.NOT_LOAD;
                console.log("videoAd 广告显示失败",err);
                // this.videoAd.load().then(() => this.videoAd.show());
                _callback && _callback(false);
            });;
    }

    isFullMaxDelta() {
        
        let _time = this.currentTime();
        return _time - this.lastFullTime > 27;
    }

    isFullLoaded()
    {
        return this.fullAd && this.fullState == AD_STATE.SUCCESS;
    }

    isFullLoading()
    {
        return this.fullAd && this.fullState == AD_STATE.LOADING;
    }

    lastFullTime = -10;
    fullID = '';
    fullAd : any = null;
    fullState = 0;
    fullDisplayCallback : any = null;
    loadFullFinishCallBack : any = null;
    loadFull()
    {
        if(!this.isWeChat || this.isEmpty(this.fullID))
        {
            this.loadFullFinishCallBack && this.loadFullFinishCallBack(false);
            return;
        }

        let self = this;

        if(self.fullState == AD_STATE.LOADING || self.fullState == AD_STATE.SUCCESS)
        {
            
            return;
        }

        self.fullState = 1;
        //@ts-ignore
        this.fullAd = wx.createInterstitialAd({
            adUnitId: self.fullID
          });
          
        this.fullAd.onError((err : any) => 
            {
                self.fullAd = AD_STATE.FAIL;
                console.log("fullAd 广告加载失败 : ",err);
            });
        this.fullAd.onLoad(() => 
            {
                self.fullAd = AD_STATE.SUCCESS;
                console.log("fullAd 广告加载成功");
            });

        this.fullAd.onClose((res : any) => {
            console.log("fullAd 广告关闭");
            self.fullAd = AD_STATE.NOT_LOAD;
            this.fullDisplayCallback && this.fullDisplayCallback(true);
        });
    }

    
    showFull(_callback : any)
    {
        let self = this;
        this.fullDisplayCallback = _callback;

        if(!this.isWeChat || this.isEmpty(this.fullID))
        {
            this.fullDisplayCallback && this.fullDisplayCallback(false);
            return;
        }

        if(!this.fullAd)
        {
            this.fullDisplayCallback && this.fullDisplayCallback(false);
            return;
        }

        if(self.fullState != AD_STATE.SUCCESS)
        {
            this.fullDisplayCallback && this.fullDisplayCallback(false);
            return;
        }

        self.lastFullTime = this.currentTime();

        this.fullAd.show()
            .then(() => {
                self.fullState = AD_STATE.NOT_LOAD;
                console.log("fullAd 广告显示");
            })
            .catch((err : any) => 
            {
                self.fullState = AD_STATE.NOT_LOAD;
                console.log("fullAd 广告显示失败",err);
                this.fullDisplayCallback && this.fullDisplayCallback(false);
            });;
    }

    currentTime() {
        let now = new Date();
        let seconds = now.getTime() / 1000;
        return seconds;
    }

    postDataToServer(_callback : any)
    {
        if(!this.isWeChat)
        {
            _callback && _callback(false,null);
            return;
        }

        //@ts-ignore
        wx.setUserCloudStorage({
            KVDataList : []
        })
    }

    readDataFromServer()
    {

    }

    isEmpty (obj : any) {
        
        return obj === '' || obj === null || obj === undefined;
    }
}

export enum AD_STATE
{
    NOT_LOAD,
    LOADING,
    SUCCESS,
    FAIL,
}


