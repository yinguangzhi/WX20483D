import { _decorator, Component, Node } from 'cc';
import BaseSingleton from '../base/BaseSingleton';
const { ccclass, property } = _decorator;

@ccclass('WeChatTool')
export class WeChatTool extends BaseSingleton<WeChatTool> {
    
    isWeChat : boolean = false;

    login(_callback : any)
    {
        if(!this.isWeChat)
        {
            _callback && _callback();
            return;
        }

        let self = this;
        //@ts-ignore
        wx.login(
            {
                success (res : any) 
                {
                    self.onGetSetting(res.code,_callback);
                },
                fail (res : any)
                {

                }
            })
    }

    onGetSetting(code : any,_callback : any)
    {
        //@ts-ignore
        wx.getSetting({
            success(res : any)
            {
                if(res.authSetting["scope.userInfo"])
                {
                    //@ts-ignore
                    wx.getUserInfo({
                        lang : "zh_CN",
                        withCredentials : true,
                        success : function(result : any)
                        {
                            console.log("get userinfo : ",result);
                            _callback && _callback();
                        },
                        fail : function(result : any)
                        {

                        }
                    })
                }
                else
                {
                    //@ts-ignore
                    let sysInfo = wx.getSystemInfoSync();

                    //@ts-ignore
                    let button = wx.createUserInfoButton({
                        lang : "zh_CN",
                        type : "text",
                        text : "微信登录",
                        style : {
                            left : sysInfo.windowWidth / 2 - 50,
                            top : sysInfo.windowHeight / 2 - 30,
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
                        if(res.userInfo)
                        {
                            button.destroy();
                            console.log("button.onTap res : ",res);
                            _callback && _callback();
                        }
                        else
                        {
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
            }

        })
    
    }
}


