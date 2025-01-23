require('./libs/wrapper/builtin');
window.DOMParser = require('./libs/common/xmldom/dom-parser').DOMParser;
window.__globalAdapter = {};
require('./libs/wrapper/unify');
require('./libs/wrapper/fs-utils');

// Polyfills bundle.
require("src/polyfills.bundle.js");


// SystemJS support.
window.self = window;
require("src/system.bundle.js");

const info = my.getSystemInfoSync();
canvas.width = info.screenWidth;
canvas.height = info.screenHeight;

if (info.platform == "iOS") {
    canvas.width *= info.pixelRatio;
    canvas.height *=  info.pixelRatio;
} else {
}

const importMap = require("src/import-map.js").default;
System.warmup({
    importMap,
    importMapUrl: 'src/import-map.js',
    defaultHandler: (urlNoSchema) => {
        require('.' + urlNoSchema);
    },
});

System.import('./application.js').then(({ createApplication }) => {
    return createApplication({
        loadJsListFile: (url) => require(`./${url}`),
        fetchWasm: (url) => url,
    });
}).then((application) => {
    return onApplicationCreated(application);
}).catch((err) => {
    console.error(err);
});

function onApplicationCreated(application) {
    return application.import('cc').then((cc) => {
        require('./libs/common/engine/index.js');
        require('./libs/wrapper/engine/index.js');
        // not support require twice
        // require('./libs/common/cache-manager.js');
        // Adjust devicePixelRatio
        cc.view._maxPixelRatio = 5;
        // Release Image objects after uploaded gl texture
        cc.macro.CLEANUP_IMAGE_CACHE = false;

        return application.start({
            findCanvas: () => {
                var container = document.createElement('div');
                return { frame: container, canvas: window.canvas, container };
            },
        });
    });
}
