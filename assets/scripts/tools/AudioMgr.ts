/*
 * @Author: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @Date: 2024-05-05 22:38:27
 * @LastEditors: shaoshude yinhuanhuan@31724753.onaliyun.com
 * @LastEditTime: 2024-05-05 23:18:00
 * @FilePath: \ALUnity2048\assets\scripts\tools\AudioMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { _decorator, AudioClip, AudioSource, Component, Enum, isValid, Node, resources } from 'cc';
import BaseSigleton from './BaseSingleton';
import { LoaderMgr } from './LoaderMgr';
const { ccclass, property } = _decorator;

var MusicStatus = Enum({
    None: 1,
    Playing: 2,
    Pause: 3,
    Loading: 4,
});
 
@ccclass('AudioMgr')
export class AudioMgr extends BaseSigleton<AudioMgr> {
    audioSourceArray: AudioSource[] = [];

    audioMap = {};

    musicStatus = MusicStatus.None;

    musicState = true;
    audioState = true;

    musicEngine: AudioSource = null!;
    audioEngine: AudioSource = null!;

    bindAudioIndex = 0;

    getAudioSource() {
        let arg: AudioSource = null;
        for (let i = 0; i < this.audioSourceArray.length; i++) {
            let asa = this.audioSourceArray[i];
            if (!asa) continue;
            if (!isValid(asa)) continue;

            if (asa.playing) continue;

            arg = asa;
        }

        if (!arg) {
            arg = new AudioSource();
            this.audioSourceArray.push(arg);
        }

        console.log(this.audioSourceArray.length)
        return arg;
    }


    setAudioState(state: boolean) {
        this.audioState = state;
    }

    setMusicState(state: boolean, _behavior: boolean = true) {
        this.musicState = state;

        this.checkMusicSource();

        if (_behavior) {

            if (this.musicState) {
                if (this.musicStatus == MusicStatus.None || this.musicStatus == MusicStatus.Pause) {
                    if (this.musicEngine) this.musicEngine.play();
                }

                this.musicStatus = MusicStatus.Playing;
            }
            else this.pauseMusic();
        }
    }

    playMusic(iInfo: IAudioInfo, volume: number = 1, loop: boolean = true) {
        // if (!this.musicState) return;

        this.checkMusicSource();

        let url = iInfo.string;
        this.loadAudio(url, (clip: AudioClip) => {

            if (clip == null) return;

            if (this.musicEngine && this.musicEngine.clip != clip) {
                this.musicEngine.stop();
                this.musicEngine.clip = clip;
                this.musicEngine.loop = true;
            }

            if (!this.musicState) return;

            if (this.musicStatus == MusicStatus.Pause) return;

            this.musicStatus = MusicStatus.Playing;

            this.musicEngine.play();
        })
    }

    pauseMusic() {

        console.log("pause : ", this.musicStatus);
        if (this.musicStatus == MusicStatus.None) return;

        this.checkMusicSource();


        if (this.musicStatus == MusicStatus.Playing) this.musicEngine.pause();

        this.musicStatus = MusicStatus.Pause;
    }

    resumeMusic() {
        if (!this.musicState) return;

        console.log("resume : ", this.musicStatus);
        if (this.musicStatus == MusicStatus.None) return;
        this.checkMusicSource();

        if (this.musicStatus == MusicStatus.Pause)
        {
            this.musicEngine.play();
            this.musicStatus = MusicStatus.Playing;
        } 
    }

    checkMusicSource() {

        if (this.musicEngine == null) {
            this.musicEngine = new AudioSource();
        }
    }

    getMillion() {
        let now = new Date();
        return now.getTime();
    }

    public playAudio(iInfo: IAudioInfo, volume: number = 1, loop: boolean = false) {
        
        if (!iInfo) return;

        if (!this.audioState) return;

        let url = iInfo.string;

        if (iInfo == AUDIO_NAME.bindAudio) {
            this.bindAudioIndex++;
            if (this.bindAudioIndex > 5) this.bindAudioIndex = 1;
            url += this.bindAudioIndex;
        }

        this.loadAudio(url, (clip: AudioClip) => {
            if (clip == null) return;

            let asa = this.getAudioSource();
            asa.volume = volume;
            asa.clip = clip;
            asa.loop = loop;
            asa.playOneShot(clip);
        })
    }

    loadAudio(url: string, callback: any = null) {

        let clip = this.audioMap[url];
        if (isValid(clip)) {
            callback && callback(clip);
            return;
        }

        let url2 = 'Audio/' + url;
        
        LoaderMgr.Instance().loadAssetAsync("subGame",url2, AudioClip, null, 0)
            .then((clip: AudioClip) =>
            {
                this.audioMap[url] = clip;
                callback && callback(clip);
            })
            .catch((error) =>
            {
                console.log("music error : " + url2)
                console.log(error);
                callback && callback(null);

            })
    }
}

interface IAudioInfo {
    string: string,
    type: string,
}

export const AUDIO_NAME = {
    
    bomb: {
        string: "bomb",
        type: "audio",
    },
    mute: {
        string: "mute",
        type: "audio",
    },
    hit1: {
        string: "hit4",
        type: "audio",
    },
    shootAudio: {
        string: "hit3",
        type: "audio",
    },
    click: {
        string: "click",
        type: "audio",
    },
    bindAudio: {
        string: "Rising Combo Hit 0",
        type: "audio",
    },
    lightning: {
        string: "lightning",
        type: "audio",
    },
    music: {
        string: "bgm",
        type: "music",
    },
}
