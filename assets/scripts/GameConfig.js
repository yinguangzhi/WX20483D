module.exports =
{
    
    // 1        2        3        4        5        6        7        8        9        10        11        12        13        14        15        16
    // 2        4        8        16       32       64      128      256      512      1024      2048      4096      8192      16384     32768     65536
    classicConfig:
        [
            // { targets: [256, 128, 64] },
            // { targets: [256, 128, 64] },
            // { targets: [256, 128, 64] },

            { targets: [128] },
            { targets: [128, 256, 64] },
            { targets: [256, 512, 128] },
            { targets: [512, 1024, 256] },
            { targets: [1024, 2048, 512] },
            { targets: [2048, 4096, 1024] },
            { targets: [4096, 8192, 2048] },
            { targets: [8192, 16384, 4096] },
            { targets: [16384, 32768, 8192] },
            { targets: [32768, 65536, 16384] },
            { targets: [65536, 131072, 32768] },
        ],

    getLevelConfig(level) {

        if (level <= this.classicConfig.length) return this.classicConfig[level - 1];
        else {
            let arg1 = Math.pow(2, level);
            let arg2 = Math.pow(2, (level + 1));
            let arg3 = Math.pow(2, (level - 1));
            let config = { targets: [arg1, arg2, arg3] };
            return config;
        }
    },

    defaultBombBallConfig:
        { skin: 1, value: 2 },

    defaultGameBallConfig:
        [
            { skin: 1, value: 2 },
            { skin: 1, value: 4 },
            { skin: 1, value: 2 },
            { skin: 1, value: 8 },
            //{ skin: 1, value: 2 },
            { skin: 1, value: 4 },
            // { skin: 1, value: 2 },
            // { skin: 1, value: 4 },
            // { skin: 1, value: 2 },
            // { skin: 1, value: 4 },
            // { skin: 1, value: 2 },
            // { skin: 1, value: 4 },
        ],

    defaultCubeConfig:
        [
            [
                {  value: 2, x: -1.1,y: 0,z: -6.5, angleX : 0,angleY : 0,angleZ : 0},
                {  value: 2, x: 0,y: 0,z: -6.5, angleX : 0,angleY : 0,angleZ : 0},
                {  value: 2, x: 1.1,y: 0,z: -6.5, angleX : 0,angleY : 0,angleZ : 0},
                {  value: 4, x: -0.6,y: 1,z: -6.5, angleX : 0,angleY : 0,angleZ : 0},
                {  value: 4, x: 0.6,y: 1,z: -6.5, angleX : 0,angleY : 0,angleZ : 0},
                {  value: 8, x: 0,y: 2,z: -6.5, angleX : 0,angleY : 0,angleZ : 0},
            ],
        ],


    valueDescConfig:
        [
            {value : 2048,desc : "匪夷所思！现在尝试合成 4096！"},
            {value : 4096,desc : "哇塞！8192怎么样？"},
            {value : 8192,desc : "你不会放弃，是吗？不过，我想你应该很难合成16384？"},
            {value : 16384,desc : "祝贺！只有1%的人能走到这一步！"},
            {value : 32768,desc : "你是我的新英雄！"},
            {value : 65536,desc : "你确定，你没有作弊吗？"},
            {value : 131072,desc : "不可能的！你是机器人吗？"},
            {value : 262144,desc : "祝贺！只有0.1%的玩家可以做到这一点！"},
        ],
    
    getDescFromValue(value) { 
        let descConfig = this.valueDescConfig.find(element => element.value == value);
        if (!descConfig) descConfig = this.valueDescConfig[4];
        return descConfig.desc;
    },
    // 1        2        3        4        5        6        7        8        9        10        11        12        13        14        15        16
    // 2        4        8        16       32       64      128      256      512      1024      2048      4096      8192      16384     32768     65536
    classProbabilityConfig:
        [
            {
                max: 2,
                probs: [{ value: 2, probability: 10 }]
            },
            {
                max: 4,
                probs: [{ value: 2, probability: 10 }]
            },
            {
                max: 8,
                probs:
                    [
                        { value: 2, probability: 10 },
                        { value: 4, probability: 4 }
                    ]
            },
            {
                max: 16,
                probs:
                    [
                        { value: 2, probability: 10 },
                        { value: 4, probability: 8 },
                        { value: 8, probability: 2 },
                    ]
            },
            {
                max: 32,
                probs:
                    [
                        { value: 2, probability: 12 },
                        { value: 4, probability: 10 },
                        { value: 8, probability: 6 },
                        { value: 16, probability: 1 },
                    ]
            },
            {
                max: 64,
                probs:
                    [
                        { value: 2, probability: 12 },
                        { value: 4, probability: 12 },
                        { value: 8, probability: 10 },
                        { value: 16, probability: 6 },
                    ]
            },
            {
                max: 128,
                probs:
                    [
                        { value: 2, probability: 12 },
                        { value: 4, probability: 12 },
                        { value: 8, probability: 10 },
                        { value: 16, probability: 8 },
                        { value: 32, probability: 3 },
                        { value: 64, probability: 1 },
                    ]
            },
            {
                max: 256,
                probs:
                    [
                        { value: 2, probability: 16 },
                        { value: 4, probability: 16 },
                        { value: 8, probability: 16 },
                        { value: 16, probability: 13 },
                        { value: 32, probability: 9 },
                        { value: 64, probability: 3 },
                    ]
            },
            {
                max: 512,
                probs:
                    [
                        { value: 2, probability: 16 },
                        { value: 4, probability: 16 },
                        { value: 8, probability: 16 },
                        { value: 16, probability: 15 },
                        { value: 32, probability: 12 },
                        { value: 64, probability: 5 },
                    ]
            },
            {
                max: 1024,
                probs:
                    [
                        { value: 2, probability: 16 },
                        { value: 4, probability: 16 },
                        { value: 8, probability: 16 },
                        { value: 16, probability: 15 },
                        { value: 32, probability: 12 },
                        { value: 64, probability: 9 },
                    ]
            },
            {
                max: 2048,
                probs:
                    [
                        { value: 2, probability: 16 },
                        { value: 4, probability: 16 },
                        { value: 8, probability: 16 },
                        { value: 16, probability: 16 },
                        { value: 32, probability: 15 },
                        { value: 64, probability: 15},
                        { value: 128, probability: 1 },
                    ]
            },
            {
                max: 4096,
                probs:
                    [
                        { value: 2, probability: 20 },
                        { value: 4, probability: 20 },
                        { value: 8, probability: 20 },
                        { value: 16, probability: 20 },
                        { value: 32, probability: 18 },
                        { value: 64, probability: 20 },
                        { value: 128, probability: 3 },
                        { value: 256, probability: 1 },
                    ]
            },
            {
                max: 8192,
                probs:
                    [
                        { value: 2, probability: 20 },
                        { value: 4, probability: 20 },
                        { value: 8, probability: 20 },
                        { value: 16, probability: 20 },
                        { value: 32, probability: 20 },
                        { value: 64, probability: 20 },
                        { value: 128, probability: 6 },
                        { value: 256, probability: 1 },
                    ]
            },
            {
                max: 16384,
                probs:
                    [
                        { value: 2, probability: 20 },
                        { value: 4, probability: 20 },
                        { value: 8, probability: 20 },
                        { value: 16, probability: 20 },
                        { value: 32, probability: 20 },
                        { value: 64, probability: 20 },
                        { value: 128, probability: 8 },
                        { value: 256, probability: 2 },
                        { value: 512, probability: 1 },
                    ]
            },
            {
                max: 32768,
                probs:
                    [
                        { value: 2, probability: 20 },
                        { value: 4, probability: 20 },
                        { value: 8, probability: 20 },
                        { value: 16, probability: 20 },
                        { value: 32, probability: 20 },
                        { value: 64, probability: 20 },
                        { value: 128, probability: 9 },
                        { value: 256, probability: 3 },
                        { value: 512, probability: 2 },
                        { value: 1024, probability: 1 },
                    ]
            },
            {
                max: 65536,
                probs:
                    [
                        { value: 2, probability: 20 },
                        { value: 4, probability: 20 },
                        { value: 8, probability: 20 },
                        { value: 16, probability: 20 },
                        { value: 32, probability: 20 },
                        { value: 64, probability: 20 },
                        { value: 128, probability: 10 },
                        { value: 256, probability: 5 },
                        { value: 512, probability: 3 },
                        { value: 1024, probability: 2 },
                        { value: 2048, probability: 1 },
                    ]
            },
        ],

    probabilityList: [],
    refreshProbability(max) {
        let config = this.classProbabilityConfig.find(element => element.max == max);
        if (!config) {
            let _length = this.classProbabilityConfig.length;
            let maxConfig = this.classProbabilityConfig[_length - 1];
            if (max > maxConfig.max) config = maxConfig;
        }

        if (config) {
            this.probabilityList.length = 0;
            for (let i = 0; i < config.probs.length; i++) {
                let prop = config.probs[i];
                for (let m = 0; m < prop.probability; m++) {
                    this.probabilityList.push(prop.value);
                }
            }
        }
    },

    // 1        2        3        4        5        6        7        8        9        10        11        12        13        14        15        16
    // 2        4        8        16       32       64      128      256      512      1024      2048      4096      8192      16384     32768     65536

    frames: [],
    frameAbouts : [],
    generateFrameAbouts(textures) { 
        this.frameAbouts = [];
        this.frames = textures;

        for (let i = 0; i < 16; i++) {
            let val = Math.pow(2, i + 1);

            let _name = val.toString();
            if (i == 15) _name = "64k";
            if (i == 14) _name = "32k";
            if (i == 13) _name = "16k";
            let ta = { value: val, name: _name, texture: this.frames[i] };
            // let ta = new TextureAbout(val, _name, this.textures[i]);
            this.frameAbouts.push(ta);
        }


        console.log(this.frameAbouts);
    },

   
    getFrameAbout(val, couldDefault) {
        let about = this.frameAbouts.find(element => element.value == val);
        if (!about && couldDefault) about = this.frameAbouts[3];

        return about;
    },

    textures: [],
    textureAbouts: [],
    generateTextureAbouts(textures) {

        this.textureAbouts = [];
        this.textures = textures;

        for (let i = 0; i < 40; i++) {
            let val = Math.pow(2, i + 1);

            let arg = val.toString();
            
            if (val > (1024 * 1024 * 1024 * 8)) { 
                arg = val / (1024 * 1024 * 1024) + 'G';
                
            } 
            else if (val > (1024 * 1024 * 8)) { 
                arg = val / (1024 * 1024) + 'M';
                
            } 
            else if (val > 8192) {
                arg = val / 1024 + 'K';
            }

            let tex = this.textures[arg];
            if (!tex) { 
                console.log(2222);
                tex = this.textures["16"];
            } 

            let ta = { value: val, name: tex.name, texture: tex };
            // let ta = new TextureAbout(val, _name, this.textures[i]);
            this.textureAbouts.push(ta);
        }


        console.log(this.textureAbouts);
    },

    getTextureAbout(val, couldDefault) {
        let about = this.textureAbouts.find(element => element.value == val);
        if (!about && couldDefault) about = this.textureAbouts[3];

        return about;
    },
}