function __initApp () {  // init app
require('./libs/wrapper/builtin/index');
const firstScreen = require('./first-screen');
window.DOMParser = require('./libs/common/xmldom/dom-parser').DOMParser;
window.__globalAdapter = {};
require('./libs/wrapper/unify');
require('./libs/wrapper/fs-utils');


// Polyfills bundle.
require("src/polyfills.bundle.js");

// SystemJS support.
require("src/system.bundle.js");


// Adapt for IOS, swap if opposite
if (canvas){
    var _w = canvas.width;
    var _h = canvas.height;
    if (screen.width < screen.height) {
        if (canvas.width > canvas.height) {
            _w = canvas.height;
            _h = canvas.width;
        }
    } else {
        if (canvas.width < canvas.height) {
            _w = canvas.height;
            _h = canvas.width;
        }
    }
    canvas.width = _w;
    canvas.height = _h;

//     <view class="container">
//   <canvas id="gameCanvas"></canvas>
  
//   {/* <!-- 隐私协议弹窗 --> */}
//   <view wx:if="{{showPrivacy}}" class="privacy-modal">
//     <scroll-view scroll-y class="privacy-text">
//       <text>{{privacyContent}}</text>
//     </scroll-view>
//     <view class="privacy-buttons">
//       <button bindtap="onPrivacyDisagree">拒绝</button>
//       <button open-type="agreePrivacyAuthorization" bindagreeprivacyauthorization="onPrivacyAgree">同意</button>
//     </view>
//   </view>
// </view>

}
// Adjust initial canvas size
if (canvas && window.devicePixelRatio >= 2) {canvas.width *= 2; canvas.height *= 2;}

const importMap = require("src/import-map.js").default;
System.warmup({
    importMap,
    importMapUrl: 'src/import-map.js',
    defaultHandler: (urlNoSchema) => {
        require('.' + urlNoSchema);
    },
    handlers: {
        'plugin:': (urlNoSchema) => {
            requirePlugin(urlNoSchema);
        },
    },
});

/**
 * Fetch WebAssembly binaries.
 * 
 * Whereas WeChat expects the argument passed to `WebAssembly.instantiate`
 * to be file path and the path should be relative from project's root dir,
 * we do the path conversion and directly return the converted path.
 * 
 * @param path The path to `.wasm` file **relative from engine's out dir**(no leading `./`).
 * See 'assetURLFormat' field of build engine options.
 */
function fetchWasm(path) {
    const engineDir = 'cocos-js'; // Relative from project out
    return `${engineDir}/${path}`;
}
firstScreen.start('default', 'default', 'false').then(() => {
    return System.import('./application.js');
}).then((module) => {
    return firstScreen.setProgress(0.2).then(() => Promise.resolve(module));
}).then(({ createApplication }) => {
    return createApplication({
        loadJsListFile: (url) => require(url),
        fetchWasm,
    });
}).then((application) => {
    return firstScreen.setProgress(0.4).then(() => Promise.resolve(application));
}).then((application) => {
    return onApplicationCreated(application);
}).catch((err) => {
    console.error(err);
});

function onApplicationCreated(application) {
    return application.import('cc').then((module) => {
        return firstScreen.setProgress(0.6).then(() => Promise.resolve(module));
    }).then((cc) => {
        require('./libs/common/engine/index.js');
        require('./libs/wrapper/engine/index');
        require('./libs/common/cache-manager.js');
        // Adjust devicePixelRatio
        cc.view._maxPixelRatio = 4;
        // Release Image objects after uploaded gl texture
        cc.macro.CLEANUP_IMAGE_CACHE = false;
        return firstScreen.end().then(() => application.start({
            findCanvas: () => {
                var container = document.createElement('div');
                return { frame: container, canvas: window.canvas, container };
            },
        }));
    });
}

}  // init app

/**
     * 版本号大小判断
     * @param v1 
     * @param v2 
     * @returns 若为1  则 v1 > v2
     */
function compareVersion(v1, v2 ) 
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

var currSDKVersion = "0.0";
var sysInfo = null;
var platform = "";
try
{
    console.log("sys getSystemInfoSync in game.js : ");

    sysInfo = wx.getSystemInfoSync();
    platform = sysInfo.platform;
    currSDKVersion = sysInfo.SDKVersion;
    console.log(JSON.stringify(sysInfo));
}
catch(e)
{
    console.log("sys appBaseInfo  in game.js : ");
    //@ts-ignore
    let appBaseInfo = wx.getAppBaseInfo()
    currSDKVersion = appBaseInfo.SDKVersion;

    console.log(JSON.stringify(appBaseInfo));
}

console.log(JSON.stringify(currSDKVersion));
if(!platform) platform = "unknown";


if (platform.toLocaleLowerCase() === 'android') {
    GameGlobal.requestAnimationFrame (__initApp);
} else {
    __initApp();
}
