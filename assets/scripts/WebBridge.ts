import { _decorator, Component, Node } from 'cc';
import BaseSingleton from './tools/BaseSingleton';
import { WeChatTool } from './WeChatTool';
const { ccclass, property } = _decorator;

@ccclass('WebBridge')
export class WebBridge extends BaseSingleton<WebBridge> {
    
    loadFull()
    {
        WeChatTool.Instance().loadFull();
    }

    displayFull(_event : string,_wait : boolean,_callback : any)
    {
        let displayCall = () => { 
        
            WeChatTool.Instance().showFull((state : boolean) => {
                _callback && _callback(state);
            })
        }

        
        if (!WeChatTool.Instance().isFullLoaded()) 
        {
            if(_wait)
            {
                // Handler.UIUtils.displayMask(true);    
                
                let t = setTimeout(() => {

                    // Handler.UIUtils.displayMask(false);
                    
                    WeChatTool.Instance().loadFullFinishCallBack = null;
                    
                    displayCall();
        
                }, 5000)

                WeChatTool.Instance().loadFullFinishCallBack = () => {

                    // Handler.UIUtils.displayMask(false);
                    
                    clearTimeout(t);
                    displayCall();
                };
            }
            else displayCall();

            this.loadFull();

        }
        else displayCall();
    }

    loadVideo()
    {
        WeChatTool.Instance().loadVideo();
    }

    displayVideo(_event : string,_wait : boolean,_callback : any)
    {
        console.log("视频,广告")
        let displayCall = () => { 
        
            if (WeChatTool.Instance().isVideoLoaded()) {

                WeChatTool.Instance().showVideo((state : boolean) => {
                    _callback && _callback(state);
                })
            }
            else 
            {
                console.log("video is not ready!");
                WeChatTool.Instance().showToast("广告尚未加载!请稍后","loading");
                _callback && _callback(false);
                
            }
        }

        _wait = false;
        
        if (!WeChatTool.Instance().isVideoLoaded()) 
        {
            if(_wait)
            {
                // Handler.UIUtils.displayMask(true);    
                
                let t = setTimeout(() => {

                    // Handler.UIUtils.displayMask(false);
                    
                    WeChatTool.Instance().loadVideoFinishCallBack = null;
                    
                    displayCall();
        
                }, 5000)

                WeChatTool.Instance().loadVideoFinishCallBack = () => {

                    // Handler.UIUtils.displayMask(false);
                    
                    clearTimeout(t);
                    displayCall();
                };
            }
            else displayCall();

            this.loadVideo();

        }
        else displayCall();
    }

    loadBanner(_show : boolean)
    {
        WeChatTool.Instance().loadBanner(_show,null);
    }

    showBanner(_callback : any = null)
    {
        WeChatTool.Instance().showBanner(null);
    }


    hideBanner()
    {
        WeChatTool.Instance().hideBanner(null);
    }
}


