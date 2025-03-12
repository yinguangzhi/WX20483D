import { _decorator, Component, Node, sys } from 'cc';
import BaseSingleton from './tools/BaseSingleton';
const { ccclass, property } = _decorator;

// 方案二：微信云开发（无需自建后端）​
// 使用微信云开发的 ​云函数 替代传统后端，实现解密逻辑。

// ​步骤
// ​开通云开发
// 在微信公众平台 → 开发 → 云开发 → 开通环境（如 test-env）。
// ​创建云函数
// 在云开发控制台新建云函数 decodeUserInfo，代码如下：
// javascript
// // cloud/decodeUserInfo/index.js
// const cloud = require('wx-server-sdk');
// cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// exports.main = async (event, context) => {
//   const { encryptedData, iv } = event;
//   const wxContext = cloud.getWXContext();
//   // 解密数据
//   try {
//     const result = await cloud.getOpenData({
//       list: [encryptedData, iv],
//     });
//     return result.data;
//   } catch (err) {
//     return { error: '解密失败' };
//   }
// };
// ​前端调用云函数
// javascript
// wx.getUserProfile({
//   desc: '用于游戏内展示',
//   success: (res) => {
//     wx.cloud.callFunction({
//       name: 'decodeUserInfo',
//       data: {
//         encryptedData: res.encryptedData,
//         iv: res.iv
//       },
//       success: (response) => {
//         const { nickName, avatarUrl } = response.result;
//         wx.setStorageSync('userInfo', { nickName, avatarUrl });
//       }
//     });
//   }
// });

/** 授权的等级 */
export enum AUTH_LEVEL
{
    /** 必须授权 */
    MUST = 1,
    /** 必须授权，且失败后，会弹出二次弹窗确认是否重新授权 */
    MUST_WITH_SECOND = 2,

    /** 可能授权，会调用授权接口，如果拒绝，则不再要求授权 */
    MAYBE = 3,

    /** 不需要授权 */
    WAHTEVER = 4,
}
@ccclass('WeChatTool')
export class WeChatTool extends BaseSingleton<WeChatTool> {
    isWeChat : boolean = false;
    isVideoValid : boolean = false;
    isFullValid : boolean = false;
    isBannerValid : boolean = false;
    isBindShare : boolean = true;
    /** 是否调用进入游戏圈的接口，需要根据玩家的微信版本库来进行预判断 */
    isCanOpenGameClub = false;
    /** 是否可以订阅游戏更新，需要根据玩家的微信版本库来进行预判断 */
    isCanSubscribeInNewApp : boolean = false;
    /** 是否已经订阅了游戏更新推送 */
    subscribedInNewApp = false;


    /** 是否需要登陆成功，才能进入游戏 */
    needLoginSuccess = false;

    
    /** 授权等级 */
    authLevel : AUTH_LEVEL = AUTH_LEVEL.MAYBE;

    /** 需要在游戏内 提供按钮，点击按钮后才能弹出隐私引导的弹窗*/
    needPrivacyInButtonInGame = false;

    /** 需要在游戏内 提供按钮，点击按钮后才能进行隐私授权*/
    needAuthInButtonInGame = false;


    _userInfo : any =null;
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

    setStorageSync(_key : string,_value : any)
    {
        if(!this.isWeChat)
        {
            return;
        }
        this.wxSdk.setStorageSync(_key,_value);
    }
    getStorageSync(_key : string)
    {
        if(!this.isWeChat)
        {
            return null;
        }
        return this.wxSdk.getStorageSync(_key);
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

        let _nAuth = self.authLevel == AUTH_LEVEL.MUST || self.authLevel == AUTH_LEVEL.MUST_WITH_SECOND || self.authLevel == AUTH_LEVEL.MAYBE;

        self.wxSdk.login({
            success: (loginRes : any) => 
            {
                self.onGetSetting();

                if (loginRes.code) 
                {
                    console.log("登录 code:", loginRes.code);
                    _callback && _callback(true);
                } 
                else 
                {
                    //登录失败，正常来说无法进入游戏
                    console.error("登录失败:", loginRes.errMsg);
                    if(self.needLoginSuccess)
                    {}
                    else
                    {
                        _callback && _callback(false);
                    }
                }
            },
            fail: (err : any) => 
            {
                self.onGetSetting();

                //登录失败，正常来说无法进入游戏
                console.error("wx.login 调用失败:", err);
                if(self.needLoginSuccess)
                { }
                else
                {
                    _callback && _callback(false);
                }
            }
        });

        if(this.isBindShare)
        {
            this.bindShareMessage();
        }
    }

    /** 是否已经同意了隐私政策 */
    isAgreedPrivacy()
    {
        if(!this.isWeChat)
        {
            return true;
        }
        return this.getStorageSync("agreedPrivacy");
    }

    // /** 是否可以在登录后请求弹出隐私政策弹窗 */
    // canRequirePrivacyAfterLogin()
    // {
    //     return !this.isAgreedPrivacy() && this.needAuthInButtonInGame; 
    // }

    /** 登录后，调用弹出隐私政策弹窗 */
    requirePrivacyAuthorizeAfterLogin(_callback : any)
    {
        if(!this.isWeChat)
        {
            _callback && _callback(true);
            return;
        }
        
        let self = this;

        if(self.needPrivacyInButtonInGame)
        {
            _callback && _callback(true);
            return;
        }

        self.requirePrivacyAuthorize(_callback);
    }

    /** 调用弹出隐私政策弹窗 */
    requirePrivacyAuthorize(_callback : any)
    {
        let self = this;
        try
        {
            self.wxSdk.requirePrivacyAuthorize({
                success: () => {
                  // 用户同意授权
                  // runGame() 继续游戏逻辑
                    console.error("wx.requirePrivacyAuthorize 调用成功:");
                    _callback && _callback(true);
                },
                fail: () => {
                    // 用户拒绝授权
                    console.error("wx.requirePrivacyAuthorize 调用成功:");
                    _callback && _callback(false);
                }, 
                complete: () => {}
              })
        }
        catch(e)
        {
            _callback && _callback(false);
        }
    }
    

    /** 获取用户信息 */
    private getUserProfile(_callback : any) 
    {
        let self = this;
        self.wxSdk.getUserProfile({
            desc: '获取信息用于展示', // 必填
            success: (profileRes : any) => {
                console.log("用户信息:", profileRes.userInfo);
                self._userInfo = profileRes.userInfo;
                self.onAuthSuccess(_callback); // 授权成功处理
            },
            fail: (err : any) => {

                console.log("用户拒绝授权:", err);
                console.log("授权失败，根据情况显示重新授权提示:");

                if(self.authLevel == AUTH_LEVEL.MUST)
                {

                }
                else if(self.authLevel == AUTH_LEVEL.MUST_WITH_SECOND)
                {
                    self.showAuthTips(_callback); // 提示用户重新授权
                }
                else if(self.authLevel == AUTH_LEVEL.MAYBE)
                {
                    _callback && _callback();
                }
                
            }
        });
    }

    /** 授权成功 */
    private onAuthSuccess(_callback : any) {
        // 这里可跳转场景、更新 UI 或发送数据到服务器
        console.log("授权成功，用户昵称:", this._userInfo.nickName);
        _callback && _callback();
    }

    // 4. 显示重新授权提示
    /** 授权失败，根据情况显示重新授权提示 */
    private showAuthTips(_callback : any) {

        let self = this;

        console.log("显示重新授权提示:");

        self.wxSdk.showModal({
            title: '提示',
            content: '需要您授权才能正常使用',
            confirmText: '重新授权',
            success: (res : any) => {
                if (res.confirm) 
                {
                    this.getUserProfile(_callback); // 再次尝试获取
                }
            },
            fail : (err : any) =>
            {
                console.log("显示重新授权提示 失败 :",err);
            }
        });
    }

    /** 点击按钮 调用获取隐私授权的接口 */
    getUserProfileFromExternal(_callback : any)
    {
        this.getUserProfile(_callback);
    }

    /** 获取玩家的权限设置相关 */
    private onGetSetting()
    {
        let self = this;

        self.wxSdk.getSetting({
            success(res : any)
            {
                console.log("wx getSetting success : ",JSON.stringify(res));
                console.log("wx authSetting : ",res.authSetting);
                console.log("wx subscriptionsSetting : ",res.subscriptionsSetting)
                if(res.subscriptionsSetting && res.subscriptionsSetting.itemSettings)
                {
                    self.subscribedInNewApp = res.subscriptionsSetting.itemSettings['SYS_MSG_TYPE_WHATS_NEW'] == 'accept';
                }
            },
            fail(err : any)
            {
                console.log("wx getSetting fail : ",JSON.stringify(err));
              
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
        this.isCanSubscribeInNewApp = this.compareVersion(this.currSDKVersion,"2.32.1")  >= 0;
        this.isCanOpenGameClub = this.compareVersion(this.currSDKVersion,"2.8.0")  >= 0;
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
    showToast(_title : string,_icon : any,_duration : number = 1200)
    {
        if(!this.isWeChat)
        {
            return;
        }

        if(!_icon)
        {

            this.wxSdk.showToast({
                title : _title,
            })
        }
        else
        {
            
        this.wxSdk.showToast({
            title : _title,
            icon : _icon,
            duration : _duration,
        })
        }
    }

    /** 订阅游戏更新 */
    subscribeGame()
    {
        console.log(this.isWeChat ,"  ",this.isCanSubscribeInNewApp,"  ",this.subscribedInNewApp);
        if(!this.isWeChat)
        {
            return;
        }

        if(!this.isCanSubscribeInNewApp)
        {
            return;
        }

        if(this.subscribedInNewApp)
        {
            return;
        }

        console.log("this.wxSdk.requestSubscribeMessage");
        this.wxSdk.requestSubscribeMessage({
            tmplIds: ['SYS_MSG_TYPE_WHATS_NEW'], // 支持多个模板 ID
            success: (res : any) => {
                if (res['SYS_MSG_TYPE_WHATS_NEW'] === 'accept') {
                    console.log("用户同意订阅");
                    this.onSubscribeSuccess();
                } else {
                    console.log("用户拒绝订阅");
                    this.showSubscribeGuide();
                }
            },
            fail: (err : any) => {
                console.error("订阅请求失败:", err);
            }
        });

        // this.wxSdk.requestSubscribeWhatsNew({
        //     msgType: 1,    // 消息类型，1=游戏更新提醒，目前只有这种类型
        //     success(res : any) {
        //       //订阅成功或取消订阅 都会走这里
        //       console.log(res)
        //        // res.confirm === true 或 false
        //     },
        //     fail(err : any) {
        //       console.error(err)
        //     }
        //   })
    }

    private onSubscribeSuccess() {
        // 订阅成功逻辑（如保存订阅状态到服务器）
    }

    private showSubscribeGuide() {
        this.wxSdk.showModal({
            title: '提示',
            content: '开启订阅后可及时接收新功能通知~',
            confirmText: '去开启',
            success: (res : any) => {
                if (res.confirm) {
                    this.subscribeGame(); // 重新请求
                }
            }
        });
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

    /** 进入打开游戏圈 */
    openGameClub()
    {
        if(!this.isWeChat)
        {
            return;
        }
        if(!this.isCanOpenGameClub) 
        {
            return;
        }
    

        try
        {

            this.wxSdk.openGameClub({
                // 固定参数（0:通用页，1:排行榜，2:礼物页）
                clubId: 0,
                success: () => console.log('打开成功'),
                fail: (err) => console.error('失败:', err)
              });
        }
        catch(e)
        {
            console.log(e);
            this.isCanOpenGameClub = false;
            this.showToast("进入游戏圈失败",null);
        }
    }
    /** 打点，事件统计 */
    reportAnalytics(eventID : string,data : any = null)
    {
        let d = data ? data : {};
        this.wxSdk.reportAnalytics(eventID, d);
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